import Image from "next/image";

export default function AsociacionesPage() {
    const asociaciones = [
        { name: "A.O. AviLancelot", province: "Lanzarote", image: "/assets/asociaciones/AO AviLancelot.jpg" },
        { name: "Costa Adeje", province: "Tenerife", image: "/assets/asociaciones/Costa Adeje.jpg" },
        { name: "La Aparcería", province: "Gran Canaria", image: "/assets/asociaciones/LA APARCERIA.JPG" },
        { name: "Maxorata", province: "Fuerteventura", image: "/assets/asociaciones/MAXORATA.jpg" },
        { name: "Tacuense", province: "Tenerife", image: "/assets/asociaciones/logo TACUENSE.jpeg" },
    ];

    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Nuestras Asociaciones
                    </h1>
                    <p className="text-foreground/70 text-lg">
                        Las asociaciones que conforman FOCCA-FOCDE son el motor de nuestra federación. Descubre las entidades que trabajan para promover la ornitología.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {asociaciones.map((asoc, idx) => (
                        <div key={idx} className="group relative flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm border border-border/60 hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="relative aspect-square bg-white w-full flex items-center justify-center p-6 border-b border-border/50">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={asoc.image}
                                        alt={asoc.name}
                                        fill
                                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                            <div className="p-6 text-center flex flex-col flex-grow">
                                <h3 className="font-heading font-bold text-lg text-foreground">{asoc.name}</h3>
                                <span className="text-sm font-medium text-primary mt-1 px-3 py-1 bg-primary/10 rounded-full w-fit mx-auto">
                                    {asoc.province}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
