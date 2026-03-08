import { ExternalLink } from "lucide-react";

export default function EnlacesPage() {
    const links = [
        { title: "FOCDE Original", url: "https://www.focde.com", desc: "Sitio web de la Federación Ornitológica Cultural Deportiva Española." },
        { title: "COM España", url: "https://www.com-espana.org", desc: "Confederación Ornitológica Mundial - España." },
        { title: "Consulta de Jueces", url: "https://www.focde.com/jueces", desc: "Listado oficial de jueces ornitológicos." },
        { title: "Gestión de Concursos", url: "#", desc: "Plataforma administrativa para la gestión integral de concursos y exposiciones." },
    ];

    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Enlaces de Interés</h1>
                    <p className="text-foreground/70 text-lg">
                        Directorio de sitios web y recursos externos recomendados.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {links.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col p-8 bg-card border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors">{link.title}</h3>
                                <ExternalLink className="w-5 h-5 text-foreground/40 group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-foreground/60 text-sm leading-relaxed">{link.desc}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
