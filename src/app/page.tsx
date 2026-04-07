import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, Users, Building, ChevronRight, Newspaper } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/federacion/cabeceraFOCCA.PNG"
            alt="FOCCA-FOCDE Event"
            fill
            className="object-cover object-top md:object-[center_15%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/50 to-transparent dark:from-background/80 dark:via-background/60" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="max-w-2xl flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-xs font-semibold tracking-wide uppercase">Federación Ornitológica</span>
            </div>

            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight">
              Cultura y <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Deporte Ornitológico</span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed max-w-xl">
              Bienvenidos a la plataforma oficial de FOCCA-FOCDE. Promoviendo la excelencia, preservación y educación en la crianza y cuidado de aves a nivel federativo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link
                href="/asociaciones"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95"
              >
                Conocer Asociaciones
              </Link>
              <Link
                href="/normativa"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-secondary px-8 text-base font-medium text-secondary-foreground shadow-sm transition-all hover:bg-secondary/80 hover:scale-[1.02] active:scale-95 border border-border"
              >
                Ver Normativa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Acceso Rápido</h2>
            <div className="h-1.5 w-12 bg-primary rounded-full mb-6"></div>
            <p className="text-foreground/60 max-w-2xl text-lg">
              Accede directamente a los apartados más importantes de nuestra institución, diseñados para facilitar la gestión e información de nuestras asociaciones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickLinkCard
              icon={<Building className="w-8 h-8" />}
              title="Quiénes Somos"
              description="Conoce la historia, misión y objetivos de nuestra federación."
              href="/quienes-somos"
            />
            <QuickLinkCard
              icon={<Users className="w-8 h-8" />}
              title="Asociaciones"
              description="Listado completo de asociaciones afiliadas a FOCCA-FOCDE."
              href="/asociaciones"
            />
            <QuickLinkCard
              icon={<FileText className="w-8 h-8" />}
              title="Trámites e Impresos"
              description="Descarga de formularios oficiales y peticiones."
              href="/impresos"
            />
            <QuickLinkCard
              icon={<Newspaper className="w-8 h-8" />}
              title="Últimas Noticias"
              description="Mantente al día con los eventos y novedades."
              href="/noticias"
            />
          </div>
        </div>
      </section>

      {/* Highlight/Featured Section */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/assets/federacion/FOCCA.JPG"
                alt="FOCCA Event"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl"></div>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Comprometidos con la <br />
                <span className="text-primary text-4xl md:text-5xl">Excelencia Ornitológica</span>
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Nuestra federación trabaja incansablemente para proporcionar a todas las asociaciones los recursos, normativas y el marco organizativo necesario para el desarrollo de la ornitología deportiva y cultural al más alto nivel.
              </p>

              <ul className="space-y-4 mt-4">
                {[
                  "Asesoramiento técnico y administrativo continuo.",
                  "Organización de concursos de ámbito regional y nacional.",
                  "Facilitación de trámites como peticiones de anillas."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-6 border-t border-border">
                <Link href="/quienes-somos" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors group">
                  Descubre nuestra historia
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickLinkCard({ icon, title, description, href }: { icon: React.ReactNode, title: string, description: string, href: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col p-8 rounded-2xl bg-background border border-border/50 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20"
    >
      <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="font-heading font-bold text-xl text-foreground mb-3">{title}</h3>
      <p className="text-sm text-foreground/60 leading-relaxed group-hover:text-foreground/80">{description}</p>

      <div className="mt-auto pt-6 flex items-center text-sm font-medium text-primary opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0">
        Ver más <ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </Link>
  );
}
