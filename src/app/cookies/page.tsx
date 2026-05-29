export default function CookiesPage() {
    return (
        <div className="w-full flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
            {/* Soft Green Banner Header */}
            <div className="bg-primary/5 border-b border-border/80 py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
                        Cookies Regulation
                    </span>
                    <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                        Política de Cookies
                    </h1>
                    <p className="text-foreground/60 text-base mt-2">
                        Información clara y transparente sobre el almacenamiento local técnico.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl space-y-8 text-foreground/80 leading-relaxed text-base sm:text-lg">
                <p>
                    En cumplimiento con lo establecido en el artículo 22.2 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y del Comercio Electrónico (LSSI-CE), esta política detalla rigurosamente qué es el almacenamiento local y cómo se utiliza en el sitio web de la <strong>Federación Ornitológica y Cultural Canario Ancestral (NIF: G72431034)</strong>.
                </p>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        ¿Qué es una cookie o almacenamiento técnico?
                    </h3>
                    <p className="text-sm sm:text-base">
                        Las cookies y las tecnologías similares de almacenamiento local (como `localStorage` y `sessionStorage`) son pequeños ficheros o fragmentos de datos que un sitio web almacena de forma segura en su dispositivo (ordenador, tablet o teléfono móvil) a través de su navegador web. Sirven para recordar configuraciones básicas y garantizar el correcto funcionamiento del portal.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        Tecnologías técnicas utilizadas en este sitio web
                    </h3>
                    <p className="text-sm sm:text-base">
                        Este portal federativo se rige por un principio estricto de privacidad: <strong>únicamente utiliza almacenamiento local de tipo técnico y estrictamente necesario para la prestación del servicio</strong>. No implementamos ningún tipo de analítica invasiva de comportamiento, cookies publicitarias, píxeles de rastreo ni servicios de seguimiento de terceras empresas.
                    </p>
                    
                    <ul className="list-none space-y-4 bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border/60 shadow-sm mt-4">
                        <li>
                            <strong className="text-foreground text-base sm:text-lg flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                Autenticación y Control de Sesión
                            </strong>
                            <p className="text-xs sm:text-sm mt-1 text-foreground/70">
                                Utilizamos el almacenamiento de sesión local del navegador (`localStorage`) para sostener de forma segura la sesión abierta de las asociaciones federadas y los administradores autorizados una vez que acceden a `/privado`. Esta información es técnica y temporal; sin ella, resultaría imposible ofrecer acceso al área de gestión.
                            </p>
                        </li>
                        <div className="h-px w-full bg-border/50"></div>
                        <li>
                            <strong className="text-foreground text-base sm:text-lg flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                                Configuración de Tema Visual (Modo Claro / Oscuro)
                            </strong>
                            <p className="text-xs sm:text-sm mt-1 text-foreground/70">
                                Se almacena un parámetro simple (`theme`) que recuerda si usted prefiere visualizar la web en modo oscuro o modo claro. Esto evita que la pantalla parpadee de color blanco cada vez que accede a una nueva página del portal.
                            </p>
                        </li>
                    </ul>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        Exención legal de consentimiento previo
                    </h3>
                    <p className="text-sm sm:text-base">
                        Al limitarse nuestro portal exclusivamente a almacenar datos de tipo técnico y estrictamente indispensables para proveer las características expresamente demandadas por el usuario (autenticarse en el área privada y persistir su elección de contraste visual), **el sitio web se encuentra exento de la obligación de recabar su consentimiento previo o mostrar molestos banners informativos**, conforme a las directrices establecidas por la Agencia Española de Protección de Datos (AEPD).
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        ¿Cómo puede eliminar esta información?
                    </h3>
                    <p className="text-sm sm:text-base">
                        Aunque estas herramientas técnicas no requieren de consentimiento para ser habilitadas, usted puede configurar en todo momento su navegador web para bloquear o limpiar de forma definitiva el almacenamiento local. Debe tomar en consideración que, de optar por esta configuración restrictiva, no le será posible iniciar sesión en el área de gestión privada ni guardar la preferencia de color.
                    </p>
                </div>

                <div className="space-y-3 mt-8 border-t border-border pt-8 text-center sm:text-left">
                    <p className="text-sm sm:text-base text-foreground/60">
                        Para cualquier duda acerca de nuestra política técnica, puede contactarnos en: 
                        <a href="mailto:foycca@gmail.com" className="font-bold text-primary hover:underline ml-1">
                            foycca@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
