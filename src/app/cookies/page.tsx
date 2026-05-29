export default function CookiesPage() {
    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Política de Cookies
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl space-y-8 text-foreground/80 leading-relaxed text-lg">
                <p>
                    En cumplimiento con lo establecido en el artículo 22.2 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), esta política explica qué son las cookies y cómo las utilizamos en el sitio web de la <strong>Federación Ornitológica y Cultural Canario Ancestral</strong>.
                </p>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">¿Qué son las cookies?</h3>
                    <p>
                        Las cookies y tecnologías similares de almacenamiento local (como localStorage) son pequeños ficheros de datos que se descargan en tu dispositivo (ordenador, tablet o teléfono móvil) al acceder a determinadas páginas web. Su función principal es permitir que la página web funcione correctamente y recordar las preferencias del usuario.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Tipos de cookies que utilizamos</h3>
                    <p>
                        Este sitio web <strong>únicamente utiliza cookies y tecnologías de almacenamiento local de tipo técnico y estrictamente necesarias</strong>. 
                        No utilizamos cookies de análisis, publicitarias ni de seguimiento de terceros.
                    </p>
                    
                    <ul className="list-none space-y-4 bg-secondary/30 p-6 rounded-2xl border border-border mt-4">
                        <li>
                            <strong className="text-foreground text-base">Autenticación (Estrictamente necesaria)</strong>
                            <p className="text-sm mt-1">Utilizamos el almacenamiento local del navegador (`localStorage`) para mantener la sesión abierta una vez que los usuarios autorizados (asociaciones y administradores) inician sesión en el área privada. Sin esta tecnología, el área privada no podría funcionar.</p>
                        </li>
                        <div className="h-px w-full bg-border/50"></div>
                        <li>
                            <strong className="text-foreground text-base">Preferencias de Interfaz (Estrictamente necesaria)</strong>
                            <p className="text-sm mt-1">Se almacena la preferencia del usuario sobre el tema visual de la web (modo claro o modo oscuro) para que al navegar entre páginas o recargar, la interfaz mantenga la configuración elegida.</p>
                        </li>
                    </ul>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Exención de consentimiento</h3>
                    <p>
                        Al tratarse exclusivamente de cookies técnicas estrictamente necesarias para la prestación del servicio explícitamente solicitado por el usuario (acceder a su cuenta y mantener sus preferencias de visualización), <strong>estamos exentos de la obligación de obtener el consentimiento previo</strong> mediante un banner de cookies, tal y como establece la normativa vigente.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Cómo deshabilitarlas</h3>
                    <p>
                        Aunque no requieren de tu consentimiento para ser instaladas, puedes restringir, bloquear o borrar el almacenamiento local desde la configuración de tu navegador. Debes tener en cuenta que, si lo haces, no podrás iniciar sesión en el área privada ni mantener guardado el modo oscuro/claro.
                    </p>
                </div>

                <div className="space-y-3 mt-8 border-t border-border pt-8">
                    <p className="text-base text-foreground/60">
                        Si tienes alguna duda sobre esta política, puedes contactarnos en: 
                        <a href="mailto:foycca@gmail.com" className="font-medium text-primary hover:underline ml-1">
                            foycca@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
