import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-card border-t border-border mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1 space-y-4">
                        <h3 className="font-heading font-bold text-lg text-foreground">FOCCA-FOCDE</h3>
                        <p className="text-sm text-foreground/60 leading-relaxed">
                            Federación Ornitológica Cultural y Deportiva, dedicada a la promoción, preservación y disfrute de la ornitología.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Enlaces Rápidos</h4>
                        <ul className="space-y-2 text-sm text-foreground/60">
                            <li><Link href="/quienes-somos" className="hover:text-primary transition-colors">Quiénes Somos</Link></li>
                            <li><Link href="/asociaciones" className="hover:text-primary transition-colors">Asociaciones</Link></li>
                            <li><Link href="/normativa" className="hover:text-primary transition-colors">Normativa</Link></li>
                            <li><Link href="/concursos" className="hover:text-primary transition-colors">Concursos</Link></li>
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
                        <h4 className="font-heading font-semibold mb-4 text-foreground">Contacto</h4>
                        <ul className="space-y-3 text-sm text-foreground/60">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <span>Sede Central FOCCA-FOCDE</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                <a href="mailto:info@focca-focde.com" className="hover:text-primary transition-colors">info@focca-focde.com</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                <span>+34 000 000 000</span>
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
