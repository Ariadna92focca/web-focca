export default function AvisoLegalPage() {
    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Aviso Legal
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl space-y-8 text-foreground/80 leading-relaxed text-lg">
                <p>
                    En cumplimiento de lo dispuesto en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI‑CE), se informa que el presente sitio web es titularidad de:
                </p>

                <ul className="list-none space-y-3 bg-secondary/30 p-6 rounded-2xl border border-border">
                    <li><strong className="text-foreground">Titular:</strong> Federación Ornitológica y Cultural Canario Ancestral</li>
                    <li><strong className="text-foreground">NIF:</strong> (pendiente de facilitar)</li>
                    <li><strong className="text-foreground">Dirección:</strong> Calle El Hoyo 14-A, 38614, Vilaflor de Chasna, Santa Cruz de Tenerife</li>
                    <li><strong className="text-foreground">Email de contacto:</strong> foycca@gmail.com</li>
                </ul>

                <p>
                    La Federación Ornitológica y Cultural Canario Ancestral (en adelante, &quot;la Federación&quot;) es una entidad sin ánimo de lucro dedicada a la promoción, conservación y divulgación de la ornitología y la cultura canaria ancestral.
                </p>
                <p>
                    El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación plena de las condiciones aquí expuestas.
                </p>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Propiedad intelectual</h3>
                    <p>
                        Todos los contenidos del sitio web (textos, imágenes, logotipos, etc.) pertenecen a la Federación o a sus autores legítimos. Queda prohibida su reproducción sin autorización expresa.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Responsabilidad del contenido</h3>
                    <p>
                        La Federación no se hace responsable del mal uso que puedan hacer los usuarios del sitio web.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Enlaces externos</h3>
                    <p>
                        Este sitio puede incluir enlaces a páginas de terceros. La Federación no se responsabiliza del contenido de dichas páginas.
                    </p>
                </div>
            </div>
        </div>
    );
}
