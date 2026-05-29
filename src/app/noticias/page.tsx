"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, FileText, Download, X, Eye, Newspaper, Loader2, AlertCircle, ArrowRight, ExternalLink } from "lucide-react";

interface Noticia {
    id: string;
    fecha: string;
    titulo: string;
    url_documento: string;
    created_at: string;
}

export default function NoticiasPage() {
    const [noticias, setNoticias] = useState<Noticia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);
    const [modalPublicUrl, setModalPublicUrl] = useState<string>("");

    useEffect(() => {
        const fetchNoticias = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data, error } = await supabase
                    .from("noticias")
                    .select("*")
                    .order("fecha", { ascending: false });

                if (error) throw error;
                setNoticias((data || []) as Noticia[]);
            } catch (err: any) {
                console.error("Error fetching noticias:", err);
                setError("No se pudieron cargar las noticias de la federación. Por favor, inténtelo de nuevo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchNoticias();
    }, []);

    const openNoticia = (noticia: Noticia) => {
        setSelectedNoticia(noticia);
        const { data } = supabase.storage
            .from("documentos")
            .getPublicUrl(noticia.url_documento);
        setModalPublicUrl(data?.publicUrl || "");
    };

    const closeNoticia = () => {
        setSelectedNoticia(null);
        setModalPublicUrl("");
    };

    const handleDownload = (noticia: Noticia) => {
        if (!modalPublicUrl) return;
        const link = document.createElement("a");
        link.href = modalPublicUrl;
        // Clean name
        const cleanName = noticia.titulo
            .replace(/[^a-z0-9]/gi, "_")
            .toLowerCase();
        link.setAttribute("download", `${cleanName}.pdf`);
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    const isImageFile = (url: string) => {
        const ext = url.split(".").pop()?.toLowerCase();
        return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "");
    };

    return (
        <div className="w-full flex-grow bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
            {/* Elegant Soft Green Header Banner */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary via-emerald-800 to-teal-800 py-20 lg:py-24 text-white shadow-md">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent)] pointer-events-none" />
                <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-white/90 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <Newspaper className="w-3.5 h-3.5" />
                        Boletín Oficial
                    </span>
                    <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
                        Actualidad y Circulares
                    </h1>
                    <p className="text-white/80 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700">
                        Mantente informado sobre las últimas normativas, circulares oficiales y convocatorias de la Federación FOCCA-FOCDE.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-6xl">
                {error && (
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-6 rounded-3xl flex items-start gap-4 max-w-3xl mx-auto shadow-sm">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl shrink-0">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-foreground text-lg mb-1">Error de conexión</h3>
                            <p className="text-foreground/70 text-sm leading-relaxed">{error}</p>
                        </div>
                    </div>
                )}

                {loading ? (
                    /* Skeletons loader */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="bg-white dark:bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm flex flex-col h-[400px] animate-pulse">
                                <div className="aspect-video bg-slate-200 dark:bg-slate-800" />
                                <div className="p-6 flex flex-col flex-grow space-y-4">
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full flex-grow" />
                                    <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !error && noticias.length === 0 ? (
                    <div className="text-center py-20 max-w-md mx-auto">
                        <div className="w-20 h-20 bg-primary/5 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary dark:text-emerald-400 border-2 border-dashed border-primary/20 dark:border-emerald-900/50">
                            <Newspaper className="w-10 h-10" />
                        </div>
                        <h2 className="font-heading text-xl font-bold text-foreground mb-2">No hay comunicados</h2>
                        <p className="text-foreground/60 text-sm leading-relaxed">
                            Actualmente no se han publicado noticias o circulares oficiales en la plataforma. Vuelve a consultar más tarde.
                        </p>
                    </div>
                ) : (
                    /* Dynamic Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                        {noticias.map((item) => (
                            <div 
                                key={item.id} 
                                className="bg-white dark:bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm flex flex-col group hover:-translate-y-1.5 transition-all hover:shadow-xl duration-300 relative"
                            >
                                {/* Background gradient or custom header with soft green hues */}
                                <div className="aspect-video bg-gradient-to-br from-primary/10 via-emerald-500/5 to-teal-500/10 dark:from-primary/20 dark:to-teal-950/20 flex flex-col items-center justify-center border-b border-border/40 relative overflow-hidden shrink-0">
                                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                                    <div className="p-4 bg-white/80 dark:bg-black/25 rounded-2xl shadow-sm border border-white/20 text-primary dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300 relative z-10">
                                        <FileText className="w-8 h-8" />
                                    </div>
                                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center z-10">
                                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary text-primary-foreground shadow-sm">
                                            {item.url_documento.split(".").pop()?.toUpperCase() || "DOC"}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-7 flex flex-col flex-grow">
                                    <div className="flex items-center gap-1.5 text-xs text-foreground/50 font-semibold mb-3">
                                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                                        {formatDate(item.fecha)}
                                    </div>
                                    
                                    <h3 className="font-heading text-lg font-bold text-foreground mb-4 group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                                        {item.titulo}
                                    </h3>
                                    
                                    <div className="mt-auto pt-4 border-t border-border/30 flex justify-between items-center">
                                        <button 
                                            onClick={() => openNoticia(item)}
                                            className="inline-flex items-center gap-1 text-primary dark:text-emerald-400 hover:text-primary/80 dark:hover:text-emerald-350 font-bold text-sm group/btn"
                                        >
                                            Leer documento 
                                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                        
                                        <button 
                                            onClick={() => {
                                                const { data } = supabase.storage
                                                    .from("documentos")
                                                    .getPublicUrl(item.url_documento);
                                                if (data?.publicUrl) {
                                                    const link = document.createElement("a");
                                                    link.href = data.publicUrl;
                                                    link.setAttribute("download", item.titulo);
                                                    link.target = "_blank";
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    link.remove();
                                                }
                                            }}
                                            className="p-2 text-foreground/50 hover:text-primary dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all"
                                            title="Descargar boletín oficial"
                                        >
                                            <Download className="w-4.5 h-4.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Immersive Responsive Reader Modal */}
            {selectedNoticia && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="relative w-full h-full sm:max-w-5xl sm:h-[90vh] bg-white dark:bg-slate-900 sm:rounded-3xl shadow-2xl border border-white/10 dark:border-border/30 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-border/60 dark:border-border/20 flex items-center justify-between bg-slate-50 dark:bg-black/20 shrink-0">
                            <div className="min-w-0 pr-4">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 dark:bg-primary/25 text-primary dark:text-emerald-400 mb-1">
                                    {selectedNoticia.url_documento.split(".").pop()?.toUpperCase() || "DOC"}
                                </span>
                                <h3 className="font-heading text-lg font-bold text-foreground truncate max-w-xs sm:max-w-md md:max-w-xl" title={selectedNoticia.titulo}>
                                    {selectedNoticia.titulo}
                                </h3>
                                <p className="text-xs text-foreground/50 font-medium">
                                    Publicado el {formatDate(selectedNoticia.fecha)}
                                </p>
                            </div>

                            <button 
                                onClick={closeNoticia}
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-foreground/60 hover:text-foreground rounded-full transition-colors shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Reader Frame */}
                        <div className="flex-grow bg-slate-100 dark:bg-black/40 overflow-y-auto p-4 flex flex-col justify-center items-center relative min-h-0">
                            {modalPublicUrl ? (
                                isImageFile(selectedNoticia.url_documento) ? (
                                    <div className="w-full h-full flex items-center justify-center p-2">
                                        <img 
                                            src={modalPublicUrl} 
                                            alt={selectedNoticia.titulo} 
                                            className="max-w-full max-h-full object-contain rounded-2xl shadow-xl animate-in zoom-in-95 duration-300 border border-border/30 bg-white"
                                        />
                                    </div>
                                ) : (
                                    /* PDF Responsive Frame */
                                    <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-inner relative flex flex-col">
                                        {/* Browser PDF Fallback Banner (for mobiles or legacy browsers) */}
                                        <div className="sm:hidden p-3 bg-indigo-50 border-b border-indigo-100 text-indigo-800 text-xs font-semibold flex items-center gap-2">
                                            <ExternalLink className="w-4 h-4 shrink-0" />
                                            <span>¿No se visualiza bien el PDF? Pruébalo a pantalla completa.</span>
                                            <a 
                                                href={modalPublicUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="underline ml-auto shrink-0 text-primary"
                                            >
                                                Ver Pantalla Completa
                                            </a>
                                        </div>
                                        <iframe 
                                            src={`${modalPublicUrl}#toolbar=0&navpanes=0&scrollbar=1`} 
                                            className="w-full h-full border-none bg-white rounded-2xl" 
                                            title={selectedNoticia.titulo}
                                        />
                                    </div>
                                )
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-12">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                    <p className="text-sm text-foreground/50 font-medium">Obteniendo documento...</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer with Premium Download Call to Action */}
                        <div className="px-6 py-5 border-t border-border/60 dark:border-border/20 bg-slate-50 dark:bg-black/20 flex flex-col sm:flex-row justify-between items-center gap-4 shrink-0">
                            <span className="text-xs text-foreground/60 text-center sm:text-left leading-relaxed">
                                Documento oficial expedido por la Federación FOCCA-FOCDE.<br className="hidden sm:inline" /> Todos los derechos reservados.
                            </span>

                            <div className="flex gap-3 w-full sm:w-auto">
                                <a 
                                    href={modalPublicUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-5 py-3 border border-border hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold rounded-2xl transition-all grow sm:grow-0 text-foreground"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Pantalla Completa
                                </a>

                                <button 
                                    onClick={() => handleDownload(selectedNoticia)}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-emerald-700 hover:from-primary/95 hover:to-emerald-700/95 text-white shadow-md hover:shadow-lg text-sm font-bold rounded-2xl transition-all grow sm:grow-0 group/btn"
                                >
                                    <Download className="w-4.5 h-4.5 group-hover/btn:translate-y-0.5 transition-transform" />
                                    Descargar Documento Oficial
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
