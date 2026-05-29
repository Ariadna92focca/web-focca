"use client";

import { UserCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Directivo {
    id: string;
    nombre: string;
    rol: string;
    url_foto: string | null;
    orden: number;
}

export default function JuntaDirectivaPage() {
    const [comiteEjecutivo, setComiteEjecutivo] = useState<Directivo[]>([]);
    const [juntaDirectiva, setJuntaDirectiva] = useState<Directivo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const [r1, r2] = await Promise.all([
                    supabase.from('comite_ejecutivo').select('*').order('orden', { ascending: true }),
                    supabase.from('junta_directiva').select('*').order('orden', { ascending: true })
                ]);

                if (!isMounted) return;

                if (r1.data) setComiteEjecutivo(r1.data as Directivo[]);
                if (r2.data) setJuntaDirectiva(r2.data as Directivo[]);
            } catch (error) {
                console.error("Error cargando directiva:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Junta Directiva
                    </h1>
                    <p className="text-foreground/70 text-lg">
                        Conoce a los representantes que forman la cúpula directiva de FOCCA-FOCDE.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-foreground/50">
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary/50" />
                        <p>Cargando directivos...</p>
                    </div>
                ) : (
                    <>
                        {/* Sección Comité Ejecutivo */}
                        <div className="mb-20">
                            <div className="flex flex-col items-center mb-12">
                                <h2 className="font-heading text-3xl font-bold text-foreground inline-block relative">
                                    Comité Ejecutivo
                                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"></span>
                                </h2>
                            </div>
                            {comiteEjecutivo.length === 0 ? (
                                <p className="text-center italic text-foreground/50">No hay integrantes registrados en el Comité Ejecutivo.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {comiteEjecutivo.map((member) => (
                                        <MemberCard key={member.id} member={member} isExec={true} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sección Junta Directiva Completa */}
                        <div>
                            <div className="flex flex-col items-center mb-12">
                                <h2 className="font-heading text-3xl font-bold text-foreground inline-block relative">
                                    Junta Directiva
                                    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"></span>
                                </h2>
                            </div>
                            {juntaDirectiva.length === 0 ? (
                                <p className="text-center italic text-foreground/50">No hay integrantes registrados en la Junta Directiva.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 align-top">
                                    {juntaDirectiva.map((member) => (
                                        <MemberCard key={member.id} member={member} isExec={false} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function MemberCard({ member, isExec }: { member: Directivo, isExec: boolean }) {
    const [imageError, setImageError] = useState(false);

    // Obtener la URL pública de la foto en Supabase Storage
    const photoUrl = member.url_foto
        ? supabase.storage.from('documentos').getPublicUrl(member.url_foto).data.publicUrl
        : null;

    return (
        <div className={`flex flex-col items-center bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm text-center h-full transition-all hover:border-primary/30 hover:shadow-md ${isExec ? 'bg-primary/5 border-primary/20' : ''}`}>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5 text-primary shrink-0 overflow-hidden">
                {photoUrl && !imageError ? (
                    <img
                        src={photoUrl}
                        alt={member.nombre}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <UserCircle className="w-10 h-10" />
                )}
            </div>
            <h3 className="font-heading font-bold text-lg md:text-xl text-foreground mb-2 leading-tight">{member.nombre}</h3>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">{member.rol}</span>
        </div>
    );
}
