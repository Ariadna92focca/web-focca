"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Bird, FileUp, LogOut, CheckCircle2, AlertCircle, FileText, Download, ShieldCheck, Building2 } from "lucide-react";
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

export default function PrivadoPage() {
    const [session, setSession] = useState<Session | null>(null);
    const [userData, setUserData] = useState<FocdeUser | null>(null);
    const [loading, setLoading] = useState(true);

    // Forms & Uploads
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authError, setAuthError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });

    // Data
    const [documents, setDocuments] = useState<Documento[]>([]);

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
                await fetchAllDocuments();
            } else {
                await fetchMyDocuments();
            }
        } catch (error: any) {
            console.error("Error fetching user data:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyDocuments = async () => {
        const { data, error } = await supabase
            .from('documentos')
            .select('*')
            .order('fecha_subida', { ascending: false });

        if (!error && data) {
            setDocuments(data as Documento[]);
        }
    };

    const fetchAllDocuments = async () => {
        const { data, error } = await supabase
            .from('documentos')
            .select('*, asociaciones(id, nombre, provincia)')
            .order('fecha_subida', { ascending: false });

        if (!error && data) {
            setDocuments(data as unknown as Documento[]);
        }
    };

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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setUploadMessage({ type: '', text: '' });

            if (!e.target.files || e.target.files.length === 0) return;

            if (!userData?.asociacion_id) {
                throw new Error('No estás vinculado a ninguna asociación válida.');
            }

            const file = e.target.files[0];
            if (file.size > 50 * 1024 * 1024) {
                throw new Error('El archivo excede el tamaño máximo permitido de 50MB.');
            }

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `${userData.asociacion_id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('documentos')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { error: dbError } = await supabase
                .from('documentos')
                .insert({
                    asociacion_id: userData.asociacion_id,
                    nombre_archivo: file.name,
                    url_archivo: filePath
                });

            if (dbError) throw dbError;

            setUploadMessage({ type: 'success', text: "Documento subido con éxito." });
            await fetchMyDocuments();
        } catch (error: any) {
            setUploadMessage({ type: 'error', text: error.message || "Error al subir el archivo" });
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

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
            <div className="bg-white dark:bg-card border-b border-border py-6 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${isAdmin ? 'bg-amber-100 text-amber-600' : 'bg-primary/10 text-primary'}`}>
                            {isAdmin ? <ShieldCheck className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                        </div>
                        <div>
                            <h1 className="font-heading text-xl font-bold text-foreground">
                                {isAdmin ? 'Panel de Admnistración General' : 'Panel de Gestión de Asociación'}
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Conditional Upload Box ONLY for Associations */}
                        {!isAdmin && (
                            <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                                        <FileUp className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="font-heading text-xl font-bold text-foreground">Enviar Petición de Anillas</h2>
                                        <p className="text-sm text-foreground/60">Selecciona el documento debidamente cumplimentado en PDF, DOC o Imagen.</p>
                                    </div>
                                </div>

                                <label className={`block border-2 border-dashed ${uploadMessage.type === 'error' ? 'border-red-400 bg-red-50/50' : 'border-border/80'} rounded-2xl p-10 sm:p-12 text-center hover:bg-slate-50 dark:hover:bg-secondary/20 transition-colors cursor-pointer flex flex-col items-center group relative`}>
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border border-border/50 transition-colors mb-4 ${uploading ? 'animate-pulse bg-primary/20 text-primary' : 'bg-background text-foreground/50 group-hover:text-primary group-hover:border-primary/50'}`}>
                                        <FileUp className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-medium text-foreground mb-1">
                                        {uploading ? "Subiendo archivo al servidor..." : "Haz clic o arrastra tu documento/imagen aquí"}
                                    </h3>
                                    <p className="text-sm text-foreground/50">Máximo 50MB.</p>
                                    <input type="file" className="hidden" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp" onChange={handleFileUpload} disabled={uploading} />
                                </label>

                                {uploadMessage.text && (
                                    <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${uploadMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                        {uploadMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                                        {uploadMessage.text}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Document List (Admin sees all, Association sees theirs) */}
                        <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                            <h2 className="font-heading text-xl font-bold text-foreground mb-6">
                                {isAdmin ? 'Muro Global de Peticiones de Anillas' : 'Tu Historial de Peticiones'}
                            </h2>

                            <div className="space-y-4">
                                {documents.length === 0 ? (
                                    <div className="text-center py-12 px-4 border-2 border-dashed border-border/50 rounded-2xl text-foreground/50">
                                        <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No hay documentos registrados.</p>
                                    </div>
                                ) : (
                                    documents.map((doc) => (
                                        <div key={doc.id} className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-4 border border-border/60 hover:border-border transition-colors rounded-2xl bg-slate-50/50 dark:bg-background/20">
                                            <div className="flex gap-4 items-start sm:items-center">
                                                <div className="p-3 bg-white dark:bg-background rounded-xl shadow-sm border border-border/50 text-primary shrink-0">
                                                    <FileText className="w-6 h-6" />
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
                                                onClick={() => handleDownload(doc.nombre_archivo, doc.url_archivo)}
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-background border border-border hover:bg-secondary transition-colors rounded-xl text-sm font-medium w-full sm:w-auto"
                                            >
                                                <Download className="w-4 h-4" />
                                                Descargar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
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
                                            <p className="text-foreground/50 mb-1">Estado Operativo</p>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                Activa
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={`${isAdmin ? 'bg-amber-50 border-amber-200' : 'bg-primary/5 border-primary/10'} p-6 rounded-3xl border`}>
                            <h4 className={`font-bold mb-2 ${isAdmin ? 'text-amber-800' : 'text-primary'}`}>
                                {isAdmin ? 'Zona Restringida' : 'Ayuda y Soporte'}
                            </h4>
                            <p className={`text-sm mb-4 ${isAdmin ? 'text-amber-700/80' : 'text-foreground/70'}`}>
                                {isAdmin
                                    ? 'Como administrador tienes acceso total a los documentos confidenciales de todas las asociaciones de la federación.'
                                    : 'Asegúrate de que el documento de petición está debidamente sellado y firmado por el presidente.'}
                            </p>
                            {!isAdmin && (
                                <button className="text-sm font-medium text-primary hover:underline">Contactar con la Federación &rarr;</button>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
