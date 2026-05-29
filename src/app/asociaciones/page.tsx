"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Landmark } from "lucide-react";

interface Asociacion {
    id: string;
    nombre: string;
    provincia: string;
    url_logo: string | null;
}

export default function AsociacionesPage() {
    const [asociaciones, setAsociaciones] = useState<Asociacion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchAsociaciones = async () => {
            try {
                const { data, error } = await supabase
                    .from('asociaciones')
                    .select('*')
                    .order('nombre', { ascending: true });

                if (!isMounted) return;
                if (data) {
                    setAsociaciones(data as Asociacion[]);
                }
            } catch (error) {
                console.error("Error loading associations:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchAsociaciones();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Nuestras Asociaciones
                    </h1>
                    <p className="text-foreground/70 text-lg">
                        Las asociaciones que conforman FOCCA-FOCDE son el motor de nuestra federación. Descubre las entidades que trabajan para promover la ornitología.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary/50" />
                        <p>Cargando asociaciones...</p>
                    </div>
                ) : asociaciones.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                        <Landmark className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground">No hay asociaciones registradas</h3>
                        <p className="text-foreground/60 mt-1">Actualmente no se han configurado asociaciones federadas.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {asociaciones.map((asoc) => (
                            <AsociacionCard key={asoc.id} asoc={asoc} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function AsociacionCard({ asoc }: { asoc: Asociacion }) {
    const [imageError, setImageError] = useState(false);

    // Calcular la ruta del logo
    let logoUrl = null;
    if (asoc.url_logo && !imageError) {
        if (asoc.url_logo.startsWith('/assets/')) {
            logoUrl = asoc.url_logo;
        } else {
            logoUrl = supabase.storage.from('documentos').getPublicUrl(asoc.url_logo).data.publicUrl;
        }
    }

    return (
        <div className="group relative flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm border border-border/60 hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="relative aspect-square bg-white w-full flex items-center justify-center p-6 border-b border-border/50">
                <div className="relative w-full h-full flex items-center justify-center">
                    {logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt={asoc.nombre}
                            fill
                            sizes="(max-w-768px) 100vw, 25vw"
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                            onError={() => setImageError(true)}
                            unoptimized={logoUrl.startsWith('/assets/')}
                        />
                    ) : (
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                            <Landmark className="w-10 h-10" />
                        </div>
                    )}
                </div>
            </div>
            <div className="p-6 text-center flex flex-col flex-grow">
                <h3 className="font-heading font-bold text-lg text-foreground truncate" title={asoc.nombre}>{asoc.nombre}</h3>
                <span className="text-sm font-medium text-primary mt-1 px-3 py-1 bg-primary/10 rounded-full w-fit mx-auto">
                    {asoc.provincia}
                </span>
            </div>
        </div>
    );
}
