"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { 
    Trophy, 
    FileText, 
    Download, 
    CheckCircle2, 
    AlertCircle, 
    User, 
    Hash, 
    Building2, 
    Layers, 
    Send, 
    Loader2, 
    Clock,
    Sparkles,
    Users as UsersIcon
} from "lucide-react";

interface LigaConfig {
    id: string;
    anio: number;
    inscripciones_abiertas: boolean;
    url_bases: string | null;
}

interface Asociacion {
    id: string;
    nombre: string;
}

const RAZAS_LISTA = [
    "Color",
    "Postura Lisa",
    "Postura Rizada",
    "Melado Tinerfeño",
    "Giboso Español",
    "Híbridos",
    "Exóticos",
    "Fauna Europea",
    "Periquitos",
    "Psitacidas"
];

export default function LigaSansofePage() {
    const [config, setConfig] = useState<LigaConfig | null>(null);
    const [asociaciones, setAsociaciones] = useState<Asociacion[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [nombreCompleto, setNombreCompleto] = useState("");
    const [numeroCriador, setNumeroCriador] = useState("");
    const [tipoAsociacion, setTipoAsociacion] = useState<'propia' | 'otra'>('propia');
    const [asociacionId, setAsociacionId] = useState("");
    const [otraAsociacionNombre, setOtraAsociacionNombre] = useState("");
    
    // Grupos seleccionados separados en Individual y Equipos
    const [gruposIndividual, setGruposIndividual] = useState<string[]>([]);
    const [gruposEquipos, setGruposEquipos] = useState<string[]>([]);

    // Form status & message
    const [submitting, setSubmitting] = useState(false);
    const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        initPage();
    }, []);

    const initPage = async () => {
        try {
            setLoading(true);
            const currentYear = new Date().getFullYear();

            // 1. Fetch current year active config
            const { data: configData } = await supabase
                .from('liga_sansofe_config')
                .select('*')
                .eq('anio', currentYear)
                .maybeSingle();

            if (configData) {
                setConfig(configData as LigaConfig);
            } else {
                // If no config found for current year, check latest config available
                const { data: latestConfig } = await supabase
                    .from('liga_sansofe_config')
                    .select('*')
                    .order('anio', { ascending: false })
                    .limit(1)
                    .maybeSingle();
                
                if (latestConfig) setConfig(latestConfig as LigaConfig);
            }

            // 2. Fetch associations registered in DB
            const { data: asocData } = await supabase
                .from('asociaciones')
                .select('id, nombre')
                .order('nombre', { ascending: true });

            if (asocData) {
                setAsociaciones(asocData as Asociacion[]);
                if (asocData.length > 0) {
                    setAsociacionId(asocData[0].id);
                }
            }
        } catch (error) {
            console.error("Error al cargar configuración de la Liga:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleIndividualToggle = (raza: string) => {
        setGruposIndividual(prev => 
            prev.includes(raza)
                ? prev.filter(r => r !== raza)
                : [...prev, raza]
        );
    };

    const handleEquiposToggle = (raza: string) => {
        setGruposEquipos(prev => 
            prev.includes(raza)
                ? prev.filter(r => r !== raza)
                : [...prev, raza]
        );
    };

    const handleDownloadBases = async () => {
        if (!config?.url_bases) return;
        try {
            const { data, error } = await supabase.storage.from('documentos').download(config.url_bases);
            if (error) throw error;

            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Bases_Liga_SANSOFE_${config.anio}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("No se pudo descargar el documento de bases.");
        }
    };

    const handleSubmitInscripcion = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormMessage(null);

        if (!config || !config.inscripciones_abiertas) {
            setFormMessage({ type: 'error', text: 'Las inscripciones no están abiertas actualmente.' });
            return;
        }

        if (!nombreCompleto.trim() || !numeroCriador.trim()) {
            setFormMessage({ type: 'error', text: 'Por favor, completa tu nombre y número de criador nacional.' });
            return;
        }

        if (tipoAsociacion === 'propia' && !asociacionId) {
            setFormMessage({ type: 'error', text: 'Por favor, selecciona una asociación.' });
            return;
        }

        if (tipoAsociacion === 'otra' && !otraAsociacionNombre.trim()) {
            setFormMessage({ type: 'error', text: 'Por favor, especifica el nombre de tu asociación.' });
            return;
        }

        if (gruposIndividual.length === 0 && gruposEquipos.length === 0) {
            setFormMessage({ type: 'error', text: 'Selecciona al menos una modalidad (Individual o Equipos) para inscribirte.' });
            return;
        }

        // Formatear la lista completa combinada etiquetada por modalidad para la BBDD
        const gruposCombinados: string[] = [
            ...gruposIndividual.map(g => `[Individual] ${g}`),
            ...gruposEquipos.map(g => `[Equipos] ${g}`)
        ];

        try {
            setSubmitting(true);

            const { error } = await supabase
                .from('liga_sansofe_inscripciones')
                .insert({
                    anio: config.anio,
                    nombre_completo: nombreCompleto.trim(),
                    numero_criador: numeroCriador.trim().toUpperCase(),
                    tipo_asociacion: tipoAsociacion,
                    asociacion_id: tipoAsociacion === 'propia' ? asociacionId : null,
                    otra_asociacion_nombre: tipoAsociacion === 'otra' ? otraAsociacionNombre.trim() : null,
                    grupos_razas: gruposCombinados,
                    estado: 'pendiente'
                });

            if (error) throw error;

            setFormMessage({ 
                type: 'success', 
                text: `¡Tu solicitud de inscripción para la Liga SANSOFÉ ${config.anio} se ha enviado correctamente! La administración revisará tu solicitud.` 
            });

            // Reset form
            setNombreCompleto("");
            setNumeroCriador("");
            setOtraAsociacionNombre("");
            setGruposIndividual([]);
            setGruposEquipos([]);

        } catch (error: any) {
            console.error("Error al inscribirse:", error);
            setFormMessage({ type: 'error', text: error.message || 'Ocurrió un error al enviar tu inscripción.' });
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const anioActual = config?.anio || new Date().getFullYear();

    return (
        <div className="w-full flex flex-col min-h-screen bg-background">
            {/* Hero Header */}
            <div className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background border-b border-border py-16 sm:py-20 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
                        <Trophy className="w-4 h-4" />
                        <span>Campeonato Oficial FOCCA</span>
                    </div>

                    <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight mb-4">
                        Liga Canaria <span className="text-primary">SANSOFÉ</span> {anioActual}
                    </h1>
                    
                    <p className="text-foreground/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Bienvenido a la web oficial de la Liga Canaria SANSOFÉ. Consulta el reglamento oficial e inscríbete para la edición {anioActual}.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl space-y-12">
                
                {/* Section 1: Bases oficiales */}
                <section className="bg-card p-8 sm:p-10 rounded-3xl border border-border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5 text-left w-full sm:w-auto">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0 border border-primary/20">
                            <FileText className="w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="font-heading text-2xl font-bold text-foreground">Bases Oficiales SANSOFÉ {anioActual}</h2>
                            <p className="text-foreground/70 text-sm mt-1">
                                {config?.url_bases 
                                    ? 'Descarga el reglamento y las bases completas en formato PDF.' 
                                    : 'Las bases oficiales de esta edición se publicarás muy pronto.'}
                            </p>
                        </div>
                    </div>

                    <div className="w-full sm:w-auto shrink-0">
                        {config?.url_bases ? (
                            <button
                                onClick={handleDownloadBases}
                                className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2.5 shadow-sm transition-all hover:shadow-md"
                            >
                                <Download className="w-4 h-4" />
                                Descargar Bases (PDF)
                            </button>
                        ) : (
                            <button
                                disabled
                                className="w-full sm:w-auto px-6 py-3 bg-secondary text-secondary-foreground rounded-2xl text-sm font-medium opacity-60 cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Clock className="w-4 h-4" />
                                Próximamente
                            </button>
                        )}
                    </div>
                </section>

                {/* Section 2: Formulario de Inscripción */}
                <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                    <div className="p-8 sm:p-10 border-b border-border bg-secondary/30">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">Inscripción Canaria</span>
                        </div>
                        <h2 className="font-heading text-3xl font-bold text-foreground">Formulario de Inscripción</h2>
                        <p className="text-foreground/70 text-sm mt-1">
                            Rellena tus datos como criador nacional y selecciona los grupos en los que vas a competir.
                        </p>
                    </div>

                    <div className="p-8 sm:p-10">
                        {!config?.inscripciones_abiertas ? (
                            /* State: Inscripciones Cerradas */
                            <div className="py-12 px-6 text-center max-w-lg mx-auto flex flex-col items-center justify-center">
                                <div className="w-16 h-16 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground font-heading">
                                    Inscripciones Cerradas
                                </h3>
                                <p className="text-foreground/70 text-sm mt-2 leading-relaxed">
                                    El plazo de inscripción para la Liga Canaria SANSOFÉ {anioActual} aún no se encuentra activo o ha finalizado. Consulta esta página próximamente para realizar tu registro.
                                </p>
                            </div>
                        ) : (
                            /* State: Inscripciones Abiertas Form */
                            <form onSubmit={handleSubmitInscripcion} className="space-y-8 max-w-3xl mx-auto">
                                
                                {formMessage && (
                                    <div className={`p-4 rounded-2xl text-sm flex items-start gap-3 border ${
                                        formMessage.type === 'success'
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-destructive/10 border-destructive/20 text-destructive'
                                    }`}>
                                        {formMessage.type === 'success' ? (
                                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                        ) : (
                                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                                        )}
                                        <span className="leading-relaxed">{formMessage.text}</span>
                                    </div>
                                )}

                                {/* Row 1: Nombre & Criador */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                                            <User className="w-4 h-4 text-primary" /> Nombre y Apellidos *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={nombreCompleto}
                                            onChange={(e) => setNombreCompleto(e.target.value)}
                                            placeholder="Ej: Manuel Rodríguez Pérez"
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                                            <Hash className="w-4 h-4 text-primary" /> Nº Criador Nacional *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={numeroCriador}
                                            onChange={(e) => setNumeroCriador(e.target.value)}
                                            placeholder="Ej: E8-1234"
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Asociación */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-foreground flex items-center gap-1.5">
                                        <Building2 className="w-4 h-4 text-primary" /> Asociación Perteneciente *
                                    </label>

                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                                            <input
                                                type="radio"
                                                name="tipoAsociacion"
                                                checked={tipoAsociacion === 'propia'}
                                                onChange={() => setTipoAsociacion('propia')}
                                                className="text-primary focus:ring-primary"
                                            />
                                            Asociación Afiliada FOCCA
                                        </label>

                                        <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
                                            <input
                                                type="radio"
                                                name="tipoAsociacion"
                                                checked={tipoAsociacion === 'otra'}
                                                onChange={() => setTipoAsociacion('otra')}
                                                className="text-primary focus:ring-primary"
                                            />
                                            Otra Asociación
                                        </label>
                                    </div>

                                    {tipoAsociacion === 'propia' ? (
                                        <select
                                            value={asociacionId}
                                            onChange={(e) => setAsociacionId(e.target.value)}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                        >
                                            {asociaciones.map(asoc => (
                                                <option key={asoc.id} value={asoc.id}>
                                                    {asoc.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            required={tipoAsociacion === 'otra'}
                                            value={otraAsociacionNombre}
                                            onChange={(e) => setOtraAsociacionNombre(e.target.value)}
                                            placeholder="Escribe el nombre de tu asociación..."
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                                        />
                                    )}
                                </div>

                                {/* Row 3: Modalidad y Razas (Individual vs Equipos) */}
                                <div className="space-y-6 pt-4 border-t border-border">
                                    <div>
                                        <label className="block text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1">
                                            <Layers className="w-4 h-4 text-primary" /> Modalidad y Grupos en los que participas *
                                        </label>
                                        <p className="text-xs text-foreground/60">
                                            Puedes seleccionar múltiples razas en el apartado Individual y/o en el apartado de Equipos.
                                        </p>
                                    </div>

                                    {/* 1. Modalidad Individual */}
                                    <div className="bg-secondary/20 p-5 rounded-2xl border border-border/80 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                                <User className="w-3.5 h-3.5" /> Modalidad Individual
                                            </span>
                                            <span className="text-xs text-foreground/60 font-medium">
                                                {gruposIndividual.length} seleccionados
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                                            {RAZAS_LISTA.map(raza => {
                                                const isSelected = gruposIndividual.includes(raza);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={`ind_${raza}`}
                                                        onClick={() => handleIndividualToggle(raza)}
                                                        className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all flex items-center justify-between ${
                                                            isSelected
                                                                ? 'bg-primary/15 border-primary text-primary shadow-sm'
                                                                : 'bg-card border-border text-foreground/70 hover:border-primary/40'
                                                        }`}
                                                    >
                                                        <span>{raza}</span>
                                                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                                                            isSelected ? 'bg-primary text-primary-foreground font-bold' : 'border border-border'
                                                        }`}>
                                                            {isSelected && '✓'}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* 2. Modalidad Equipos */}
                                    <div className="bg-secondary/20 p-5 rounded-2xl border border-border/80 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                                <UsersIcon className="w-3.5 h-3.5" /> Modalidad Equipos
                                            </span>
                                            <span className="text-xs text-foreground/60 font-medium">
                                                {gruposEquipos.length} seleccionados
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                                            {RAZAS_LISTA.map(raza => {
                                                const isSelected = gruposEquipos.includes(raza);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={`eq_${raza}`}
                                                        onClick={() => handleEquiposToggle(raza)}
                                                        className={`p-3 rounded-xl text-xs font-semibold text-left border transition-all flex items-center justify-between ${
                                                            isSelected
                                                                ? 'bg-primary/15 border-primary text-primary shadow-sm'
                                                                : 'bg-card border-border text-foreground/70 hover:border-primary/40'
                                                        }`}
                                                    >
                                                        <span>{raza}</span>
                                                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                                                            isSelected ? 'bg-primary text-primary-foreground font-bold' : 'border border-border'
                                                        }`}>
                                                            {isSelected && '✓'}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4 border-t border-border flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground hover:bg-primary/90 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Enviando inscripción...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Enviar Solicitud de Inscripción
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
