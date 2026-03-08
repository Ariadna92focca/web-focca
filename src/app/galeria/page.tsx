import Image from "next/image";

export default function GaleriaPage() {
    const images = [
        "/assets/federacion/FOCCA.JPG",
        "/assets/federacion/RYQV6148.JPG",
        "/assets/asociaciones/AO AviLancelot.jpg",
        "/assets/asociaciones/AOSUR.JPG",
        "/assets/asociaciones/Costa Adeje.jpg",
        "/assets/asociaciones/MAXORATA.jpg",
    ];

    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">Galería Multimedia</h1>
                    <p className="text-foreground/70 text-lg">
                        Imágenes destacadas de nuestros eventos, concursos y asociaciones.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {images.map((src, idx) => (
                        <div key={idx} className="relative aspect-square border border-border/50 rounded-2xl overflow-hidden bg-white shadow-sm group">
                            <Image
                                src={src}
                                alt={`Galería ${idx + 1}`}
                                fill
                                className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
