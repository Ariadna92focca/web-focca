"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
    Trophy, 
    Calendar, 
    FileText, 
    CheckCircle, 
    XCircle, 
    Clock, 
    Upload, 
    Trash2, 
    Check, 
    X, 
    Loader2, 
    Search, 
    Building2, 
    UserCheck, 
    ToggleLeft, 
    ToggleRight,
    AlertCircle,
    Download
} from "lucide-react";

interface LigaConfig {
    id: string;
    anio: number;
    inscripciones_abiertas: boolean;
    url_bases: string | null;
    updated_at: string;
}

interface Asociacion {
    id: string;
    nombre: string;
}

interface Inscripcion {
    id: string;
    anio: number;
    nombre_completo: string;
    numero_criador: string;
    tipo_asociacion: 'propia' | 'otra';
    asociacion_id: string | null;
    otra_asociacion_nombre: string | null;
    grupos_razas: string[];
    estado: 'pendiente' | 'aceptado' | 'rechazado';
    observaciones_admin: string | null;
    created_at: string;
    asociaciones?: Asociacion;
}

export default function LigaSansofeAdmin() {
    const [selectedAnio, setSelectedAnio] = useState<number>(new Date().getFullYear());
    const [config, setConfig] = useState<LigaConfig | null>(null);
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [statusFilter, setStatusFilter] = useState<'todos' | 'pendiente' | 'aceptado' | 'rechazado'>('todos');
    const [searchTerm, setSearchTerm] = useState('');

    // Actions state
    const [updatingConfig, setUpdatingConfig] = useState(false);
    const [uploadingBases, setUploadingBases] = useState(false);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchLigaData();
    }, [selectedAnio]);

    const fetchLigaData = async () => {
        try {
            setLoading(true);
            setMessage(null);

            // Fetch or initialize config for the selected year
            let { data: configData, error: configError } = await supabase
                .from('liga_sansofe_config')
                .select('*')
                .eq('anio', selectedAnio)
                .maybeSingle();

            if (configError) throw configError;

            if (!configData) {
                // Auto create config for the year if it doesn't exist
                const { data: newConfig, error: createError } = await supabase
                    .from('liga_sansofe_config')
                    .insert({ anio: selectedAnio, inscripciones_abiertas: false })
                    .select()
                    .single();

                if (createError) throw createError;
                configData = newConfig;
            }

            setConfig(configData as LigaConfig);

            // Fetch registrations for the selected year
            const { data: inscripcionesData, error: inscripError } = await supabase
                .from('liga_sansofe_inscripciones')
                .select('*, asociaciones(id, nombre)')
                .eq('anio', selectedAnio)
                .order('created_at', { ascending: false });

            if (inscripError) throw inscripError;
            setInscripciones((inscripcionesData || []) as unknown as Inscripcion[]);

        } catch (error: any) {
            console.error("Error al cargar datos de la Liga SANSOFÉ:", error);
            setMessage({ type: 'error', text: 'Error al cargar la información de la Liga.' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleInscripciones = async () => {
        if (!config) return;
        try {
            setUpdatingConfig(true);
            const nuevoEstado = !config.inscripciones_abiertas;

            const { error } = await supabase
                .from('liga_sansofe_config')
                .update({ 
                    inscripciones_abiertas: nuevoEstado,
                    updated_at: new Date().toISOString()
                })
                .eq('id', config.id);

            if (error) throw error;

            setConfig(prev => prev ? { ...prev, inscripciones_abiertas: nuevoEstado } : null);
            setMessage({ 
                type: 'success', 
                text: `Inscripciones ${nuevoEstado ? 'activadas' : 'desactivadas'} para la edición ${selectedAnio}.` 
            });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error al actualizar estado.' });
        } finally {
            setUpdatingConfig(false);
        }
    };

    const handleUploadBases = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !config) return;
        const file = e.target.files[0];

        try {
            setUploadingBases(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `liga_sansofe/bases_${selectedAnio}_${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('documentos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { error: dbError } = await supabase
                .from('liga_sansofe_config')
                .update({ url_bases: fileName, updated_at: new Date().toISOString() })
                .eq('id', config.id);

            if (dbError) throw dbError;

            setConfig(prev => prev ? { ...prev, url_bases: fileName } : null);
            setMessage({ type: 'success', text: 'Bases de la Liga subidas correctamente.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error al subir las bases.' });
        } finally {
            setUploadingBases(false);
            e.target.value = '';
        }
    };

    const handleDeleteBases = async () => {
        if (!config || !config.url_bases) return;
        if (!confirm('¿Seguro que deseas eliminar el documento de bases?')) return;

        try {
            setUploadingBases(true);
            await supabase.storage.from('documentos').remove([config.url_bases]);

            const { error } = await supabase
                .from('liga_sansofe_config')
                .update({ url_bases: null, updated_at: new Date().toISOString() })
                .eq('id', config.id);

            if (error) throw error;

            setConfig(prev => prev ? { ...prev, url_bases: null } : null);
            setMessage({ type: 'success', text: 'Documento de bases eliminado.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error al eliminar bases.' });
        } finally {
            setUploadingBases(false);
        }
    };

    const handleUpdateEstadoInscripcion = async (id: string, nuevoEstado: 'aceptado' | 'rechazado') => {
        try {
            setProcessingId(id);
            const { error } = await supabase
                .from('liga_sansofe_inscripciones')
                .update({ estado: nuevoEstado })
                .eq('id', id);

            if (error) throw error;

            setInscripciones(prev => prev.map(item => item.id === id ? { ...item, estado: nuevoEstado } : item));
            setMessage({ 
                type: 'success', 
                text: `Solicitud ${nuevoEstado === 'aceptado' ? 'aceptada' : 'rechazada'} con éxito.` 
            });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error al actualizar solicitud.' });
        } finally {
            setProcessingId(null);
        }
    };

    const handleDeleteInscripcion = async (id: string) => {
        if (!confirm('¿Seguro que deseas eliminar esta solicitud de inscripción?')) return;

        try {
            setProcessingId(id);
            const { error } = await supabase
                .from('liga_sansofe_inscripciones')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setInscripciones(prev => prev.filter(item => item.id !== id));
            setMessage({ type: 'success', text: 'Inscripción eliminada.' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error al eliminar inscripción.' });
        } finally {
            setProcessingId(null);
        }
    };

    const handleDownloadDocument = async (filePath: string, fileName: string) => {
        try {
            const { data, error } = await supabase.storage.from('documentos').download(filePath);
            if (error) throw error;

            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert('Error al descargar el archivo.');
        }
    };

    const filteredInscripciones = inscripciones.filter(item => {
        const matchesStatus = statusFilter === 'todos' || item.estado === statusFilter;
        const asocNombre = item.tipo_asociacion === 'propia' 
            ? (item.asociaciones?.nombre || '') 
            : (item.otra_asociacion_nombre || '');
        const matchesSearch = 
            item.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.numero_criador.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asocNombre.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: inscripciones.length,
        pendientes: inscripciones.filter(i => i.estado === 'pendiente').length,
        aceptadas: inscripciones.filter(i => i.estado === 'aceptado').length,
        rechazadas: inscripciones.filter(i => i.estado === 'rechazado').length,
    };

    return (
        <div className="space-y-8">
            {/* Header & Year Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-foreground font-heading">
                                Liga Canaria SANSOFÉ - Edición {selectedAnio}
                            </h2>
                            <p className="text-sm text-foreground/60">
                                Gestión del período de inscripción y solicitudes recibidas.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <label className="text-sm font-medium text-foreground/70 flex items-center gap-1.5 whitespace-nowrap">
                        <Calendar className="w-4 h-4 text-primary" /> Edición:
                    </label>
                    <select
                        value={selectedAnio}
                        onChange={(e) => setSelectedAnio(Number(e.target.value))}
                        className="bg-background border border-border rounded-xl px-4 py-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                        {[2024, 2025, 2026, 2027, 2028].map(anio => (
                            <option key={anio} value={anio}>
                                Liga SANSOFÉ {anio}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Notification message */}
            {message && (
                <div className={`p-4 rounded-xl text-sm flex items-center justify-between gap-3 border ${
                    message.type === 'success' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-destructive/10 border-destructive/20 text-destructive'
                }`}>
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{message.text}</span>
                    </div>
                    <button onClick={() => setMessage(null)} className="text-foreground/50 hover:text-foreground">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Control Panel: Config & Bases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Toggle Box */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Estado de Inscripciones</span>
                        <h3 className="text-lg font-bold text-foreground mt-1">
                            Período de Registro {selectedAnio}
                        </h3>
                        <p className="text-sm text-foreground/60 mt-1">
                            {config?.inscripciones_abiertas 
                                ? 'Las inscripciones están ABIERTAS actualmente. Los criadores pueden enviar su formulario.' 
                                : 'Las inscripciones están CERRADAS en este momento.'}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            config?.inscripciones_abiertas
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                            <span className={`w-2 h-2 rounded-full ${config?.inscripciones_abiertas ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {config?.inscripciones_abiertas ? 'Inscripciones Activas' : 'Inscripciones Inactivas'}
                        </span>

                        <button
                            onClick={handleToggleInscripciones}
                            disabled={updatingConfig || loading}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors ${
                                config?.inscripciones_abiertas
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/30'
                                    : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
                            }`}
                        >
                            {updatingConfig ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : config?.inscripciones_abiertas ? (
                                <>
                                    <ToggleRight className="w-4 h-4 text-amber-500" />
                                    Cerrar Inscripciones
                                </>
                            ) : (
                                <>
                                    <ToggleLeft className="w-4 h-4" />
                                    Abrir Inscripciones
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Bases PDF Upload Box */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Bases Oficiales</span>
                        <h3 className="text-lg font-bold text-foreground mt-1">Documento de Bases {selectedAnio}</h3>
                        <p className="text-sm text-foreground/60 mt-1">
                            Sube el PDF con el reglamento y las bases oficiales para que los usuarios puedan descargarlo.
                        </p>
                    </div>

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                        {config?.url_bases ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDownloadDocument(config.url_bases!, `Bases_Liga_SANSOFE_${selectedAnio}.pdf`)}
                                    className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                                >
                                    <FileText className="w-3.5 h-3.5" /> Descargar Bases
                                </button>
                                <button
                                    onClick={handleDeleteBases}
                                    disabled={uploadingBases}
                                    className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                    title="Eliminar archivo"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <span className="text-xs text-foreground/50 italic">Ningún PDF subido</span>
                        )}

                        <label className="cursor-pointer px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors">
                            {uploadingBases ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    {config?.url_bases ? 'Reemplazar PDF' : 'Subir PDF Bases'}
                                </>
                            )}
                            <input 
                                type="file" 
                                accept="application/pdf" 
                                onChange={handleUploadBases} 
                                className="hidden" 
                                disabled={uploadingBases || loading}
                            />
                        </label>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-card p-4 rounded-xl border border-border text-center">
                    <span className="text-xs font-medium text-foreground/60">Total Solicitudes</span>
                    <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
                </div>
                <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/20 text-center">
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Pendientes</span>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.pendientes}</p>
                </div>
                <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/20 text-center">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Aceptadas</span>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.aceptadas}</p>
                </div>
                <div className="bg-destructive/5 p-4 rounded-xl border border-destructive/20 text-center">
                    <span className="text-xs font-medium text-destructive">Rechazadas</span>
                    <p className="text-2xl font-bold text-destructive mt-1">{stats.rechazadas}</p>
                </div>
            </div>

            {/* Solicitudes Table & Search */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-foreground font-heading">
                            Solicitudes de Inscripción ({filteredInscripciones.length})
                        </h3>
                        <p className="text-xs text-foreground/60 mt-0.5">
                            Revisa y cambia el estado de las solicitudes enviadas por los criadores.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                            <input
                                type="text"
                                placeholder="Buscar criador o asoc..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="flex bg-secondary/50 p-1 rounded-xl border border-border w-full sm:w-auto overflow-x-auto">
                            {(['todos', 'pendiente', 'aceptado', 'rechazado'] as const).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap ${
                                        statusFilter === status 
                                            ? 'bg-card text-foreground shadow-sm' 
                                            : 'text-foreground/60 hover:text-foreground'
                                    }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="p-12 text-center text-foreground/50 flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-sm">Cargando solicitudes...</span>
                    </div>
                ) : filteredInscripciones.length === 0 ? (
                    <div className="p-12 text-center text-foreground/50">
                        <UserCheck className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-medium">No se encontraron solicitudes de inscripción.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-secondary/40 border-b border-border text-xs uppercase tracking-wider text-foreground/70">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Criador / Nombre</th>
                                    <th className="px-6 py-4 font-semibold">Nº Criador</th>
                                    <th className="px-6 py-4 font-semibold">Asociación</th>
                                    <th className="px-6 py-4 font-semibold">Grupos / Razas</th>
                                    <th className="px-6 py-4 font-semibold">Estado</th>
                                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredInscripciones.map((item) => {
                                    const nombreAsociacion = item.tipo_asociacion === 'propia' 
                                        ? (item.asociaciones?.nombre || 'Asociación propia') 
                                        : (item.otra_asociacion_nombre || 'Otra asociación');

                                    return (
                                        <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-foreground">{item.nombre_completo}</div>
                                                <div className="text-xs text-foreground/50">
                                                    {new Date(item.created_at).toLocaleDateString('es-ES', {
                                                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 font-mono font-medium text-foreground/80">
                                                {item.numero_criador}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-foreground/90">
                                                    <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                                                    <span>{nombreAsociacion}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                    {item.grupos_razas.map((grupo, idx) => (
                                                        <span 
                                                            key={idx}
                                                            className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[11px] font-medium"
                                                        >
                                                            {grupo}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.estado === 'pendiente' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-semibold border border-amber-500/20">
                                                        <Clock className="w-3 h-3" /> Pendiente
                                                    </span>
                                                )}
                                                {item.estado === 'aceptado' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/20">
                                                        <CheckCircle className="w-3 h-3" /> Aceptado
                                                    </span>
                                                )}
                                                {item.estado === 'rechazado' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-semibold border border-destructive/20">
                                                        <XCircle className="w-3 h-3" /> Rechazado
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1">
                                                    {processingId === item.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                                    ) : (
                                                        <>
                                                            {item.estado !== 'aceptado' && (
                                                                <button
                                                                    onClick={() => handleUpdateEstadoInscripcion(item.id, 'aceptado')}
                                                                    className="p-1.5 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 rounded-lg transition-colors"
                                                                    title="Aceptar solicitud"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                            )}

                                                            {item.estado !== 'rechazado' && (
                                                                <button
                                                                    onClick={() => handleUpdateEstadoInscripcion(item.id, 'rechazado')}
                                                                    className="p-1.5 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 rounded-lg transition-colors"
                                                                    title="Rechazar solicitud"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() => handleDeleteInscripcion(item.id)}
                                                                className="p-1.5 text-destructive/70 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                                title="Eliminar inscripción"
                                                                >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
