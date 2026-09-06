"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Bird, FileUp, LogOut, CheckCircle2, AlertCircle, FileText, Download, ShieldCheck, Building2, FolderArchive, Users, Plus, Trash2, Filter, Loader2, UserCircle, Newspaper, Mail, Calendar, Image as ImageIcon, Trophy, ChevronDown } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import ConcursosAdmin from "@/components/ConcursosAdmin";
import ImpresosAdmin from "@/components/ImpresosAdmin";
import GaleriaAdmin from "@/components/GaleriaAdmin";
import LigaSansofeAdmin from "@/components/LigaSansofeAdmin";

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
    email?: string;
    url_logo?: string | null;
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

interface NormativaPublica {
    id: string;
    titulo: string;
    descripcion: string;
    size: string;
    url_archivo: string;
    fecha_subida: string;
}

interface Directivo {
    id: string;
    nombre: string;
    rol: string;
    url_foto: string | null;
    orden: number;
}

interface Noticia {
    id: string;
    fecha: string;
    titulo: string;
    url_documento: string;
    created_at: string;
}

interface MensajeContacto {
    id: string;
    nombre: string;
    email: string;
    asunto: string;
    mensaje: string;
    fecha_envio: string;
    leido: boolean;
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
    const [activeTab, setActiveTab] = useState<'anillas' | 'generales' | 'miembros' | 'normativas' | 'directiva' | 'asociaciones' | 'noticias' | 'mensajes' | 'concursos' | 'impresos' | 'galeria' | 'liga'>('anillas');
    const [adminViewMode, setAdminViewMode] = useState<'global' | 'asociacion'>('global');
    const [selectedAsocId, setSelectedAsocId] = useState<string>('');
    const [asociacionesList, setAsociacionesList] = useState<Asociacion[]>([]);

