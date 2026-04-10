import { Calendar, MapPin } from "lucide-react";

export default function ConcursosPage() {
    const concursos = [
        { name: "VII Concurso Ornitológico Regional", date: "15-20 Noviembre, 2026", loc: "Pabellón Central", status: "Próximo" },
        { name: "Liga Canaria SANSOFÉ 2026", date: "Octubre - Diciembre, 2026", loc: "Sedes Múltiples", status: "En curso" }
    ];

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

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-5xl space-y-6">
                {concursos.map((c, idx) => (
                    <div key={idx} className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-primary/50 transition-colors">
                        <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                                {c.status}
                            </div>
                            <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{c.name}</h3>
                            <div className="flex flex-col sm:flex-row gap-4 text-sm text-foreground/60">
                                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {c.date}</span>
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {c.loc}</span>
                            </div>
                        </div>
                        <button className="px-6 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors w-full md:w-auto">
                            Ver Bases
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
