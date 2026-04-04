import { UserCircle } from "lucide-react";

export default function JuntaDirectivaPage() {
    const comiteEjecutivo = [
        { name: "D. Abel Tomás Herrera Hernandez", role: "Presidente" },
        { name: "D. Jose Juan León Diaz", role: "Vicepresidente" },
        { name: "D. Pablo Alexis Ramirez Gonzalez", role: "Secretario" },
        { name: "D. Jose Francisco Herrera Hernandez", role: "Tesorero" },
    ];

    const juntaDirectiva = [
        ...comiteEjecutivo,
        { name: "D. Antonio Castellano Dominguez", role: "Presidente Avilancelot" },
        { name: "D. Marcos Cazorla Sanchez", role: "Presidente La Aparcería de Vecindario" },
        { name: "D. Pedro Rivero Reyes", role: "Presidente Maxorata" },
        { name: "D. Juan Manuel León Barreto", role: "Representante Tacuense" },
        { name: "Da. Ariadna V. Herrera Medina", role: "Representante de Costa Adeje" },
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

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
                {/* Sección Comité Ejecutivo */}
                <div className="mb-20">
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="font-heading text-3xl font-bold text-foreground inline-block relative">
                            Comité Ejecutivo
                            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"></span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {comiteEjecutivo.map((member, idx) => (
                            <MemberCard key={idx} member={member} isExec={true} />
                        ))}
                    </div>
                </div>

                {/* Sección Junta Directiva Completa */}
                <div>
                    <div className="flex flex-col items-center mb-12">
                        <h2 className="font-heading text-3xl font-bold text-foreground inline-block relative">
                            Junta Directiva
                            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full"></span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 align-top">
                        {juntaDirectiva.map((member, idx) => (
                            <MemberCard key={idx} member={member} isExec={false} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function MemberCard({ member, isExec }: { member: any, isExec: boolean }) {
    return (
        <div className={`flex flex-col items-center bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm text-center h-full transition-all hover:border-primary/30 hover:shadow-md ${isExec ? 'bg-primary/5 border-primary/20' : ''}`}>
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-5 text-primary shrink-0">
                <UserCircle className="w-10 h-10" />
            </div>
            <h3 className="font-heading font-bold text-lg md:text-xl text-foreground mb-2 leading-tight">{member.name}</h3>
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">{member.role}</span>
        </div>
    );
}
