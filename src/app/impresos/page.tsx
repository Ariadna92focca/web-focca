import { Download, FileDown } from "lucide-react";

export default function ImpresosPage() {
    const forms = [
        { title: "Solicitud de Anillas", desc: "Formulario oficial para la petición de anillas.", size: "0.5 MB" },
        { title: "Inscripción en Concurso", desc: "Formato para registrar ejemplares en eventos.", size: "0.4 MB" },
        { title: "Alta Nueva Asociación", desc: "Requisitos y formulario de federación.", size: "1.1 MB" },
    ];

    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Impresos y Formularios
                    </h1>
                    <p className="text-foreground/70 text-lg">
                        Descarga los formularios administrativos y oficiales necesarios para los trámites con FOCCA-FOCDE.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-4xl space-y-6">
                {forms.map((form, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-card rounded-2xl border border-border shadow-sm group hover:border-primary/50 transition-colors">
                        <div className="flex items-start gap-4 mb-4 sm:mb-0">
                            <div className="p-3 bg-secondary rounded-xl text-primary shrink-0">
                                <FileDown className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">{form.title}</h3>
                                <p className="text-foreground/60 text-sm mt-1">{form.desc}</p>
                                <span className="text-xs text-foreground/40 mt-2 block font-medium">PDF • {form.size}</span>
                            </div>
                        </div>

                        <a
                            href="#"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shrink-0 shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Descargar
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
