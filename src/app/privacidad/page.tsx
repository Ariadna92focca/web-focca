export default function PrivacidadPage() {
    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Política de Privacidad
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl space-y-8 text-foreground/80 leading-relaxed text-lg">
                <p>
                    En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), se informa a los usuarios de lo siguiente:
                </p>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Responsable del tratamiento</h3>
                    <ul className="list-none space-y-2 bg-secondary/30 p-6 rounded-2xl border border-border">
                        <li><strong className="text-foreground">Entidad:</strong> Federación Ornitológica y Cultural Canario Ancestral</li>
                        <li><strong className="text-foreground">Dirección:</strong> Calle El Hoyo 14-A, 38614, Vilaflor de Chasna</li>
                        <li><strong className="text-foreground">Email:</strong> foycca@gmail.com</li>
                    </ul>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Datos que se recogen</h3>
                    <p>Este sitio web puede recoger los siguientes datos:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Datos identificativos de usuarios registrados (nombre, email, usuario).</li>
                        <li>Datos enviados mediante formularios de contacto o inscripción.</li>
                    </ul>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Finalidad del tratamiento</h3>
                    <p>Los datos se utilizan para:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Gestionar el acceso de usuarios autorizados.</li>
                        <li>Responder consultas enviadas mediante formularios.</li>
                        <li>Gestionar actividades, eventos o comunicaciones de la Federación.</li>
                    </ul>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Legitimación</h3>
                    <p>
                        La base legal es el consentimiento del usuario y el interés legítimo de la Federación para gestionar sus actividades.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Conservación de los datos</h3>
                    <p>
                        Los datos se conservarán mientras exista relación con el usuario o hasta que este solicite su supresión.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Cesión de datos</h3>
                    <p>
                        No se cederán datos a terceros salvo obligación legal.
                    </p>
                </div>

                <div className="space-y-3 mt-8">
                    <h3 className="font-heading font-bold text-2xl text-foreground">Derechos del usuario</h3>
                    <p>
                        Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad enviando un correo a:
                        <br />
                        <a href="mailto:foycca@gmail.com" className="inline-flex items-center gap-2 mt-2 font-medium text-primary hover:underline">
                            📩 foycca@gmail.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
