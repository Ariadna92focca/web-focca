export default function LigaSansofePage() {
    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Liga Canaria SANSOFÉ
                    </h1>
                    <p className="text-foreground/70 text-lg">
                        Toda la información referente al campeonato de la Liga Canaria SANSOFÉ.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-5xl space-y-12">
                <section className="bg-card p-8 sm:p-12 rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <span className="text-primary text-2xl font-bold">1</span>
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ver Bases</h2>
                    <p className="text-foreground/70 max-w-2xl mx-auto">
                        Aquí se publicarán próximamente las bases oficiales para participar en la Liga Canaria SANSOFÉ.
                    </p>
                    <button className="mt-8 px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium opacity-50 cursor-not-allowed">
                        Próximamente
                    </button>
                </section>

                <section className="bg-card p-8 sm:p-12 rounded-3xl border border-border shadow-sm flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <span className="text-primary text-2xl font-bold">2</span>
                    </div>
                    <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Inscripciones</h2>
                    <p className="text-foreground/70 max-w-2xl mx-auto">
                        El formulario de inscripción y registro para la presente edición estará disponible pronto.
                    </p>
                    <button className="mt-8 px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium opacity-50 cursor-not-allowed">
                        Próximamente
                    </button>
                </section>
            </div>
        </div>
    );
}
