import { UserCircle } from "lucide-react";

export default function JuntaDirectivaPage() {
    const members = [
        { name: "Juan Pérez", role: "Presidente", asoc: "A.O. Sur" },
        { name: "María Gómez", role: "Vicepresidenta", asoc: "Costa Adeje" },
        { name: "Carlos Díaz", role: "Secretario", asoc: "A.O. AviLancelot" },
        { name: "Ana Ruiz", role: "Tesorera", asoc: "Maxorata" },
        { name: "Luis Martín", role: "Vocal", asoc: "Pinzón" },
    ];

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

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {members.map((member, idx) => (
                        <div key={idx} className="flex flex-col items-center bg-card p-8 rounded-3xl border border-border shadow-sm text-center">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
                                <UserCircle className="w-12 h-12" />
                            </div>
                            <h3 className="font-heading font-bold text-xl text-foreground mb-1">{member.name}</h3>
                            <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">{member.role}</span>
                            <p className="text-foreground/60 text-sm">Asociación: <span className="text-foreground font-medium">{member.asoc}</span></p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
