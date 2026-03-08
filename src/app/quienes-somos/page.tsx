export default function QuienesSomosPage() {
    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Quiénes Somos
                    </h1>
                    <p className="text-foreground/70 text-lg">
                        Conoce la historia, misión y objetivos que guían a la Federación Ornitológica Cultural y Deportiva (FOCCA-FOCDE).
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-4xl space-y-12">
                <section className="prose prose-slate dark:prose-invert prose-lg w-full max-w-none">
                    <h2 className="font-heading text-3xl font-bold text-foreground border-b border-border pb-4 w-full">Nuestra Historia</h2>
                    <p className="text-foreground/80 leading-relaxed">
                        FOCCA-FOCDE nace con la vocación de agrupar, representar y defender los intereses de las asociaciones ornitológicas deportivas y culturales asociadas. A lo largo de nuestra trayectoria, hemos consolidado un marco organizativo sólido y transparente, promoviendo las buenas prácticas y el desarrollo del ámbito ornitológico.
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-card rounded-2xl border border-border shadow-sm">
                        <h3 className="font-heading text-2xl font-bold text-primary mb-4">Misión</h3>
                        <p className="text-foreground/70 leading-relaxed">
                            Fomentar la cría, selección y protección de las aves deportivas y exóticas, estableciendo normativas rigurosas y promoviendo el conocimiento técnico a través de concursos, exposiciones y cursos de formación.
                        </p>
                    </div>

                    <div className="p-8 bg-card rounded-2xl border border-border shadow-sm">
                        <h3 className="font-heading text-2xl font-bold text-secondary-foreground mb-4">Visión</h3>
                        <p className="text-foreground/70 leading-relaxed">
                            Ser la federación de referencia en cultura ornitológica, reconocida por su excelencia, rigurosidad en los estándares y un profundo compromiso con el bienestar animal y la preservación de las especies.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
