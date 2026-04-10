import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-card border-t border-border mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    <div className="md:col-span-1 lg:col-span-1 space-y-4">
                        <h3 className="font-heading font-bold text-lg text-foreground">FOCCA-FOCDE</h3>
                        <p className="text-sm text-foreground/60 leading-relaxed">
                            Federación ornitológica y cultural canario ancestral, dedicada a la promoción, preservación y disfrute de la ornitología.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm text-foreground/60">
                            <li><Link href="/quienes-somos" className="hover:text-primary transition-colors">Quiénes Somos</Link></li>
                            <li><Link href="/asociaciones" className="hover:text-primary transition-colors">Asociaciones</Link></li>
                            <li><Link href="/normativa" className="hover:text-primary transition-colors">Normativa</Link></li>
                            <li><Link href="/concursos" className="hover:text-primary transition-colors">Concursos</Link></li>
                            <li><Link href="/liga-sansofe" className="hover:text-primary transition-colors">Liga Sansofé</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Recursos</h4>
                        <ul className="space-y-2 text-sm text-foreground/60">
                            <li><Link href="/impresos" className="hover:text-primary transition-colors">Impresos</Link></li>
                            <li><Link href="/noticias" className="hover:text-primary transition-colors">Noticias</Link></li>
                            <li><Link href="/galeria" className="hover:text-primary transition-colors">Galería</Link></li>
                            <li><Link href="https://www.focde.com/jueces" target="_blank" className="hover:text-primary transition-colors">Jueces FOCDE</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Enlaces Externos</h4>
                        <ul className="space-y-2 text-sm text-foreground/60">
                            <li><a href="https://www.focde.com/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">FOCDE</a></li>
                            <li><a href="https://conforni.org/en" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">COM</a></li>
                            <li><a href="https://comesp.es/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">COMESP</a></li>
                            <li><a href="https://www.focde.com/revista-pajaros/sumarios-revista" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Revista Pájaros</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Contacto</h4>
                        <ul className="space-y-3 text-sm text-foreground/60">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>Calle el hoyo 14-A, Vilaflor de Chasna 38614</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                <a href="mailto:foycca@gmail.com" className="hover:text-primary transition-colors">foycca@gmail.com</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                <span>+34 607302585</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-foreground/50">
                        &copy; {new Date().getFullYear()} FOCCA-FOCDE. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-4 text-sm text-foreground/50">
                        <Link href="/aviso-legal" className="hover:text-foreground transition-colors">Aviso Legal</Link>
                        <Link href="/privacidad" className="hover:text-foreground transition-colors">Política de Privacidad</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
