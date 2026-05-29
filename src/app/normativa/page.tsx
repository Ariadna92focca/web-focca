"use client";

import { Download, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface NormativaPublica {
    id: string;
    titulo: string;
    descripcion: string;
    size: string;
    url_archivo: string;
}

export default function NormativaPage() {
    const [documents, setDocuments] = useState<NormativaPublica[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        const fetchNormativas = async () => {
            try {
                console.log("⏳ Solicitando normativas a Supabase...");
                const { data, error } = await supabase
                    .from('normativas_publicas')
                    .select('*')
                    .order('fecha_subida', { ascending: false });

                if (!isMounted) return;
                
                console.log("✅ Normativas recibidas:", data);
                if (error) {
                    console.error("❌ Error de Supabase:", error);
                    throw error;
                }
                
                setDocuments(data || []);
            } catch (error: any) {
                console.error("❌ Error cargando normativas:", error.message || error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchNormativas();
        
        // Timeout de seguridad de 5 segundos
        const fallback = setTimeout(() => {
            if (isMounted && loading) {
                console.warn("⚠️ Forzando cierre de carga por timeout...");
                setLoading(false);
            }
        }, 5000);

        return () => {
            isMounted = false;
            clearTimeout(fallback);
        };
    }, []);

    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Normativa
                    </h1>
                    <p className="text-foreground/70 text-lg">
                        Repositorio de documentos y reglamentos oficiales de la federación disponibles para descarga y consulta.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-4xl space-y-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary/50" />
                        <p>Cargando documentos normativos...</p>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                        <FileText className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No hay documentos disponibles</h3>
                        <p className="text-foreground/60 mt-1">Actualmente no se han publicado normativas.</p>
                    </div>
                ) : (
                    documents.map((doc) => (
                        <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-card rounded-2xl border border-border shadow-sm group hover:border-primary/50 transition-colors">
                            <div className="flex items-start gap-4 mb-4 sm:mb-0">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">{doc.titulo}</h3>
                                    <p className="text-foreground/60 text-sm mt-1">{doc.descripcion}</p>
                                    <span className="text-xs text-foreground/40 mt-2 block font-medium">PDF • {doc.size}</span>
                                </div>
                            </div>

                            <button
                                onClick={async () => {
                                    try {
                                        const { data, error } = await supabase.storage
                                            .from('documentos')
                                            .createSignedUrl(doc.url_archivo, 60);
                                        
                                        if (error) throw error;
                                        window.open(data.signedUrl, '_blank');
                                    } catch (error) {
                                        console.error("Error al generar enlace de descarga:", error);
                                        alert("No se pudo descargar el documento en este momento.");
                                    }
                                }}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-xl hover:bg-secondary/80 transition-colors shrink-0"
                            >
                                <Download className="w-4 h-4" />
                                Descargar
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
