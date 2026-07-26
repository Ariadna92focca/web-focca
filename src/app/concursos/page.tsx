"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, MapPin, Download, Loader2, X } from "lucide-react";

interface Concurso {
    id: string;
    titulo: string;
    lugar: string;
    fecha_inicio: string;
    fecha_fin: string;
    url_bases: string | null;
    documento_nombre: string | null;
    tamano_bases: string | null;
    estado: string;
    url_cartel: string | null;
}

export default function ConcursosPage() {
    const [listaConcursos, setListaConcursos] = useState<Concurso[]>([]);
    const [cargando, setCargando] = useState(true);
    const [imagenModal, setImagenModal] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchConcursos = async () => {
            try {
                const { data, error } = await supabase
                    .from("concursos")
                    .select("*")
                    .order("fecha_inicio", { ascending: false });

                if (error) throw error;
                if (isMounted) {
                    setListaConcursos(data || []);
                }
            } catch (error) {
                console.error("Error al obtener concursos:", error);
            } finally {
                if (isMounted) {
                    setCargando(false);
                }
            }
        };

        fetchConcursos();

        const fallback = setTimeout(() => {
            if (isMounted && cargando) {
                console.warn("Forzando fin de carga de concursos por timeout.");
                setCargando(false);
            }
        }, 5000);

        return () => {
            isMounted = false;
            clearTimeout(fallback);
        };
    }, []);

    const parseDate = (dateStr: string) => {
        const [year, month, day] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const getStatus = (startStr: string, endStr: string) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const inicio = parseDate(startStr);
        const fin = parseDate(endStr);
        fin.setHours(23, 59, 59, 999);

        if (hoy < inicio) return "Próximo";
        if (hoy > fin) return "Finalizado";
        return "En curso";
    };

    const formatRange = (startStr: string, endStr: string) => {
        const inicio = parseDate(startStr);
        const fin = parseDate(endStr);

        const diaInicio = inicio.getDate();
        const diaFin = fin.getDate();
        const mesInicio = inicio.toLocaleString("es-ES", { month: "long" });
        const mesFin = fin.toLocaleString("es-ES", { month: "long" });
        const anioInicio = inicio.getFullYear();
        const anioFin = fin.getFullYear();

        const mesInicioCap = mesInicio.charAt(0).toUpperCase() + mesInicio.slice(1);
        const mesFinCap = mesFin.charAt(0).toUpperCase() + mesFin.slice(1);

        if (anioInicio === anioFin) {
            if (mesInicio === mesFin) {
                if (diaInicio === diaFin) {
                    return `${diaInicio} de ${mesInicioCap}, ${anioInicio}`;
                }
                return `${diaInicio} al ${diaFin} de ${mesInicioCap}, ${anioInicio}`;
            }
            return `${diaInicio} de ${mesInicioCap} al ${diaFin} de ${mesFinCap}, ${anioInicio}`;
        }
        return `${diaInicio} de ${mesInicioCap}, ${anioInicio} al ${diaFin} de ${mesFinCap}, ${anioFin}`;
    };

    const getCartelUrl = (path: string) => {
        return supabase.storage.from("documentos").getPublicUrl(path).data.publicUrl;
    };

    const handleDownloadBases = async (urlBases: string) => {
        try {
            const { data, error } = await supabase.storage
                .from("documentos")
                .createSignedUrl(urlBases, 60);

            if (error) throw error;
            window.open(data.signedUrl, "_blank");
        } catch (error) {
            console.error("Error al generar enlace de descarga:", error);
            alert("No se pudo abrir el documento de bases en este momento.");
        }
    };

    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Concursos y Eventos</h1>
                    <p className="text-foreground/70 text-lg">
                        Calendario oficial de competiciones ornitológicas y eventos de la federación.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-5xl">
                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary/50" />
                        <p>Cargando concursos y eventos...</p>
                    </div>
                ) : listaConcursos.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                        <Calendar className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No hay concursos programados</h3>
                        <p className="text-foreground/60 mt-1">Actualmente no se han registrado eventos en el calendario.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {listaConcursos.map((c) => {
                            const status = getStatus(c.fecha_inicio, c.fecha_fin);
                            return (
                                <div key={c.id} className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-6 group hover:border-primary/50 transition-colors">
                                    
                                    {/* Cartel / Imagen de concurso */}
                                    {c.url_cartel && (
                                        <div 
                                            onClick={() => setImagenModal(getCartelUrl(c.url_cartel!))}
                                            className="w-full md:w-28 h-48 md:h-28 rounded-xl overflow-hidden shrink-0 border border-border/50 relative cursor-zoom-in group/cartel shadow-inner bg-slate-50 flex items-center justify-center self-center"
                                            title="Ver cartel completo"
                                        >
                                            <img 
                                                src={getCartelUrl(c.url_cartel!)} 
                                                alt={`Cartel ${c.titulo}`} 
                                                className="w-full h-full object-cover group-hover/cartel:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2 flex-grow min-w-0 py-2">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                                            status === "En curso" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                            status === "Finalizado" ? "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400" :
                                            "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                        }`}>
                                            {status}
                                        </div>
                                        <h3 className="font-heading text-xl font-bold text-foreground group-hover:text-primary transition-colors truncate" title={c.titulo}>
                                            {c.titulo}
                                        </h3>
                                        <div className="flex flex-col sm:flex-row gap-x-4 gap-y-1.5 text-sm text-foreground/60 font-semibold">
                                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {formatRange(c.fecha_inicio, c.fecha_fin)}</span>
                                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {c.lugar}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center shrink-0 self-end md:self-center w-full md:w-auto">
                                        {c.url_bases ? (
                                            <button 
                                                onClick={() => handleDownloadBases(c.url_bases!)}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors w-full md:w-auto shrink-0"
                                            >
                                                <Download className="w-4 h-4" />
                                                Ver Bases
                                            </button>
                                        ) : (
                                            <span className="text-xs text-foreground/40 italic py-2 md:py-0 w-full text-right md:text-left">Bases no disponibles</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal para ver el cartel en grande */}
            {imagenModal && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setImagenModal(null)}
                >
                    <div className="relative max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center bg-black/40">
                        <button 
                            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setImagenModal(null);
                            }}
                            title="Cerrar"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <img 
                            src={imagenModal} 
                            alt="Cartel ampliado" 
                            className="max-w-full max-h-[85vh] object-contain rounded-xl select-none"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
