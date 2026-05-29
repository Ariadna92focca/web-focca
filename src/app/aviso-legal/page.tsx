export default function AvisoLegalPage() {
    return (
        <div className="w-full flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
            {/* Soft Green Banner Header */}
            <div className="bg-primary/5 border-b border-border/80 py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
                        Legal
                    </span>
                    <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                        Aviso Legal
                    </h1>
                    <p className="text-foreground/60 text-base mt-2">
                        Términos de uso y condiciones generales del portal federativo.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl space-y-8 text-foreground/80 leading-relaxed text-base sm:text-lg">
                <p>
                    En cumplimiento de lo dispuesto en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI‑CE), se informa que el presente sitio web es de titularidad oficial de la Federación:
                </p>

                <ul className="list-none space-y-3 bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border/60 shadow-sm">
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <strong className="text-foreground min-w-[120px] shrink-0">Titular:</strong> 
                        <span className="text-foreground/70">Federación Ornitológica y Cultural Canario Ancestral</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <strong className="text-foreground min-w-[120px] shrink-0">NIF:</strong> 
                        <span className="text-foreground/70 font-mono font-semibold">G72431034</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                        <strong className="text-foreground min-w-[120px] shrink-0">Dirección:</strong> 
                        <span className="text-foreground/70">Calle El Hoyo 14-A, 38614, Vilaflor de Chasna, Santa Cruz de Tenerife</span>
                    </li>
                    <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <strong className="text-foreground min-w-[120px] shrink-0">Email de contacto:</strong> 
                        <a href="mailto:foycca@gmail.com" className="text-primary hover:underline font-medium">foycca@gmail.com</a>
                    </li>
                </ul>

                <p>
                    La Federación Ornitológica y Cultural Canario Ancestral (en adelante, &quot;la Federación&quot;) es una entidad asociativa sin ánimo de lucro dedicada en exclusiva a la promoción, conservación, cría controlada y divulgación de la ornitología y la preservación de la cultura canaria ancestral ligada al mundo de las aves.
                </p>
                <p>
                    El acceso y uso de este sitio web atribuye de manera inmediata la condición de usuario e implica la aceptación plena, consciente y sin reservas de cada una de las condiciones generales aquí expuestas.
                </p>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        Propiedad intelectual y derechos
                    </h3>
                    <p className="text-sm sm:text-base">
                        Todos los contenidos que integran este sitio web (incluyendo a título enunciativo pero no limitativo: textos, artículos de boletín, fotografías de directivos, logotipos de asociaciones afiliadas, elementos vectoriales, audios y diseño visual general de la interfaz) son propiedad intelectual exclusiva de la Federación o disponen de las correspondientes licencias de uso. Queda terminantemente prohibida su copia, distribución o alteración comercial sin autorización expresa y por escrito de la junta directiva.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        Exclusión de responsabilidades
                    </h3>
                    <p className="text-sm sm:text-base">
                        La Federación trabaja con el máximo rigor para asegurar la veracidad de los datos mostrados (como la clasificación de la Liga Canaria Sansofé o los boletines de normativa), no obstante, no asume responsabilidad alguna por posibles errores tipográficos involuntarios o por el mal uso técnico y de acceso que los usuarios realicen del área privada.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-foreground flex items-center gap-2 border-b border-border/40 pb-2">
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                        Enlaces externos e hipervínculos
                    </h3>
                    <p className="text-sm sm:text-base">
                        Este portal puede contener hipervínculos a páginas de terceros (como confederaciones nacionales o patrocinadores oficiales). Dado que no poseemos el control sobre los contenidos de dichos sitios, la Federación declina cualquier responsabilidad por daños derivados del acceso o uso de páginas externas ajenas a nuestro dominio federativo.
                    </p>
                </div>
            </div>
        </div>
    );
}
