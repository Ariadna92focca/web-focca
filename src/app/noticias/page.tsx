export default function NoticiasPage() {
    const noticias = [
        { title: "Abierto plazo de solicitud de anillas 2027", date: "15 Octubre, 2026", excerpt: "Recordamos a todas las asociaciones que el plazo para la primera convocatoria de anillas ya está abierto." },
        { title: "Resultados Liga Canaria SANSOFÉ", date: "02 Octubre, 2026", excerpt: "Ya están disponibles las clasificaciones generales de la última jornada disputada este fin de semana." },
        { title: "Nueva normativa para exposiciones", date: "28 Septiembre, 2026", excerpt: "Se ha actualizado el reglamento general de concursos. Rogamos a los participantes revisen los cambios." }
    ];

    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Noticias</h1>
                    <p className="text-foreground/70 text-lg">
                        Actualidad, comunicados y novedades de la Federación FOCCA-FOCDE.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {noticias.map((n, idx) => (
                        <div key={idx} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col group hover:-translate-y-1 transition-all hover:shadow-xl">
                            <div className="aspect-video bg-primary/5 flex items-center justify-center border-b border-border/50 text-primary/20">
                                <span className="font-heading font-bold text-2xl">FOCCA-FOCDE</span>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <p className="text-xs text-primary font-bold mb-3 uppercase tracking-wide">{n.date}</p>
                                <h3 className="font-heading text-lg font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">{n.title}</h3>
                                <p className="text-foreground/60 text-sm leading-relaxed mb-6 flex-grow">{n.excerpt}</p>
                                <span className="text-primary font-medium text-sm mt-auto">Leer más →</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