    // Upload & Forms States
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });

    const [nuevoMiembro, setNuevoMiembro] = useState({ nombre: '', rol: '', correo: '', telefono: '', asociacion_id: '' });
    const [guardandoMiembro, setGuardandoMiembro] = useState(false);
    const [miembroMessage, setMiembroMessage] = useState({ type: '', text: '' });

    const [nuevaNormativa, setNuevaNormativa] = useState({ titulo: '', descripcion: '' });
    const [isDraggingNormativa, setIsDraggingNormativa] = useState(false);

    // Directiva management states
    const [comiteMembers, setComiteMembers] = useState<Directivo[]>([]);
    const [juntaMembers, setJuntaMembers] = useState<Directivo[]>([]);
    const [directivoForm, setDirectivoForm] = useState({ id: '', nombre: '', rol: '', orden: 0, grupo: 'comite' as 'comite' | 'junta' });
    const [directivoFoto, setDirectivoFoto] = useState<File | null>(null);
    const [directivoFormMode, setDirectivoFormMode] = useState<'add' | 'edit'>('add');
    const [directivoMessage, setDirectivoMessage] = useState({ type: '', text: '' });
    const [guardandoDirectivo, setGuardandoDirectivo] = useState(false);

    // Asociaciones management states
    const [asocForm, setAsocForm] = useState({ id: '', nombre: '', provincia: '', email: '', password: '' });
    const [asocLogoFile, setAsocLogoFile] = useState<File | null>(null);
    const [asocFormMode, setAsocFormMode] = useState<'add' | 'edit'>('add');
    const [asocMessage, setAsocMessage] = useState({ type: '', text: '' });
    const [guardandoAsoc, setGuardandoAsoc] = useState(false);

    // Noticias management states
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [nuevaNoticia, setNuevaNoticia] = useState({ titulo: '', fecha: new Date().toISOString().split('T')[0] });
    const [noticiaMessage, setNoticiaMessage] = useState({ type: '', text: '' });

    // Mensajes de contacto management states
    const [mensajesContacto, setMensajesContacto] = useState<MensajeContacto[]>([]);
    const [expandedMensajeId, setExpandedMensajeId] = useState<string | null>(null);

    // Liga SANSOFÉ pending count state
    const [ligaPendientesCount, setLigaPendientesCount] = useState<number>(0);

    // Data Collections
    const [documents, setDocuments] = useState<Documento[]>([]);
    const [documentosGenerales, setDocumentosGenerales] = useState<DocumentoGeneral[]>([]);
    const [miembros, setMiembros] = useState<Miembro[]>([]);
    const [normativas, setNormativas] = useState<NormativaPublica[]>([]);

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!isMounted) return;
            
            setSession(session);
            if (session) {
                await fetchUserData(session.user.id);
            } else {
                setLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'INITIAL_SESSION') return; // Handled by getSession
            if (!isMounted) return;

            setSession(session);
            if (session) {
                await fetchUserData(session.user.id);
            } else {
                setUserData(null);
                setDocuments([]);
                setDocumentosGenerales([]);
                setMiembros([]);
                setNormativas([]);
                setNoticias([]);
                setLoading(false);
            }
        });

        // Failsafe timeout de 5 segundos para asegurar que no se quede bloqueado en "Cargando..."
        const fallback = setTimeout(() => {
            if (isMounted) {
                console.warn("⚠️ Forzando fin de carga por timeout de seguridad...");
                setLoading(false);
            }
        }, 5000);

        return () => {
            isMounted = false;
            subscription.unsubscribe();
            clearTimeout(fallback);
        };
    }, []);

    const fetchUserData = async (userId: string) => {
        try {
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

        let q4 = supabase.from('normativas_publicas').select('*').order('fecha_subida', { ascending: false });
        const { data: d4 } = await q4;
        setNormativas((d4 || []) as NormativaPublica[]);

        // Cargar listas de la cúpula directiva
        let q5 = supabase.from('comite_ejecutivo').select('*').order('orden', { ascending: true });
        const { data: d5 } = await q5;
        setComiteMembers((d5 || []) as Directivo[]);

        let q6 = supabase.from('junta_directiva').select('*').order('orden', { ascending: true });
        const { data: d6 } = await q6;
        setJuntaMembers((d6 || []) as Directivo[]);

        let q7 = supabase.from('noticias').select('*').order('fecha', { ascending: false });
        const { data: d7 } = await q7;
        setNoticias((d7 || []) as Noticia[]);

        let q8 = supabase.from('mensajes_contacto').select('*').order('fecha_envio', { ascending: false });
        const { data: d8 } = await q8;
        setMensajesContacto((d8 || []) as MensajeContacto[]);

        let q9 = supabase.from('liga_sansofe_inscripciones').select('id', { count: 'exact' }).eq('estado', 'pendiente');
        const { count: count9 } = await q9;
        setLigaPendientesCount(count9 || 0);
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



    const handleUploadNormativaDirect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        if (!nuevaNormativa.titulo || !nuevaNormativa.descripcion) {
            setUploadMessage({ type: 'error', text: 'Por favor, rellena el título y la descripción antes de subir el PDF.' });
            e.target.value = '';
            return;
        }

        try {
            setUploading(true);
            setUploadMessage({ type: '', text: '' });
            
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            
            // Sanitizamos el título para crear un nombre de archivo amigable
            const cleanTitle = nuevaNormativa.titulo
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // eliminar acentos/tildes
                .replace(/[^a-z0-9]+/g, "_")    // reemplazar espacios y caracteres especiales por guiones bajos
                .replace(/^_+|_+$/g, "");       // recortar guiones bajos iniciales/finales
            
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const fileName = `normativas/${cleanTitle}_${randomSuffix}.${fileExt}`;
            
            const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
            const sizeStr = file.size < 1024 * 1024 ? `${Math.round(file.size / 1024)} KB` : `${sizeInMB} MB`;

            // Subida INMEDIATA desde el selector del archivo
            const { error: uploadError } = await supabase.storage
                .from('documentos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { error: dbError } = await supabase
                .from('normativas_publicas')
                .insert({
                    titulo: nuevaNormativa.titulo,
                    descripcion: nuevaNormativa.descripcion,
                    size: sizeStr,
                    url_archivo: fileName
                });

            if (dbError) throw dbError;

            setNuevaNormativa({ titulo: '', descripcion: '' });
            setUploadMessage({ type: 'success', text: "Normativa publicada con éxito." });
            fetchAllData(); 
            setTimeout(() => setUploadMessage({ type: '', text: '' }), 4000);
            
        } catch (error: any) {
            console.error("Upload error caught:", error);
            setUploadMessage({ type: 'error', text: error.message || "Error al subir la normativa" });
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDeleteNormativa = async (id: string, filePath: string) => {
        if (!confirm("¿Seguro que deseas eliminar esta normativa pública?")) return;
        try {
            const { error: storageError } = await supabase.storage.from('documentos').remove([filePath]);
            if (storageError) console.error("Could not delete file from storage", storageError);

            const { error: dbError } = await supabase.from('normativas_publicas').delete().eq('id', id);
            if (dbError) throw dbError;

            setNormativas(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            alert("Error al eliminar normativa.");
        }
    }

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

        const targetAsocId = isAdmin ? nuevoMiembro.asociacion_id : userData?.asociacion_id;
        if (!targetAsocId) {
            setMiembroMessage({ type: 'error', text: 'Por favor, selecciona una asociación vinculada.' });
            return;
        }
        if (!nuevoMiembro.nombre || !nuevoMiembro.rol || !nuevoMiembro.correo) return;

        try {
            setGuardandoMiembro(true);
            const { error } = await supabase
                .from('miembros_asociacion')
                .insert({
                    asociacion_id: targetAsocId,
                    nombre: nuevoMiembro.nombre,
                    rol: nuevoMiembro.rol,
                    correo: nuevoMiembro.correo,
                    telefono: nuevoMiembro.telefono
                });

            if (error) throw error;

            setMiembroMessage({ type: 'success', text: 'Miembro añadido con éxito.' });
            setNuevoMiembro({ nombre: '', rol: '', correo: '', telefono: '', asociacion_id: '' });

            // Refrescar
            if (userData?.rol === 'admin') fetchAllData(adminViewMode === 'asociacion' ? selectedAsocId : undefined);
            else if (userData?.asociacion_id) fetchMyData(userData.asociacion_id);

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

    const handleSaveDirectivo = async (e: React.FormEvent) => {
        e.preventDefault();
        setDirectivoMessage({ type: '', text: '' });

        if (!directivoForm.nombre || !directivoForm.rol) {
            setDirectivoMessage({ type: 'error', text: 'Por favor, rellena el nombre y el rol.' });
            return;
        }

        try {
            setGuardandoDirectivo(true);
            let finalPhotoUrl = null;

            if (directivoFoto) {
                const fileExt = directivoFoto.name.split('.').pop();
                const fileName = `directiva/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
                
                const { error: uploadError } = await supabase.storage
                    .from('documentos')
                    .upload(fileName, directivoFoto);

                if (uploadError) throw uploadError;
                finalPhotoUrl = fileName;
            }

            if (directivoFormMode === 'add') {
                const { error: dbError } = await supabase
                    .from(directivoForm.grupo === 'comite' ? 'comite_ejecutivo' : 'junta_directiva')
                    .insert({
                        nombre: directivoForm.nombre,
                        rol: directivoForm.rol,
                        orden: directivoForm.orden || 0,
                        url_foto: finalPhotoUrl
                    });

                if (dbError) throw dbError;
                setDirectivoMessage({ type: 'success', text: 'Miembro directivo añadido con éxito.' });
            } else {
                // Edit mode
                const updateData: any = {
                    nombre: directivoForm.nombre,
                    rol: directivoForm.rol,
                    orden: directivoForm.orden || 0
                };
                if (finalPhotoUrl) updateData.url_foto = finalPhotoUrl;

                const { error: dbError } = await supabase
                    .from(directivoForm.grupo === 'comite' ? 'comite_ejecutivo' : 'junta_directiva')
                    .update(updateData)
                    .eq('id', directivoForm.id);

                if (dbError) throw dbError;
                setDirectivoMessage({ type: 'success', text: 'Miembro directivo actualizado con éxito.' });
            }

            // Reset
            setDirectivoForm({ id: '', nombre: '', rol: '', orden: 0, grupo: 'comite' });
            setDirectivoFoto(null);
            setDirectivoFormMode('add');
            
            // Reload all
            fetchAllData();

            setTimeout(() => setDirectivoMessage({ type: '', text: '' }), 4000);
        } catch (error: any) {
            console.error("Error directivo:", error);
            setDirectivoMessage({ type: 'error', text: error.message || 'Error al guardar directivo.' });
        } finally {
            setGuardandoDirectivo(false);
        }
    };

    const handleDeleteDirectivo = async (id: string, group: 'comite' | 'junta', urlFoto: string | null) => {
        if (!confirm("¿Seguro que deseas eliminar este directivo?")) return;
        try {
            if (urlFoto) {
                const { error: storageError } = await supabase.storage.from('documentos').remove([urlFoto]);
                if (storageError) console.error("Could not delete directivo photo", storageError);
            }

            const { error: dbError } = await supabase
                .from(group === 'comite' ? 'comite_ejecutivo' : 'junta_directiva')
                .delete()
                .eq('id', id);

            if (dbError) throw dbError;

            if (group === 'comite') setComiteMembers(prev => prev.filter(m => m.id !== id));
            else setJuntaMembers(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            alert("Error al eliminar directivo.");
        }
    };

    const handleSaveAsociacion = async (e: React.FormEvent) => {
        e.preventDefault();
        setAsocMessage({ type: '', text: '' });

        if (!asocForm.nombre || !asocForm.provincia || !asocForm.email) {
            setAsocMessage({ type: 'error', text: 'Por favor, rellena todos los campos obligatorios.' });
            return;
        }

        try {
            setGuardandoAsoc(true);
            let logoPath = null;

            if (asocLogoFile) {
                const fileExt = asocLogoFile.name.split('.').pop();
                logoPath = `logos/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('documentos')
                    .upload(logoPath, asocLogoFile);

                if (uploadError) throw uploadError;
            }

            if (asocFormMode === 'add') {
                const { data, error } = await supabase.rpc('crear_asociacion_completa', {
                    p_nombre: asocForm.nombre,
                    p_provincia: asocForm.provincia,
                    p_email: asocForm.email,
                    p_password: asocForm.password || 'password123',
                    p_url_logo: logoPath
                });

                if (error) throw error;
                setAsocMessage({ type: 'success', text: 'Asociación registrada con éxito.' });
            } else {
                const { error } = await supabase.rpc('actualizar_asociacion_completa', {
                    p_id: asocForm.id,
                    p_nombre: asocForm.nombre,
                    p_provincia: asocForm.provincia,
                    p_email: asocForm.email,
                    p_password: asocForm.password || null,
                    p_url_logo: logoPath || null
                });

                if (error) throw error;
                setAsocMessage({ type: 'success', text: 'Asociación actualizada con éxito.' });
            }

            setAsocForm({ id: '', nombre: '', provincia: '', email: '', password: '' });
            setAsocLogoFile(null);
            setAsocFormMode('add');
            
            // Reload all
            await fetchAsociacionesList();
            fetchAllData();

            setTimeout(() => setAsocMessage({ type: '', text: '' }), 4000);
        } catch (error: any) {
            console.error("Error asociacion:", error);
            setAsocMessage({ type: 'error', text: error.message || 'Error al procesar asociación.' });
        } finally {
            setGuardandoAsoc(false);
        }
    };

    const handleDeleteAsociacion = async (id: string, urlLogo: string | null) => {
        if (!confirm("¿Seguro que deseas eliminar esta asociación? Se purgará en cascada de la base de datos y de la autenticación.")) return;
        try {
            if (urlLogo && !urlLogo.startsWith('/assets/')) {
                const { error: storageError } = await supabase.storage.from('documentos').remove([urlLogo]);
                if (storageError) console.error("Could not delete logo from storage", storageError);
            }

            const { error } = await supabase.rpc('eliminar_asociacion_completa', { p_id: id });
            if (error) throw error;

            await fetchAsociacionesList();
            fetchAllData();
        } catch (error: any) {
            alert("Error al eliminar la asociación: " + error.message);
        }
    };

    const handleUploadNoticiaDirect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        
        if (!nuevaNoticia.titulo || !nuevaNoticia.fecha) {
            setNoticiaMessage({ type: 'error', text: 'Por favor, rellena el título y la fecha antes de subir el documento.' });
            e.target.value = '';
            return;
        }

        try {
            setUploading(true);
            setNoticiaMessage({ type: '', text: '' });
            
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            
            // Sanitizamos el título para crear un nombre de archivo amigable
            const cleanTitle = nuevaNoticia.titulo
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // eliminar acentos/tildes
                .replace(/[^a-z0-9]+/g, "_")    // reemplazar espacios y caracteres especiales por guiones bajos
                .replace(/^_+|_+$/g, "");       // recortar guiones bajos iniciales/finales
            
            const randomSuffix = Math.random().toString(36).substring(2, 7);
            const fileName = `noticias/${cleanTitle}_${randomSuffix}.${fileExt}`;

            // Subida INMEDIATA desde el selector del archivo
            const { error: uploadError } = await supabase.storage
                .from('documentos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { error: dbError } = await supabase
                .from('noticias')
                .insert({
                    titulo: nuevaNoticia.titulo,
                    fecha: nuevaNoticia.fecha,
                    url_documento: fileName
                });

            if (dbError) throw dbError;

            setNuevaNoticia({ titulo: '', fecha: new Date().toISOString().split('T')[0] });
            setNoticiaMessage({ type: 'success', text: "Noticia publicada con éxito." });
            
            // Recargar datos
            const { data: d7 } = await supabase.from('noticias').select('*').order('fecha', { ascending: false });
            setNoticias((d7 || []) as Noticia[]);

            setTimeout(() => setNoticiaMessage({ type: '', text: '' }), 4000);
            
        } catch (error: any) {
            console.error("Upload error caught:", error);
            setNoticiaMessage({ type: 'error', text: error.message || "Error al subir la noticia" });
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDeleteNoticia = async (id: string, filePath: string) => {
        if (!confirm("¿Seguro que deseas eliminar esta noticia?")) return;
        try {
            const { error: storageError } = await supabase.storage.from('documentos').remove([filePath]);
            if (storageError) console.error("Could not delete file from storage", storageError);

            const { error: dbError } = await supabase.from('noticias').delete().eq('id', id);
            if (dbError) throw dbError;

            setNoticias(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            alert("Error al eliminar la noticia.");
        }
    };

    const handleDeleteMensaje = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar este mensaje de contacto?")) return;
        try {
            const { error } = await supabase.from('mensajes_contacto').delete().eq('id', id);
            if (error) throw error;
            setMensajesContacto(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            console.error("Error al eliminar mensaje:", error);
            alert("Error al eliminar el mensaje de contacto.");
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            const { error } = await supabase.from('mensajes_contacto').update({ leido: true }).eq('id', id);
            if (error) throw error;
            setMensajesContacto(prev => prev.map(m => m.id === id ? { ...m, leido: true } : m));
        } catch (error) {
            console.error("Error al marcar como leído:", error);
        }
    };

    const toggleMensajeExpanded = async (id: string, leido: boolean) => {
        setExpandedMensajeId(prev => prev === id ? null : id);
        if (!leido) {
            await handleMarkAsRead(id);
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

                        {/* TABS NAVIGATION: DESPLEGABLE Y PILLS MODERNAS */}
                        <div className="bg-card p-2.5 rounded-2xl border border-border shadow-sm mb-6 space-y-3 sm:space-y-0">
                            {/* Selector móvil (Drop-down estilizado profesional con Lucide Icons) */}
                            <div className="block lg:hidden">
                                <label className="block text-[11px] font-bold text-foreground/50 uppercase tracking-wider mb-1.5 px-1">
                                    Sección activa
                                </label>

                                <div className="relative">
                                    {/* Icono vectorial de la pestaña actualmente seleccionada */}
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none flex items-center gap-2">
                                        {activeTab === 'anillas' && <FileUp className="w-4 h-4" />}
                                        {activeTab === 'generales' && <FolderArchive className="w-4 h-4" />}
                                        {activeTab === 'miembros' && <Users className="w-4 h-4" />}
                                        {activeTab === 'liga' && <Trophy className="w-4 h-4" />}
                                        {activeTab === 'concursos' && <Calendar className="w-4 h-4" />}
                                        {activeTab === 'asociaciones' && <Building2 className="w-4 h-4" />}
                                        {activeTab === 'noticias' && <Newspaper className="w-4 h-4" />}
                                        {activeTab === 'galeria' && <ImageIcon className="w-4 h-4" />}
                                        {activeTab === 'impresos' && <FileText className="w-4 h-4" />}
                                        {activeTab === 'normativas' && <ShieldCheck className="w-4 h-4" />}
                                        {activeTab === 'directiva' && <UserCircle className="w-4 h-4" />}
                                        {activeTab === 'mensajes' && <Mail className="w-4 h-4" />}
                                    </div>

                                    <select
                                        value={activeTab}
                                        onChange={(e) => setActiveTab(e.target.value as any)}
                                        className="w-full bg-background border border-border rounded-xl pl-10 pr-10 py-3 text-sm font-semibold text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
                                    >
                                        <optgroup label="Gestión de Asociación">
                                            <option value="anillas">Petición de Anillas</option>
                                            <option value="generales">Documentos Generales</option>
                                            <option value="miembros">Miembros de la Asociación</option>
                                        </optgroup>
                                        {isAdmin && (
                                            <optgroup label="Administración Global">
                                                <option value="liga">
                                                    Liga Canaria SANSOFÉ {ligaPendientesCount > 0 ? `(${ligaPendientesCount} pendientes)` : ''}
                                                </option>
                                                <option value="concursos">Concursos</option>
                                                <option value="asociaciones">Asociaciones Afiliadas</option>
                                                <option value="noticias">Noticias</option>
                                                <option value="galeria">Galería de Fotos</option>
                                                <option value="impresos">Impresos Oficiales</option>
                                                <option value="normativas">Normativas Públicas</option>
                                                <option value="directiva">Cúpula Directiva</option>
                                                <option value="mensajes">
                                                    Mensajes de Contacto {mensajesContacto.filter(m => !m.leido).length > 0 ? `(${mensajesContacto.filter(m => !m.leido).length} sin leer)` : ''}
                                                </option>
                                            </optgroup>
                                        )}
                                    </select>

                                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 pointer-events-none">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Selector Desktop / Tablet (Pills Categorizadas y Elegantes) */}
                            <div className="hidden lg:flex flex-wrap items-center justify-between gap-2 p-1">
                                {/* Bloque 1: Gestión de Asociación y Estructura */}
                                <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/60">
                                    <button
                                        onClick={() => setActiveTab('anillas')}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'anillas' ? 'bg-card text-primary shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                                    >
                                        <FileUp className="w-3.5 h-3.5" />
                                        Anillas
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('generales')}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'generales' ? 'bg-card text-primary shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                                    >
                                        <FolderArchive className="w-3.5 h-3.5" />
                                        Documentos
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('miembros')}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'miembros' ? 'bg-card text-primary shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                                    >
                                        <Users className="w-3.5 h-3.5" />
                                        Miembros
                                    </button>

                                    {isAdmin && (
                                        <>
                                            <div className="w-px h-4 bg-border/80 mx-0.5" />
                                            <button
                                                onClick={() => setActiveTab('asociaciones')}
                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'asociaciones' ? 'bg-card text-primary shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                                            >
                                                <Building2 className="w-3.5 h-3.5" />
                                                Asociaciones
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('directiva')}
                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'directiva' ? 'bg-card text-primary shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                                            >
                                                <UserCircle className="w-3.5 h-3.5" />
                                                Directiva
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Bloque 2: Herramientas Globales y Federación */}
                                {isAdmin && (
                                    <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/60 overflow-x-auto">
                                        <button
                                            onClick={() => setActiveTab('liga')}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'liga' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                                        >
                                            <Trophy className="w-3.5 h-3.5" />
                                            Liga SANSOFÉ
                                            {ligaPendientesCount > 0 && (
                                                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse shrink-0">
                                                    {ligaPendientesCount}
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('concursos')}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'concursos' ? 'bg-card text-primary shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                                        >
                                            <Calendar className="w-3.5 h-3.5" />
                                            Concursos
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('noticias')}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'noticias' ? 'bg-card text-primary shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                                        >
                                            <Newspaper className="w-3.5 h-3.5" />
                                            Noticias
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('galeria')}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'galeria' ? 'bg-card text-primary shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                                        >
                                            <ImageIcon className="w-3.5 h-3.5" />
                                            Galería
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('impresos')}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'impresos' ? 'bg-card text-primary shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                                        >
                                            <FileText className="w-3.5 h-3.5" />
                                            Impresos
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('normativas')}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'normativas' ? 'bg-card text-primary shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                                        >
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            Normativas
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('mensajes')}
                                            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === 'mensajes' ? 'bg-card text-primary shadow-sm' : 'text-foreground/70 hover:text-foreground'}`}
                                        >
                                            <Mail className="w-3.5 h-3.5" />
                                            Contacto
                                            {mensajesContacto.filter(m => !m.leido).length > 0 && (
                                                <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse shrink-0">
                                                    {mensajesContacto.filter(m => !m.leido).length}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
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
                                {/* Formulario para agregar miembros */}
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
                                        {isAdmin && (
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Asociación Vinculada</label>
                                                <select 
                                                    required 
                                                    value={nuevoMiembro.asociacion_id} 
                                                    onChange={e => setNuevoMiembro({ ...nuevoMiembro, asociacion_id: e.target.value })} 
                                                    className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                                >
                                                    <option value="">Selecciona una asociación...</option>
                                                    {asociacionesList.map(a => (
                                                        <option key={a.id} value={a.id}>{a.nombre}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

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

                        {/* TAB 4: Normativas Públicas */}
                        {activeTab === 'normativas' && isAdmin && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Upload Box */}
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="font-heading text-xl font-bold text-foreground">Añadir Nueva Normativa</h2>
                                            <p className="text-sm text-foreground/60">Selecciona o arrastra un PDF, revisa los datos y publícalo.</p>
                                        </div>
                                    </div>

                                    {uploadMessage.text && (
                                        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 mb-6 ${uploadMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                                            {uploadMessage.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                                            {uploadMessage.text}
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Título de la Normativa</label>
                                                <input type="text" value={nuevaNormativa.titulo} onChange={e => setNuevaNormativa({ ...nuevaNormativa, titulo: e.target.value })} className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Ej. Estatutos FOCCA-FOCDE" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Descripción breve</label>
                                                <input type="text" value={nuevaNormativa.descripcion} onChange={e => setNuevaNormativa({ ...nuevaNormativa, descripcion: e.target.value })} className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Ej. Reglamento base de nuestra federación" />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2 border-t border-border/50">
                                            <label className={`flex items-center gap-2 px-6 py-2.5 font-medium rounded-xl transition-colors ${(!nuevaNormativa.titulo || !nuevaNormativa.descripcion || uploading) ? 'bg-emerald-600/50 text-white cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'}`}>
                                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                                                {uploading ? "Subiendo..." : "Seleccionar y Subir PDF"}
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept=".pdf" 
                                                    disabled={!nuevaNormativa.titulo || !nuevaNormativa.descripcion || uploading}
                                                    onChange={handleUploadNormativaDirect} 
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* List Box */}
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <h2 className="font-heading text-xl font-bold text-foreground mb-6">Normativas Publicadas</h2>
                                    <div className="space-y-3">
                                        {normativas.length === 0 ? (
                                            <p className="text-center py-8 text-foreground/40 italic text-sm border-2 border-dashed border-border rounded-xl">No hay normativas publicadas.</p>
                                        ) : (
                                            normativas.map((doc) => (
                                                <div key={doc.id} className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between p-4 border border-border/60 hover:border-border transition-colors rounded-2xl bg-slate-50/50 dark:bg-background/20 group">
                                                    <div className="flex gap-4 items-start sm:items-center">
                                                        <div className="p-3 bg-white dark:bg-background rounded-xl shadow-sm border border-border/50 text-foreground/50 group-hover:text-primary transition-colors shrink-0">
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground truncate max-w-[200px] sm:max-w-xs">{doc.titulo}</p>
                                                            <p className="text-xs text-foreground/60">{doc.descripcion} • {doc.size}</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleDeleteNormativa(doc.id, doc.url_archivo)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0" title="Eliminar normativa">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 5: Gestión de Cúpula Directiva */}
                        {activeTab === 'directiva' && isAdmin && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Formulario para agregar / editar directivo */}
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="font-heading text-xl font-bold text-foreground">
                                                {directivoFormMode === 'add' ? 'Añadir Integrante a la Cúpula' : 'Editar Integrante de la Cúpula'}
                                            </h2>
                                            <p className="text-sm text-foreground/60">Gestiona los integrantes del Comité Ejecutivo o la Junta Directiva.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSaveDirectivo} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Nombre Completo</label>
                                                <input 
                                                    required 
                                                    type="text" 
                                                    value={directivoForm.nombre} 
                                                    onChange={e => setDirectivoForm({ ...directivoForm, nombre: e.target.value })} 
                                                    className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                                                    placeholder="Ej. D. Antonio Castellano Domínguez" 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Cargo / Rol</label>
                                                <input 
                                                    required 
                                                    type="text" 
                                                    value={directivoForm.rol} 
                                                    onChange={e => setDirectivoForm({ ...directivoForm, rol: e.target.value })} 
                                                    className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                                                    placeholder="Ej. Presidente, Vocal..." 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Orden de Aparición</label>
                                                <input 
                                                    type="number" 
                                                    value={directivoForm.orden} 
                                                    onChange={e => setDirectivoForm({ ...directivoForm, orden: parseInt(e.target.value, 10) || 0 })} 
                                                    className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Grupo</label>
                                                <select 
                                                    value={directivoForm.grupo} 
                                                    onChange={e => setDirectivoForm({ ...directivoForm, grupo: e.target.value as 'comite' | 'junta' })} 
                                                    className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                                >
                                                    <option value="comite">Comité Ejecutivo</option>
                                                    <option value="junta">Junta Directiva</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-foreground block">Fotografía (Opcional)</label>
                                            <input 
                                                type="file" 
                                                accept="image/*" 
                                                onChange={e => setDirectivoFoto(e.target.files?.[0] || null)} 
                                                className="text-sm text-foreground/75"
                                            />
                                        </div>

                                        <div className="flex gap-2 justify-end pt-2 border-t border-border/50">
                                            {directivoFormMode === 'edit' && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        setDirectivoForm({ id: '', nombre: '', rol: '', orden: 0, grupo: 'comite' });
                                                        setDirectivoFoto(null);
                                                        setDirectivoFormMode('add');
                                                    }}
                                                    className="px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors"
                                                >
                                                    Cancelar Edición
                                                </button>
                                            )}
                                            <button 
                                                type="submit" 
                                                disabled={guardandoDirectivo}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl transition-colors"
                                            >
                                                {guardandoDirectivo ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                                {guardandoDirectivo ? 'Guardando...' : directivoFormMode === 'add' ? 'Añadir a la Cúpula' : 'Guardar Cambios'}
                                            </button>
                                        </div>
                                        {directivoMessage.text && (
                                            <p className={`text-sm font-medium ${directivoMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                                {directivoMessage.text}
                                            </p>
                                        )}
                                    </form>
                                </div>

                                {/* Listado del Comité Ejecutivo */}
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <h3 className="font-heading font-bold text-lg mb-6 text-foreground">Miembros del Comité Ejecutivo</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {comiteMembers.length === 0 ? (
                                            <p className="col-span-2 text-center text-sm text-foreground/50 italic py-4">No hay integrantes en el Comité Ejecutivo.</p>
                                        ) : (
                                            comiteMembers.map(m => (
                                                <DirectivoRow 
                                                    key={m.id} 
                                                    member={m} 
                                                    group="comite" 
                                                    onEdit={() => {
                                                        setDirectivoForm({ id: m.id, nombre: m.nombre, rol: m.rol, orden: m.orden, grupo: 'comite' });
                                                        setDirectivoFormMode('edit');
                                                    }}
                                                    onDelete={() => handleDeleteDirectivo(m.id, 'comite', m.url_foto)} 
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Listado de la Junta Directiva */}
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <h3 className="font-heading font-bold text-lg mb-6 text-foreground">Miembros de la Junta Directiva</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {juntaMembers.length === 0 ? (
                                            <p className="col-span-2 text-center text-sm text-foreground/50 italic py-4">No hay integrantes en la Junta Directiva.</p>
                                        ) : (
                                            juntaMembers.map(m => (
                                                <DirectivoRow 
                                                    key={m.id} 
                                                    member={m} 
                                                    group="junta" 
                                                    onEdit={() => {
                                                        setDirectivoForm({ id: m.id, nombre: m.nombre, rol: m.rol, orden: m.orden, grupo: 'junta' });
                                                        setDirectivoFormMode('edit');
                                                    }}
                                                    onDelete={() => handleDeleteDirectivo(m.id, 'junta', m.url_foto)} 
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 6: Gestión de Asociaciones */}
                        {activeTab === 'asociaciones' && isAdmin && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Formulario para agregar / editar asociación */}
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                                            <Building2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="font-heading text-xl font-bold text-foreground">
                                                {asocFormMode === 'add' ? 'Registrar Nueva Asociación' : 'Editar Asociación y Credenciales'}
                                            </h2>
                                            <p className="text-sm text-foreground/60">Registra y vincula un usuario de acceso básico.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSaveAsociacion} className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Nombre de la Asociación</label>
                                                <input 
                                                    required 
                                                    type="text" 
                                                    value={asocForm.nombre} 
                                                    onChange={e => setAsocForm({ ...asocForm, nombre: e.target.value })} 
                                                    className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                                                    placeholder="Ej. A.O. AviLancelot" 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Provincia / Isla / Lugar</label>
                                                <input 
                                                    required 
                                                    type="text" 
                                                    value={asocForm.provincia} 
                                                    onChange={e => setAsocForm({ ...asocForm, provincia: e.target.value })} 
                                                    className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                                                    placeholder="Ej. Lanzarote" 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Correo de Inicio de Sesión (Usuario)</label>
                                                <input 
                                                    required 
                                                    type="email" 
                                                    value={asocForm.email} 
                                                    onChange={e => setAsocForm({ ...asocForm, email: e.target.value })} 
                                                    className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                                                    placeholder="Ej. castellanomendozaantonio@gmail.com" 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">
                                                    Contraseña {asocFormMode === 'edit' && '(dejar en blanco para no cambiar)'}
                                                </label>
                                                <input 
                                                    required={asocFormMode === 'add'} 
                                                    type="password" 
                                                    value={asocForm.password} 
                                                    onChange={e => setAsocForm({ ...asocForm, password: e.target.value })} 
                                                    className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                                                    placeholder="••••••••" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-foreground block">Logotipo / Imagen (Opcional)</label>
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={e => setAsocLogoFile(e.target.files?.[0] || null)}
                                                className="text-sm text-foreground/75"
                                            />
                                        </div>

                                        <div className="flex gap-2 justify-end pt-2 border-t border-border/50">
                                            {asocFormMode === 'edit' && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        setAsocForm({ id: '', nombre: '', provincia: '', email: '', password: '' });
                                                        setAsocLogoFile(null);
                                                        setAsocFormMode('add');
                                                    }}
                                                    className="px-4 py-2 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors"
                                                >
                                                    Cancelar Edición
                                                </button>
                                            )}
                                            <button 
                                                type="submit" 
                                                disabled={guardandoAsoc}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
                                            >
                                                {guardandoAsoc ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4" />}
                                                {guardandoAsoc ? 'Guardando...' : asocFormMode === 'add' ? 'Registrar Asociación' : 'Guardar Cambios'}
                                            </button>
                                        </div>
                                        {asocMessage.text && (
                                            <p className={`text-sm font-medium ${asocMessage.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                                {asocMessage.text}
                                            </p>
                                        )}
                                    </form>
                                </div>

                                {/* Listado de Asociaciones */}
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <h3 className="font-heading font-bold text-lg mb-6 text-foreground">Asociaciones Federadas Registradas</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {asociacionesList.map(a => (
                                            <AsociacionRow 
                                                key={a.id} 
                                                asoc={a} 
                                                onEdit={() => {
                                                    setAsocForm({ id: a.id, nombre: a.nombre, provincia: a.provincia || '', email: a.email || '', password: '' });
                                                    setAsocFormMode('edit');
                                                }}
                                                onDelete={() => handleDeleteAsociacion(a.id, a.url_logo || null)} 
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 7: Gestión de Noticias */}
                        {activeTab === 'noticias' && isAdmin && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* Upload Box */}
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
                                            <Newspaper className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="font-heading text-xl font-bold text-foreground">Publicar Nueva Noticia</h2>
                                            <p className="text-sm text-foreground/60">Sube un documento o boletín en formato PDF/Imagen para que los visitantes puedan verlo y descargarlo.</p>
                                        </div>
                                    </div>

                                    {noticiaMessage.text && (
                                        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 mb-6 ${noticiaMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                                            {noticiaMessage.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                                            {noticiaMessage.text}
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Título de la Noticia</label>
                                                <input 
                                                    type="text" 
                                                    value={nuevaNoticia.titulo} 
                                                    onChange={e => setNuevaNoticia({ ...nuevaNoticia, titulo: e.target.value })} 
                                                    className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                                                    placeholder="Ej. Resultados de la Convocatoria de Anillas 2027" 
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-medium text-foreground">Fecha de Publicación</label>
                                                <input 
                                                    type="date" 
                                                    value={nuevaNoticia.fecha} 
                                                    onChange={e => setNuevaNoticia({ ...nuevaNoticia, fecha: e.target.value })} 
                                                    className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none" 
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2 border-t border-border/50">
                                            <label className={`flex items-center gap-2 px-6 py-2.5 font-medium rounded-xl transition-colors ${(!nuevaNoticia.titulo || !nuevaNoticia.fecha || uploading) ? 'bg-rose-600/50 text-white cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'}`}>
                                                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
                                                {uploading ? "Subiendo..." : "Seleccionar y Subir Documento"}
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept=".pdf,.jpg,.jpeg,.png,.webp" 
                                                    onChange={handleUploadNoticiaDirect} 
                                                    disabled={!nuevaNoticia.titulo || !nuevaNoticia.fecha || uploading} 
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* List Box */}
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <h2 className="font-heading text-xl font-bold text-foreground mb-6">
                                        Noticias Publicadas
                                    </h2>
                                    <div className="space-y-3">
                                        {noticias.length === 0 ? (
                                            <p className="text-center py-8 text-foreground/40 italic text-sm border-2 border-dashed border-border rounded-xl">No hay noticias publicadas.</p>
                                        ) : (
                                            noticias.map((item) => (
                                                <div key={item.id} className="flex gap-4 items-center justify-between p-3 border border-border/60 hover:border-border transition-colors rounded-2xl bg-slate-50/50 dark:bg-background/20 w-full">
                                                    <div className="flex gap-3 items-center min-w-0">
                                                        <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 shrink-0">
                                                            <Newspaper className="w-5 h-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-foreground text-sm truncate max-w-[200px] sm:max-w-md">{item.titulo}</p>
                                                            <p className="text-xs text-foreground/60">{new Date(item.fecha).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 shrink-0">
                                                        <button 
                                                            onClick={() => handleDownload(item.titulo, item.url_documento)} 
                                                            className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg transition-colors" 
                                                            title="Descargar"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteNoticia(item.id, item.url_documento)} 
                                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors" 
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 8: Gestión de Mensajes Recibidos */}
                        {activeTab === 'mensajes' && isAdmin && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-primary">
                                            <Mail className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="font-heading text-xl font-bold text-foreground">Mensajes de Contacto Recibidos</h2>
                                            <p className="text-sm text-foreground/60">Consulta y gestiona las dudas y trámites enviados por los usuarios desde la página de contacto externa.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {mensajesContacto.length === 0 ? (
                                            <p className="text-center py-12 text-foreground/45 italic text-sm border-2 border-dashed border-border rounded-2xl">
                                                No se han recibido mensajes de contacto externos.
                                            </p>
                                        ) : (
                                            mensajesContacto.map((msg) => {
                                                const isExpanded = expandedMensajeId === msg.id;
                                                return (
                                                    <div 
                                                        key={msg.id} 
                                                        className="border border-border/60 hover:border-border transition-all rounded-2xl bg-slate-50/40 dark:bg-background/20 relative group overflow-hidden flex flex-col"
                                                    >
                                                        <div 
                                                            onClick={() => toggleMensajeExpanded(msg.id, msg.leido)}
                                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-5 sm:p-6 cursor-pointer select-none hover:bg-slate-100/50 dark:hover:bg-black/10 transition-colors"
                                                        >
                                                            <div className="min-w-0 flex-grow pr-2">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className="font-bold text-foreground text-sm truncate max-w-[200px] sm:max-w-xs flex items-center gap-1.5">
                                                                        {!msg.leido && (
                                                                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" title="Mensaje Nuevo (Sin leer)"></span>
                                                                        )}
                                                                        {msg.nombre}
                                                                    </span>
                                                                    <a 
                                                                        href={`mailto:${msg.email}`} 
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="text-xs text-primary hover:underline font-mono truncate max-w-[180px] sm:max-w-[250px]"
                                                                    >
                                                                        {msg.email}
                                                                    </a>
                                                                </div>
                                                                <h4 className="font-semibold text-foreground text-sm mt-1">{msg.asunto}</h4>
                                                            </div>
                                                            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                                                                {!msg.leido && (
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleMarkAsRead(msg.id);
                                                                        }}
                                                                        className="text-xs text-primary hover:text-primary-foreground hover:bg-primary/20 dark:hover:bg-primary/30 px-2.5 py-0.5 rounded-lg border border-primary/30 transition-all font-semibold shrink-0"
                                                                    >
                                                                       Marcar leído
                                                                    </button>
                                                                )}
                                                                <span className="text-[11px] text-foreground/45 font-semibold">
                                                                    {new Date(msg.fecha_envio).toLocaleDateString('es-ES', { 
                                                                        day: 'numeric', 
                                                                        month: 'long', 
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                                <button 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleDeleteMensaje(msg.id);
                                                                    }}
                                                                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                                                                    title="Eliminar mensaje permanentemente"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                                <span className="text-foreground/40 shrink-0">
                                                                    {isExpanded ? (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m18 15-6-6-6 6"/></svg>
                                                                    ) : (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m6 9 6 6 6-6"/></svg>
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {isExpanded && (
                                                            <div className="px-5 pb-5 sm:px-6 sm:pb-6 border-t border-border/40 pt-4 bg-white dark:bg-black/5 animate-in slide-in-from-top-2 duration-200 select-text">
                                                                <p className="text-sm text-foreground/75 leading-relaxed whitespace-pre-wrap select-text">
                                                                    {msg.mensaje}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 9: Gestión de Concursos */}
                        {activeTab === 'concursos' && isAdmin && (
                            <ConcursosAdmin />
                        )}

                        {/* TAB 10: Gestión de Impresos */}
                        {activeTab === 'impresos' && isAdmin && (
                            <ImpresosAdmin />
                        )}

                        {/* TAB 11: Gestión de Galería */}
                        {activeTab === 'galeria' && isAdmin && (
                            <GaleriaAdmin />
                        )}

                        {activeTab === 'liga' && isAdmin && (
                            <LigaSansofeAdmin />
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
    );
}

function DirectivoRow({ 
    member, 
    group, 
    onEdit, 
    onDelete 
}: { 
    member: Directivo, 
    group: 'comite' | 'junta', 
    onEdit: () => void, 
    onDelete: () => void 
}) {
    return (
        <div className="flex gap-4 items-center justify-between p-4 border border-border/60 hover:border-border transition-all rounded-2xl bg-slate-50/50 dark:bg-background/20 group">
            <div className="flex gap-3 items-center min-w-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 shrink-0 border border-border/50 shadow-inner">
                    {member.url_foto ? (
                        <img 
                            src={member.url_foto} 
                            alt={member.nombre} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                        />
                    ) : (
                        <UserCircle className="w-8 h-8 opacity-70" />
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate max-w-[200px] sm:max-w-xs">{member.nombre}</p>
                    <p className="text-xs text-foreground/60 font-medium">{member.rol}</p>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-secondary text-secondary-foreground mt-0.5 font-bold">
                        Orden: {member.orden}
                    </span>
                </div>
            </div>
            <div className="flex gap-1 shrink-0">
                <button 
                    onClick={onEdit} 
                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg transition-colors" 
                    title="Editar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </button>
                <button 
                    onClick={onDelete} 
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors" 
                    title="Eliminar"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

function AsociacionRow({ 
    asoc, 
    onEdit, 
    onDelete 
}: { 
    asoc: Asociacion, 
    onEdit: () => void, 
    onDelete: () => void 
}) {
    return (
        <div className="flex gap-4 items-center justify-between p-4 border border-border/60 hover:border-border transition-all rounded-2xl bg-slate-50/50 dark:bg-background/20 group">
            <div className="flex gap-3 items-center min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500 shrink-0 border border-border/50 shadow-inner">
                    {asoc.url_logo ? (
                        <img 
                            src={asoc.url_logo} 
                            alt={asoc.nombre} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-300"
                        />
                    ) : (
                        <Building2 className="w-7 h-7 opacity-70" />
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate max-w-[200px] sm:max-w-xs">{asoc.nombre}</p>
                    <p className="text-xs text-foreground/60">{asoc.provincia || 'Provincia no asignada'}</p>
                    {asoc.email && (
                        <p className="text-[10px] text-foreground/45 font-mono truncate max-w-[150px] sm:max-w-[200px]">{asoc.email}</p>
                    )}
                </div>
            </div>
            <div className="flex gap-1 shrink-0">
                <button 
                    onClick={onEdit} 
                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg transition-colors" 
                    title="Editar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                </button>
                <button 
                    onClick={onDelete} 
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors" 
                    title="Eliminar"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
