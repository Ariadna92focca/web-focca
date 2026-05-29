export default function PrivacidadPage() {
    return (
        <div className="w-full flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
            {/* Soft Green Banner Header */}
            <div className="bg-primary/5 border-b border-border/80 py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
                        RGPD Compliance
                    </span>
                    <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                        Política de Privacidad
                    </h1>
                    <p className="text-foreground/60 text-base mt-2">
                        Transparencia en el tratamiento y protección de sus datos personales.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl space-y-8 text-foreground/80 leading-relaxed text-base sm:text-lg">
                <p>
                    En cumplimiento de lo establecido en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD) y en la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y Garantía de los Derechos Digitales (LOPDGDD), le informamos rigurosamente de los siguientes términos:
                </p>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        Responsable del tratamiento de datos
                    </h3>
                    <ul className="list-none space-y-2 bg-white dark:bg-card p-6 rounded-3xl border border-border/60 shadow-sm mt-4">
                        <li><strong className="text-foreground">Razón Social:</strong> Federación Ornitológica y Cultural Canario Ancestral</li>
                        <li><strong className="text-foreground">NIF Oficial:</strong> G72431034</li>
                        <li><strong className="text-foreground">Domicilio Social:</strong> Calle El Hoyo 14-A, 38614, Vilaflor de Chasna, Santa Cruz de Tenerife</li>
                        <li><strong className="text-foreground">Email de contacto:</strong> <a href="mailto:foycca@gmail.com" className="text-primary hover:underline font-medium">foycca@gmail.com</a></li>
                    </ul>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        Datos de carácter personal recopilados
                    </h3>
                    <p className="text-sm sm:text-base">
                        Este sitio web recoge exclusivamente la información indispensable para garantizar el servicio federado y el canal de comunicación:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                        <li><strong className="text-foreground">Formulario de Contacto:</strong> Nombre completo, correo electrónico, asunto y el cuerpo del mensaje redactado para atender consultas de forma directa.</li>
                        <li><strong className="text-foreground">Área Privada de Gestión:</strong> Datos de acceso técnicos para asociaciones y administración (correo, contraseña encriptada) y la lista de afiliados inscritos por cada club ornitológico.</li>
                    </ul>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        Finalidad de la recogida de datos
                    </h3>
                    <p className="text-sm sm:text-base">Los datos personales procesados se destinan únicamente a:</p>
                    <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                        <li>Gestionar el sistema de anillas anual, altas y bajas en las bases oficiales federativas.</li>
                        <li>Dar respuesta y resolución a los mensajes de consulta enviados por la ciudadanía a través del formulario oficial de contacto.</li>
                        <li>Garantizar el correcto funcionamiento de los eventos deportivos ornitológicos y la Liga Canaria Sansofé.</li>
                    </ul>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        Legitimación jurídica del tratamiento
                    </h3>
                    <p className="text-sm sm:text-base">
                        La base legal en la que se sustenta el tratamiento de sus datos es:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                        <li>El <strong className="text-foreground">consentimiento expreso</strong> del interesado al remitir un formulario o consulta.</li>
                        <li>La <strong className="text-foreground">relación asociativa/contractual</strong> legítima que une a cada asociación miembro y a sus criadores con esta Federación.</li>
                    </ul>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        Plazo de conservación de la información
                    </h3>
                    <p className="text-sm sm:text-base">
                        Los datos se conservarán mientras dure la afiliación de la asociación a la Federación, hasta que el interesado ejerza de forma expresa su derecho de supresión, o durante el tiempo estrictamente exigido por las leyes aplicables en materia de auditoría o requerimientos oficiales.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        Seguridad y cesiones
                    </h3>
                    <p className="text-sm sm:text-base">
                        Bajo ningún concepto se alquilará, venderá o cederá su información de carácter personal a terceras empresas o entidades externas ajenas a la federación, salvo imperativo legal o requerimiento expreso del ministerio fiscal o jueces y tribunales competentes.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        Sus derechos como usuario
                    </h3>
                    <p className="text-sm sm:text-base">
                        Usted ostenta el pleno derecho a acceder, rectificar, limitar, solicitar la portabilidad y exigir de forma definitiva la supresión total de sus datos personales. Para ejercer estos derechos reconocidos por el reglamento europeo, basta con remitir un correo electrónico firmado y detallando su solicitud a la secretaría oficial:
                        <br />
                        <a href="mailto:foycca@gmail.com" className="inline-flex items-center gap-2 mt-3 font-semibold text-primary hover:underline">
                            📩 foycca@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
