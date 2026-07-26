"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Image as ImageIcon, X, FolderOpen } from "lucide-react";

interface Foto {
    id: string;
    titulo: string | null;
    album: string;
    url_imagen: string;
}

export default function GaleriaPage() {
    const [listaFotos, setListaFotos] = useState<Foto[]>([]);
    const [albumes, setAlbumes] = useState<string[]>([]);
    const [albumActivo, setAlbumActivo] = useState("Todos");
    const [cargando, setCargando] = useState(true);
    const [imagenModal, setImagenModal] = useState<string | null>(null);
    const [tituloModal, setTituloModal] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchFotos = async () => {
            try {
                const { data, error } = await supabase
                    .from("galeria")
                    .select("*")
                    .order("created_at", { ascending: false });

                if (error) throw error;
                
                if (isMounted) {
                    setListaFotos(data || []);
                    if (data) {
                        // Extraer álbumes únicos
                        const uniqueAlbums = Array.from(new Set(data.map((f: Foto) => f.album))) as string[];
                        setAlbumes(uniqueAlbums);
                    }
                }
            } catch (error) {
                console.error("Error al obtener fotos de galeria:", error);
            } finally {
                if (isMounted) {
                    setCargando(false);
                }
            }
        };

        fetchFotos();

        const fallback = setTimeout(() => {
            if (isMounted && cargando) {
                console.warn("Forzando fin de carga de galería por timeout.");
                setCargando(false);
            }
        }, 5000);

        return () => {
            isMounted = false;
            clearTimeout(fallback);
        };
    }, []);

    const getPublicUrl = (path: string) => {
        if (path.startsWith("/assets/")) return path;
        return supabase.storage.from("documentos").getPublicUrl(path).data.publicUrl;
    };

    const fotosFiltradas = albumActivo === "Todos" 
        ? listaFotos 
        : listaFotos.filter(f => f.album === albumActivo);

    return (
        <div className="w-full flex inset-0 flex-col">
            {/* Cabecera */}
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Galería Multimedia</h1>
                    <p className="text-foreground/70 text-lg">
                        Imágenes destacadas de nuestros eventos, concursos y asociaciones.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-6xl">
                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary/50" />
                        <p>Cargando galería multimedia...</p>
                    </div>
                ) : listaFotos.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                        <ImageIcon className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No hay fotos disponibles</h3>
                        <p className="text-foreground/60 mt-1">Actualmente no se han publicado fotos en la galería.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Filtros por Álbum / Carpeta */}
                        {albumes.length > 0 && (
                            <div className="flex flex-wrap items-center justify-center gap-2 pb-4 border-b border-border/50">
                                <button
                                    onClick={() => setAlbumActivo("Todos")}
                                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                                        albumActivo === "Todos"
                                            ? "bg-primary text-primary-foreground scale-105"
                                            : "bg-secondary/60 hover:bg-secondary text-foreground/80 hover:text-foreground"
                                    }`}
                                >
                                    Todos ({listaFotos.length})
                                </button>
                                {albumes.map((album) => {
                                    const count = listaFotos.filter(f => f.album === album).length;
                                    return (
                                        <button
                                            key={album}
                                            onClick={() => setAlbumActivo(album)}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 ${
                                                albumActivo === album
                                                    ? "bg-primary text-primary-foreground scale-105"
                                                    : "bg-secondary/60 hover:bg-secondary text-foreground/80 hover:text-foreground"
                                            }`}
                                        >
                                            <FolderOpen className="w-3.5 h-3.5" />
                                            {album} ({count})
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Rejilla de fotos */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {fotosFiltradas.map((foto) => (
                                <div 
                                    key={foto.id} 
                                    onClick={() => {
                                        setImagenModal(getPublicUrl(foto.url_imagen));
                                        setTituloModal(foto.titulo);
                                    }}
                                    className="relative aspect-square border border-border/50 rounded-2xl overflow-hidden bg-white dark:bg-card shadow-sm group cursor-zoom-in hover:border-primary/50 transition-all duration-300"
                                >
                                    <img
                                        src={getPublicUrl(foto.url_imagen)}
                                        alt={foto.titulo || `Galería ${foto.album}`}
                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                    />
                                    
                                    {/* Capa de interacción y títulos */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/20 backdrop-blur-sm self-start px-2 py-0.5 rounded-full mb-1">
                                            {foto.album}
                                        </span>
                                        {foto.titulo && (
                                            <h4 className="font-heading font-bold text-sm truncate">{foto.titulo}</h4>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal para ver fotos ampliadas */}
            {imagenModal && (
                <div 
                    className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => {
                        setImagenModal(null);
                        setTituloModal(null);
                    }}
                >
                    <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center justify-center bg-black/20">
                        <button 
                            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setImagenModal(null);
                                setTituloModal(null);
                            }}
                            title="Cerrar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        
                        <img 
                            src={imagenModal} 
                            alt="Galería ampliada" 
                            className="max-w-full max-h-[80vh] object-contain rounded-t-xl select-none"
                            onClick={(e) => e.stopPropagation()}
                        />
                        
                        {tituloModal && (
                            <div className="w-full bg-black/80 backdrop-blur-sm p-4 text-white text-center font-heading font-semibold text-sm border-t border-white/10 rounded-b-xl" onClick={(e) => e.stopPropagation()}>
                                {tituloModal}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
