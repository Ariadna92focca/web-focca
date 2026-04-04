"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Bird, FileText, Users, Images, Link as LinkIcon } from "lucide-react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 relative">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">

                {/* Botón de Menú Móvil (Absoluto en la esquina en móvil) */}
                <div className="md:hidden absolute top-4 right-4 z-50">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2.5 bg-background border border-border shadow-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                <div className="flex flex-col items-center w-full">
                    {/* Cabecera de Logos (Agrupados y al centro) */}
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-10 lg:gap-16 w-full mb-6 pt-4 md:pt-0">

                        {/* Izquierda: FOCCA */}
                        <Link href="/" className="flex flex-row items-center justify-center sm:justify-start gap-4 group transition-transform hover:scale-[1.02] active:scale-95 text-left md:pr-4 sm:mr-8 md:mr-0">
                            <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-2xl overflow-hidden bg-white flex items-center justify-center border border-primary/20 shadow-sm shrink-0 transition-shadow group-hover:shadow-md">
                                <Image src="/assets/federacion/focca logo.png" alt="FOCCA Logo" fill className="object-contain p-1.5 lg:p-2" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-5xl tracking-tight text-foreground leading-none mb-1">FOCCA</span>
                                <span className="font-sans text-xs sm:text-sm lg:text-base font-bold text-primary max-w-[160px] sm:max-w-[200px] leading-tight">Federación Ornitológica Canario Ancestral</span>
                            </div>
                        </Link>

                        {/* Separador vertical en escritorio */}
                        <div className="hidden md:block w-px h-16 lg:h-24 bg-border/60"></div>

                        {/* Separador horizontal en móvil */}
                        <div className="md:hidden w-1/2 h-px bg-border/60"></div>

                        {/* Derecha: FOCDE */}
                        <div className="flex flex-row items-center justify-center sm:justify-end gap-4 group text-right md:pl-4 sm:ml-8 md:ml-0">
                            <div className="flex flex-col justify-center">
                                <span className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-5xl tracking-tight text-foreground leading-none mb-1">FOCDE</span>
                                <span className="font-sans text-xs sm:text-sm lg:text-base font-bold text-primary max-w-[140px] sm:max-w-[180px] leading-tight ml-auto">Federación Regional FOCDE</span>
                            </div>
                            <div className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-2xl overflow-hidden bg-white flex items-center justify-center border border-primary/20 shadow-sm shrink-0 transition-shadow">
                                <Image src="/assets/focde_com/FOCDE.jpg" alt="FOCDE Logo" fill className="object-contain p-1.5 lg:p-2" />
                            </div>
                        </div>

                    </div>

                    {/* Fila inferior de Nav (Desktop completo) */}
                    <nav className="hidden md:flex w-full justify-center items-center gap-6 lg:gap-10 xl:gap-14 border-t border-border/60 pt-5 pb-1">
                        <NavLinks />
                        <div className="h-6 w-px bg-border mx-2"></div>
                        <Link
                            href="/privado"
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-8 text-sm lg:text-base font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            Área Privada
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Menú Móvil Desplegable */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-xl py-6 px-6 flex flex-col gap-3">
                    <NavLinks mobile onClick={() => setIsOpen(false)} />
                    <div className="w-full h-px bg-border/50 my-2"></div>
                    <Link
                        href="/privado"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex h-12 w-full mt-2 items-center justify-center rounded-xl bg-primary px-6 text-base font-bold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        Área Privada
                    </Link>
                </div>
            )}
        </header>
    );
}

function NavLinks({ mobile, onClick }: { mobile?: boolean, onClick?: () => void }) {
    const links = [
        { name: "Inicio", href: "/" },
        { name: "Quiénes Somos", href: "/quienes-somos" },
        { name: "Junta", href: "/junta-directiva" },
        { name: "Asociaciones", href: "/asociaciones" },
        { name: "Normativa", href: "/normativa" },
        { name: "Contacto", href: "/contacto" },
    ];

    return (
        <>
            {links.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClick}
                    className={`font-semibold transition-colors hover:text-primary relative group ${mobile ? 'text-lg py-3 w-full text-center text-foreground/80' : 'text-sm lg:text-base text-foreground/75 hover:text-foreground'}`}
                >
                    {link.name}
                    {!mobile && (
                        <span className="absolute -bottom-1.5 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 rounded-full" />
                    )}
                </Link>
            ))}
        </>
    );
}
