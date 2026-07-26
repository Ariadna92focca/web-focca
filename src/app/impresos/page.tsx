"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Download, FileDown, ExternalLink, Loader2 } from "lucide-react";

interface Impreso {
    id: string;
    titulo: string;
    descripcion: string;
    es_externo: boolean;
    url_destino: string;
    documento_nombre: string | null;
    tamano_archivo: string | null;
}

export default function ImpresosPage() {
    const [listaImpresos, setListaImpresos] = useState<Impreso[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchImpresos = async () => {
            try {
                const { data, error } = await supabase
                    .from("impresos")
                    .select("*")
                    .order("created_at", { ascending: true }); // mostramos los primeros creados al principio (como Anillas)

                if (error) throw error;
                if (isMounted) {
                    setListaImpresos(data || []);
                }
            } catch (error) {
                console.error("Error al obtener impresos:", error);
            } finally {
                if (isMounted) {
                    setCargando(false);
                }
            }
        };

        fetchImpresos();

        const fallback = setTimeout(() => {
            if (isMounted && cargando) {
                console.warn("Forzando fin de carga de impresos por timeout.");
                setCargando(false);
            }
        }, 5000);

        return () => {
            isMounted = false;
            clearTimeout(fallback);
        };
    }, []);

    const handleDownload = async (urlDestino: string) => {
        try {
            const { data, error } = await supabase.storage
                .from("documentos")
                .createSignedUrl(urlDestino, 60);

            if (error) throw error;
            window.open(data.signedUrl, "_blank");
        } catch (error) {
            console.error("Error al generar enlace de descarga:", error);
            alert("No se pudo abrir el documento en este momento.");
        }
    };

    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Impresos y Formularios
                    </h1>
                    <p className="text-foreground/70 text-lg">
                        Descarga los formularios administrativos y accede a los trámites oficiales de la federación.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-4xl">
                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary/50" />
                        <p>Cargando impresos y formularios...</p>
                    </div>
                ) : listaImpresos.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                        <FileDown className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No hay impresos disponibles</h3>
                        <p className="text-foreground/60 mt-1">Actualmente no se han publicado impresos oficiales.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {listaImpresos.map((form) => (
                            <div key={form.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-card rounded-2xl border border-border shadow-sm group hover:border-primary/50 transition-colors">
                                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                                    <div className="p-3 bg-secondary rounded-xl text-primary shrink-0">
                                        {form.es_externo ? <ExternalLink className="w-6 h-6" /> : <FileDown className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">{form.titulo}</h3>
                                        <p className="text-foreground/60 text-sm mt-1">{form.descripcion}</p>
                                        <span className={`text-xs mt-2 block font-medium ${form.es_externo ? 'text-primary/70' : 'text-foreground/40'}`}>
                                            {form.es_externo ? 'Redirección Externa' : `PDF • ${form.tamano_archivo}`}
                                        </span>
                                    </div>
                                </div>

                                {form.es_externo ? (
                                    <a
                                        href={form.url_destino}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shrink-0 shadow-sm w-full sm:w-auto"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Visitar
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => handleDownload(form.url_destino)}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shrink-0 shadow-sm w-full sm:w-auto"
                                    >
                                        <Download className="w-4 h-4" />
                                        Descargar
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
