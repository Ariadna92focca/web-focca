import { Send, MapPin, Phone, Mail } from "lucide-react";

export default function ContactoPage() {
    return (
        <div className="w-full flex inset-0 flex-col">
            <div className="bg-primary/5 border-b border-border py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Contacto
                    </h1>
                    <p className="text-foreground/70 text-lg">
                        ¿Tienes alguna duda o consulta? Ponte en contacto con la directiva de la federación.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="flex flex-col gap-8">
                        <h2 className="font-heading text-3xl font-bold text-foreground">Información de Contacto</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Estamos a su entera disposición para cualquier aclaración o trámite federativo. Utilice el formulario de la derecha o contáctenos por los siguientes medios oficiales.
                        </p>

                        <div className="space-y-6 mt-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">Dirección Postal</h4>
                                    <p className="text-foreground/60 text-sm">Calle el hoyo 14-A. Vilaflor de Chasna 38614</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">Correo Electrónico</h4>
                                    <a href="mailto:foycca@gmail.com" className="text-primary hover:underline text-sm font-medium">foycca@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">Teléfono</h4>
                                    <p className="text-foreground/60 text-sm">+34 607302585</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card p-8 sm:p-10 rounded-3xl shadow-sm border border-border">
                        <h3 className="font-heading text-2xl font-bold text-foreground mb-6">Envíenos un mensaje</h3>
                        <form className="space-y-6 flex flex-col">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Nombre Completo</label>
                                <input
                                    type="text"
                                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Asunto</label>
                                <input
                                    type="text"
                                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                                    placeholder="Motivo de la consulta"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">Mensaje</label>
                                <textarea
                                    rows={4}
                                    className="w-full bg-background border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
                                    placeholder="Escriba su mensaje aquí..."
                                ></textarea>
                            </div>

                            <button
                                type="button"
                                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 mt-4 self-start"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
