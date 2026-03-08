"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Bird, FileText, Users, Images, Link as LinkIcon } from "lucide-react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex gap-2 items-center">
                    <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
                        <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                            {/* Replace with actual FOCCA logo from public/assets */}
                            <Image src="/assets/federacion/focca logo.png" alt="FOCCA Logo" fill className="object-cover p-1" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-heading font-bold text-xl tracking-tight text-foreground leading-none">FOCCA</span>
                            <span className="font-sans text-xs font-semibold text-primary tracking-widest mt-1">FOCDE</span>
                        </div>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <NavLinks />
                    <div className="h-6 w-px bg-border mx-2"></div>
                    <Link
                        href="/privado"
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        Área Privada
                    </Link>
                </nav>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2 text-foreground/70 hover:text-foreground"
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Nav Overlay */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border shadow-lg py-4 px-6 flex flex-col gap-4">
                    <NavLinks mobile onClick={() => setIsOpen(false)} />
                    <Link
                        href="/privado"
                        onClick={() => setIsOpen(false)}
                        className="inline-flex h-12 w-full mt-2 items-center justify-center rounded-xl bg-primary px-6 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
                    className={`font-medium text-foreground/70 transition-colors hover:text-primary relative group ${mobile ? 'text-lg py-3 border-b border-border/50' : 'text-sm py-2'}`}
                >
                    {link.name}
                    {!mobile && (
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full opacity-0 group-hover:opacity-100 rounded-full" />
                    )}
                </Link>
            ))}
        </>
    );
}
