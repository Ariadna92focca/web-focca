"use client";

import { Download, FileText } from "lucide-react";

export default function NormativaPage() {
    const documents = [
        { title: "Estatutos FOCCA-FOCDE", desc: "Reglamento base de nuestra federación.", size: "813 KB", file: "/assets/normativas/20250823 Estatutos FOCCA-FOCDE.pdf" },
        { title: "Reglamento de Regimen Interno", desc: "Normas de funcionamiento interno.", size: "0.8 MB" },
        { title: "Reglamento Campeonato Ornitologico de Canarias", desc: "Normas de participación aplicables.", size: "1.2 MB", file: "/assets/normativas/Reglamento  COC.pdf" },
        { title: "Reglamento Liga Ornitologica Canaria Sansofe", desc: "Información y bases oficiales.", size: "886 KB", file: "/assets/normativas/Reglamento Liga Canaria Sansofe.pdf" },
        { title: "Normativa de Porteos de Aves", desc: "Directrices para el porteo de aves.", size: "652 KB", file: "/assets/normativas/Normativa Porteos.pdf" }
    ];

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
                {documents.map((doc, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-card rounded-2xl border border-border shadow-sm group hover:border-primary/50 transition-colors">
                        <div className="flex items-start gap-4 mb-4 sm:mb-0">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">{doc.title}</h3>
                                <p className="text-foreground/60 text-sm mt-1">{doc.desc}</p>
                                <span className="text-xs text-foreground/40 mt-2 block font-medium">PDF • {doc.size}</span>
                            </div>
                        </div>

                        <a
                            href={doc.file ? doc.file : "#"}
                            target={doc.file ? "_blank" : "_self"}
                            onClick={(e) => {
                                if (!doc.file) {
                                    e.preventDefault();
                                    alert("Próximamente");
                                }
                            }}
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-xl hover:bg-secondary/80 transition-colors shrink-0"
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
