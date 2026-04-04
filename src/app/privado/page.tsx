"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Bird, FileUp, LogOut, CheckCircle2, AlertCircle, FileText, Download, ShieldCheck, Building2, FolderArchive, Users, Plus, Trash2, Filter } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface FocdeUser {
    id: string;
    email: string;
    asociacion_id: string | null;
    rol: 'admin' | 'asociacion';
}

interface Asociacion {
    id: string;
    nombre: string;
    provincia: string | null;
}

interface Documento {
    id: string;
    asociacion_id: string;
    nombre_archivo: string;
    url_archivo: string;
    fecha_subida: string;
    asociaciones?: Asociacion;
}

interface DocumentoGeneral {
    id: string;
    asociacion_id: string;
    nombre_archivo: string;
    url_archivo: string;
    fecha_subida: string;
    asociaciones?: Asociacion;
}

interface Miembro {
    id: string;
    asociacion_id: string;
    nombre: string;
    rol: string;
    correo: string;
    telefono: string;
    fecha_registro: string;
    asociaciones?: Asociacion;
}

export default function PrivadoPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [userData, setUserData] = useState<FocdeUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Auth Forms
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");

    // App State
    const [activeTab, setActiveTab] = useState<'anillas' | 'generales' | 'miembros'>('anillas');
    const [adminViewMode, setAdminViewMode] = useState<'global' | 'asociacion'>('global');
    const [selectedAsocId, setSelectedAsocId] = useState<string>('');
    const [asociacionesList, setAsociacionesList] = useState<Asociacion[]>([]);

    // Upload & Forms States
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });

    const [nuevoMiembro, setNuevoMiembro] = useState({ nombre: '', rol: '', correo: '', telefono: '' });
    const [guardandoMiembro, setGuardandoMiembro] = useState(false);
    const [miembroMessage, setMiembroMessage] = useState({ type: '', text: '' });

    // Data Collections
    const [documents, setDocuments] = useState<Documento[]>([]);
    const [documentosGenerales, setDocumentosGenerales] = useState<DocumentoGeneral[]>([]);
    const [miembros, setMiembros] = useState<Miembro[]>([]);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            if (session) {
                await fetchUserData(session.user.id);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            if (session) {
                await fetchUserData(session.user.id);
            } else {
                setUserData(null);
                setDocuments([]);
                setDocumentosGenerales([]);
                setMiembros([]);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserData = async (userId: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('focde_usuarios')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error("No user found in focde_usuarios, Logging out.");
                await supabase.auth.signOut();
                throw error;
            }
            setUserData(data as FocdeUser);

            if (data.rol === 'admin') {
                await fetchAsociacionesList();
                await fetchAllData();
            } else {
                await fetchMyData(data.asociacion_id);
            }
        } catch (error: any) {
            console.error("Error fetching user data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchAsociacionesList = async () => {
        const { data, error } = await supabase.from('asociaciones').select('*').order('nombre', { ascending: true });
        if (!error && data) {
            setAsociacionesList(data as Asociacion[]);
        }
    }

    const fetchMyData = async (asocId: string | null) => {
        if (!asocId) return;

        const q1 = supabase.from('documentos').select('*').eq('asociacion_id', asocId).order('fecha_subida', { ascending: false });
        const q2 = supabase.from('documentos_generales').select('*').eq('asociacion_id', asocId).order('fecha_subida', { ascending: false });
        const q3 = supabase.from('miembros_asociacion').select('*').eq('asociacion_id', asocId).order('fecha_registro', { ascending: false });

        const [r1, r2, r3] = await Promise.all([q1, q2, q3]);

        if (r1.data) setDocuments(r1.data as Documento[]);
        if (r2.data) setDocumentosGenerales(r2.data as DocumentoGeneral[]);
        if (r3.data) setMiembros(r3.data as Miembro[]);
    };

    const fetchAllData = async (filterAsocId?: string) => {
        let q1 = supabase.from('documentos').select('*, asociaciones(id, nombre, provincia)').order('fecha_subida', { ascending: false });
        if (filterAsocId) q1 = q1.eq('asociacion_id', filterAsocId);
        const { data: d1 } = await q1;
        setDocuments((d1 || []) as unknown as Documento[]);

        let q2 = supabase.from('documentos_generales').select('*, asociaciones(id, nombre, provincia)').order('fecha_subida', { ascending: false });
        if (filterAsocId) q2 = q2.eq('asociacion_id', filterAsocId);
        const { data: d2 } = await q2;
        setDocumentosGenerales((d2 || []) as unknown as DocumentoGeneral[]);

        let q3 = supabase.from('miembros_asociacion').select('*, asociaciones(id, nombre, provincia)').order('fecha_registro', { ascending: false });
        if (filterAsocId) q3 = q3.eq('asociacion_id', filterAsocId);
        const { data: d3 } = await q3;
        setMiembros((d3 || []) as unknown as Miembro[]);
    };

    // UseEffect to trigger re-fetch when admin changes association filter
    useEffect(() => {
        if (userData?.rol === 'admin') {
            if (adminViewMode === 'global') {
                fetchAllData();
            } else if (adminViewMode === 'asociacion' && selectedAsocId) {
                fetchAllData(selectedAsocId);
            } else if (adminViewMode === 'asociacion' && !selectedAsocId) {
                // Clear state if no association selected yet
                setDocuments([]);
                setDocumentosGenerales([]);
                setMiembros([]);
            }
        }
    }, [adminViewMode, selectedAsocId]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthError("");
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setAuthError("Credenciales incorrectas.");
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGeneral: boolean = false) => {
        try {
            setUploading(true);
            setUploadMessage({ type: '', text: '' });

            if (!e.target.files || e.target.files.length === 0) return;

            if (!userData?.asociacion_id) {
                throw new Error('No estás vinculado a ninguna asociación válida.');
            }

            const file = e.target.files[0];
            if (file.size > 50 * 1024 * 1024) {
                throw new Error('El archivo excede el tamaño máximo de 50MB.');
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

            // Si es general, lo guardamos en subcarpeta /generales/
            const filePath = isGeneral
                ? `${userData.asociacion_id}/generales/${fileName}`
                : `${userData.asociacion_id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('documentos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const tableName = isGeneral ? 'documentos_generales' : 'documentos';
            const { error: dbError } = await supabase
                .from(tableName)
                .insert({
                    asociacion_id: userData.asociacion_id,
                    nombre_archivo: file.name,
                    url_archivo: filePath
                });

            if (dbError) throw dbError;

            setUploadMessage({ type: 'success', text: "Documento subido con éxito." });

            // Refetch depending on role
            if (userData.rol === 'admin') {
                fetchAllData(adminViewMode === 'asociacion' ? selectedAsocId : undefined);
            } else {
                fetchMyData(userData.asociacion_id);
            }
        } catch (error: any) {
            setUploadMessage({ type: 'error', text: error.message || "Error al subir el archivo" });
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleAddMiembro = async (e: React.FormEvent) => {
        e.preventDefault();
        setMiembroMessage({ type: '', text: '' });

        if (!userData?.asociacion_id) return;
        if (!nuevoMiembro.nombre || !nuevoMiembro.rol || !nuevoMiembro.correo) return;

        try {
            setGuardandoMiembro(true);
            const { error } = await supabase
                .from('miembros_asociacion')
                .insert({
                    asociacion_id: userData.asociacion_id,
                    nombre: nuevoMiembro.nombre,
                    rol: nuevoMiembro.rol,
                    correo: nuevoMiembro.correo,
                    telefono: nuevoMiembro.telefono
                });

            if (error) throw error;

            setMiembroMessage({ type: 'success', text: 'Miembro añadido con éxito.' });
            setNuevoMiembro({ nombre: '', rol: '', correo: '', telefono: '' });

            // Refrescar
            if (userData.rol === 'admin') fetchAllData(adminViewMode === 'asociacion' ? selectedAsocId : undefined);
            else fetchMyData(userData.asociacion_id);

            // Timeout clear message
            setTimeout(() => setMiembroMessage({ type: '', text: '' }), 4000);

        } catch (error: any) {
            setMiembroMessage({ type: 'error', text: error.message || 'Ocurrió un error al guardar' });
        } finally {
            setGuardandoMiembro(false);
        }
    }

    const handleDeleteMiembro = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar este miembro?")) return;
        try {
            const { error } = await supabase.from('miembros_asociacion').delete().eq('id', id);
            if (error) throw error;

            setMiembros(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            alert("Error al eliminar miembro.");
        }
    }

    const handleDownload = async (fileName: string, filePath: string) => {
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
            console.error("Error al descargar:", error);
            alert("No se pudo descargar el documento o no tienes permisos.");
        }
    };

    if (loading) {
        return <div className="min-h-[60vh] flex items-center justify-center">Cargando...</div>;
    }

    if (!session || !userData) {
        return (
            <div className="w-full flex-grow flex items-center justify-center bg-background py-16 px-4">
                <div className="max-w-md w-full bg-card p-8 rounded-3xl shadow-xl border border-border">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                            <Bird className="w-8 h-8" />
                        </div>
                        <h1 className="font-heading text-2xl font-bold text-foreground">Acceso FOCCA-FOCDE</h1>
                        <p className="text-sm text-foreground/60 mt-2">Introduce tus credenciales para acceder al área de gestión.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {authError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{authError}</span>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Email de Usuario</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="usuario@ejemplo.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Contraseña</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    const isAdmin = userData.rol === 'admin';

    return (
        <div className="w-full flex-grow bg-slate-50 dark:bg-slate-950 flex flex-col">
            <div className="bg-white dark:bg-card border-b border-border py-4 sm:py-6 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${isAdmin ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                            {isAdmin ? <ShieldCheck className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                        </div>
                        <div>
                            <h1 className="font-heading text-xl font-bold text-foreground">
                                {isAdmin ? 'Panel de Administración Global' : 'Panel de Gestión de Asociación'}
                            </h1>
                            <p className="text-sm text-foreground/70">{session.user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium bg-background hover:bg-secondary transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Main Content Area (Takes 3 columns on large screens) */}
                    <div className="lg:col-span-3 space-y-6">

                        {/* ADMIN VIEW FILTER TOOLS */}
                        {isAdmin && (
                            <div className="bg-white dark:bg-card p-4 rounded-2xl border border-border flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-sm mb-6">
                                <div className="flex items-center gap-3 shrink-0">
                                    <Filter className="w-5 h-5 text-amber-600" />
                                    <span className="font-semibold text-foreground">Visión:</span>
                                </div>
                                <div className="flex bg-slate-100 dark:bg-secondary rounded-xl p-1 gap-1 w-full sm:w-auto">
                                    <button
                                        onClick={() => setAdminViewMode('global')}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg flex-1 sm:flex-none transition-colors ${adminViewMode === 'global' ? 'bg-white dark:bg-background shadow-sm text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
                                    >General</button>
                                    <button
                                        onClick={() => setAdminViewMode('asociacion')}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg flex-1 sm:flex-none transition-colors ${adminViewMode === 'asociacion' ? 'bg-white dark:bg-background shadow-sm text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
                                    >Por Asociación</button>
                                </div>

                                {adminViewMode === 'asociacion' && (
                                    <div className="w-full sm:w-64">
                                        <select
                                            value={selectedAsocId}
                                            onChange={(e) => setSelectedAsocId(e.target.value)}
                                            className="w-full border border-border/60 bg-background text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-amber-500/50 outline-none"
                                        >
                                            <option value="">Selecciona una asociación...</option>
                                            {asociacionesList.map(a => (
                                                <option key={a.id} value={a.id}>{a.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TABS NAVIGATION */}
                        <div className="flex border-b border-border/80 gap-2 sm:gap-6 overflow-x-auto pb-1 no-scrollbar">
                            <button
                                onClick={() => setActiveTab('anillas')}
                                className={`flex items-center gap-2 pb-3 px-2 whitespace-nowrap transition-colors border-b-2 font-medium ${activeTab === 'anillas' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'}`}
                            >
                                <FileUp className="w-4 h-4" />
                                Petición Anillas
                            </button>
                            <button
                                onClick={() => setActiveTab('generales')}
                                className={`flex items-center gap-2 pb-3 px-2 whitespace-nowrap transition-colors border-b-2 font-medium ${activeTab === 'generales' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'}`}
                            >
                                <FolderArchive className="w-4 h-4" />
                                Documentos Generales
                            </button>
                            <button
                                onClick={() => setActiveTab('miembros')}
                                className={`flex items-center gap-2 pb-3 px-2 whitespace-nowrap transition-colors border-b-2 font-medium ${activeTab === 'miembros' ? 'border-primary text-primary' : 'border-transparent text-foreground/60 hover:text-foreground'}`}
                            >
                                <Users className="w-4 h-4" />
                                Miembros
                            </button>
                        </div>


                        {/* TAB 1: Petición de Anillas */}
                        {activeTab === 'anillas' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Upload Box */}
                                {!isAdmin && (
                                    <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                                <FileUp className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="font-heading text-xl font-bold text-foreground">Enviar Petición de Anillas</h2>
                                                <p className="text-sm text-foreground/60">Sube tus archivos de solicitud firmados por el presidente.</p>
                                            </div>
                                        </div>

                                        <label className={`block border-2 border-dashed ${uploadMessage.type === 'error' ? 'border-red-400 bg-red-50/50' : 'border-border/80'} rounded-2xl p-8 sm:p-10 text-center hover:bg-slate-50 dark:hover:bg-secondary/20 transition-colors cursor-pointer flex flex-col items-center group relative`}>
                                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border border-border/50 transition-colors mb-4 ${uploading ? 'animate-pulse bg-primary/20 text-primary' : 'bg-background text-foreground/50 group-hover:text-primary group-hover:border-primary/50'}`}>
                                                <FileUp className="w-6 h-6" />
                                            </div>
                                            <h3 className="font-medium text-foreground mb-1">
                                                {uploading ? "Subiendo..." : "Haz clic o arrastra tu archivo aquí"}
                                            </h3>
                                            <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" onChange={(e) => handleFileUpload(e, false)} disabled={uploading} />
                                        </label>

                                        {uploadMessage.text && (
                                            <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${uploadMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                                {uploadMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                                {uploadMessage.text}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* List Box */}
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <h2 className="font-heading text-xl font-bold text-foreground mb-6">
                                        Historial de Peticiones de Anillas
                                    </h2>
                                    <div className="space-y-3">
                                        {documents.length === 0 ? (
                                            <p className="text-center py-8 text-foreground/40 italic text-sm border-2 border-dashed border-border rounded-xl">No hay documentos de anillas.</p>
                                        ) : (
                                            documents.map((doc) => (
                                                <DocumentItem key={doc.id} doc={doc} isAdmin={isAdmin} onDownload={() => handleDownload(doc.nombre_archivo, doc.url_archivo)} />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: Documentos Generales */}
                        {activeTab === 'generales' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Upload Box */}
                                {(!isAdmin || (isAdmin && adminViewMode === 'asociacion')) ? ( // Allow association or maybe admin to upload for an association? Usually just associations.
                                    !isAdmin && (
                                        <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                                    <FolderArchive className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h2 className="font-heading text-xl font-bold text-foreground">Almacenamiento General</h2>
                                                    <p className="text-sm text-foreground/60">Disco duro en la nube para adjuntar otros documentos federativos.</p>
                                                </div>
                                            </div>

                                            <label className="block border-2 border-dashed border-border/80 rounded-2xl p-8 sm:p-10 text-center hover:bg-slate-50 transition-colors cursor-pointer flex flex-col items-center group relative">
                                                <div className={`w-14 h-14 rounded-full flex items-center justify-center border border-border/50 transition-colors mb-4 ${uploading ? 'animate-pulse bg-blue-100 text-blue-600' : 'bg-background text-foreground/50 group-hover:text-blue-500 group-hover:border-blue-500/50'}`}>
                                                    <FolderArchive className="w-6 h-6" />
                                                </div>
                                                <h3 className="font-medium text-foreground mb-1">
                                                    {uploading ? "Subiendo..." : "Subir nuevo documento general"}
                                                </h3>
                                                <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" onChange={(e) => handleFileUpload(e, true)} disabled={uploading} />
                                            </label>

                                            {uploadMessage.text && (
                                                <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${uploadMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                                    {uploadMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                                    {uploadMessage.text}
                                                </div>
                                            )}
                                        </div>
                                    )
                                ) : null}

                                {/* List Box */}
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <h2 className="font-heading text-xl font-bold text-foreground mb-6">
                                        Archivos Guardados
                                    </h2>
                                    <div className="space-y-3">
                                        {documentosGenerales.length === 0 ? (
                                            <p className="text-center py-8 text-foreground/40 italic text-sm border-2 border-dashed border-border rounded-xl">No hay documentos en la carpeta general.</p>
                                        ) : (
                                            documentosGenerales.map((doc) => (
                                                <DocumentItem key={doc.id} doc={doc as unknown as Documento} isAdmin={isAdmin} onDownload={() => handleDownload(doc.nombre_archivo, doc.url_archivo)} />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: Miembros */}
                        {activeTab === 'miembros' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">

                                {/* Formulario para agregar miembros solo si no es admin general (o si la asociación necesita) */}
                                {!isAdmin && (
                                    <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="font-heading text-xl font-bold text-foreground">Registro de Miembros</h2>
                                                <p className="text-sm text-foreground/60">Da de alta nuevos afiliados en la base de datos oficial.</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleAddMiembro} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Nombre Completo</label>
                                                <input required type="text" value={nuevoMiembro.nombre} onChange={e => setNuevoMiembro({ ...nuevoMiembro, nombre: e.target.value })} className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Ej. Juan Pérez" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Rol / Cargo</label>
                                                <input required type="text" value={nuevoMiembro.rol} onChange={e => setNuevoMiembro({ ...nuevoMiembro, rol: e.target.value })} className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Ej. Socio, Vocal..." />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Correo Electrónico</label>
                                                <input required type="email" value={nuevoMiembro.correo} onChange={e => setNuevoMiembro({ ...nuevoMiembro, correo: e.target.value })} className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="correo@ejemplo.com" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Número de Teléfono</label>
                                                <input type="tel" value={nuevoMiembro.telefono} onChange={e => setNuevoMiembro({ ...nuevoMiembro, telefono: e.target.value })} className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Ej. 600000000" />
                                            </div>

                                            <div className="md:col-span-2 pt-2">
                                                <button type="submit" disabled={guardandoMiembro} className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors">
                                                    {guardandoMiembro ? 'Guardando...' : <><Plus className="w-4 h-4" /> Registrar Miembro</>}
                                                </button>
                                                {miembroMessage.text && (
                                                    <p className={`mt-3 text-sm font-medium ${miembroMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{miembroMessage.text}</p>
                                                )}
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Lista de Miembros */}
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <h2 className="font-heading text-xl font-bold text-foreground mb-6">Listado Base de Afiliados</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-secondary/50 text-foreground/70 font-semibold border-b border-border/80">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-tl-lg">Nombre</th>
                                                    <th className="px-4 py-3">Rol</th>
                                                    <th className="px-4 py-3">Contacto</th>
                                                    {isAdmin && <th className="px-4 py-3">Asociación</th>}
                                                    {!isAdmin && <th className="px-4 py-3 rounded-tr-lg">Acción</th>}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/40">
                                                {miembros.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={5} className="text-center py-6 italic text-foreground/50">No hay integrantes registrados.</td>
                                                    </tr>
                                                ) : miembros.map((m) => (
                                                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-background/20 transition-colors">
                                                        <td className="px-4 py-3 font-medium text-foreground">{m.nombre}</td>
                                                        <td className="px-4 py-3"><span className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded-full">{m.rol}</span></td>
                                                        <td className="px-4 py-3 text-foreground/70">{m.correo} <br /><span className="text-xs">{m.telefono}</span></td>
                                                        {isAdmin && m.asociaciones && (
                                                            <td className="px-4 py-3">
                                                                <span className="text-xs font-semibold px-2 py-1 bg-amber-100 text-amber-800 rounded">{m.asociaciones.nombre}</span>
                                                            </td>
                                                        )}
                                                        {!isAdmin && (
                                                            <td className="px-4 py-3">
                                                                <button onClick={() => handleDeleteMiembro(m.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>

                    {/* Sidebar Area (1 column length) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                            <h3 className="font-heading font-bold text-lg mb-4">Detalles de la Cuenta</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-foreground/50 mb-1">Rol en el sistema</p>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {isAdmin ? 'Administración' : 'Asociación Afiliada'}
                                    </span>
                                </div>
                                {!isAdmin && (
                                    <>
                                        <div>
                                            <p className="text-foreground/50 mb-1">Asociación ID</p>
                                            <span className="font-mono text-xs opacity-60 truncate block w-full">{userData.asociacion_id}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={`${isAdmin ? 'bg-amber-50 border-amber-200' : 'bg-primary/5 border-primary/10'} p-6 rounded-3xl border`}>
                            <h4 className={`font-bold mb-2 flex items-center gap-2 ${isAdmin ? 'text-amber-800' : 'text-primary'}`}>
                                {isAdmin ? 'Recuerda' : 'Gestión Eficiente'}
                            </h4>
                            <p className={`text-sm leading-relaxed ${isAdmin ? 'text-amber-700/80' : 'text-foreground/70'}`}>
                                {isAdmin
                                    ? 'Tienes la capacidad de revisar el volumen total del servidor. Fíltralo por asociación para buscar información concreta de forma precisa.'
                                    : 'Utiliza la pestaña Documentos Generales para aportar ficheros federativos e incluir en la pestaña Miembros la cartera de tu asociación.'}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Componente helper para evitar repetición en las listas de documentos
function DocumentItem({ doc, isAdmin, onDownload }: { doc: Documento, isAdmin: boolean, onDownload: () => void }) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-4 border border-border/60 hover:border-border transition-colors rounded-2xl bg-slate-50/50 dark:bg-background/20 group">
            <div className="flex gap-4 items-start sm:items-center">
                <div className="p-3 bg-white dark:bg-background rounded-xl shadow-sm border border-border/50 text-foreground/50 group-hover:text-primary transition-colors shrink-0">
                    <FileText className="w-5 h-5" />
                </div>
                <div>
                    <p className="font-medium text-foreground truncate max-w-[200px] sm:max-w-xs" title={doc.nombre_archivo}>
                        {doc.nombre_archivo}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                        <span className="text-xs text-foreground/60">
                            {new Date(doc.fecha_subida).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isAdmin && doc.asociaciones && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 truncate max-w-[150px]" title={doc.asociaciones.nombre}>
                                {doc.asociaciones.nombre} ({doc.asociaciones.provincia})
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={onDownload}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-background border border-border hover:bg-secondary transition-colors rounded-xl text-sm font-medium w-full sm:w-auto"
            >
                <Download className="w-4 h-4" />
                Descargar
            </button>
        </div>
    )
}
