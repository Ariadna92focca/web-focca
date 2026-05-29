"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Send, MapPin, Phone, Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactoPage() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [asunto, setAsunto] = useState("");
    const [mensaje, setMensaje] = useState("");
    
    const [submitting, setSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre || !email || !asunto || !mensaje) {
            setStatusMessage({ type: "error", text: "Por favor, rellene todos los campos obligatorios del formulario." });
            return;
        }
        
        try {
            setSubmitting(true);
            setStatusMessage({ type: "", text: "" });
            
            const { error } = await supabase
                .from("mensajes_contacto")
                .insert({
                    nombre,
                    email,
                    asunto,
                    mensaje
                });
                
            if (error) throw error;
            
            setStatusMessage({ type: "success", text: "¡Mensaje enviado con éxito! Nos pondremos en contacto con usted a la mayor brevedad posible." });
            setNombre("");
            setEmail("");
            setAsunto("");
            setMensaje("");
            
            // Clear message after 5 seconds
            setTimeout(() => setStatusMessage({ type: "", text: "" }), 5000);
            
        } catch (err: any) {
            console.error("Error sending contact message:", err);
            setStatusMessage({ type: "error", text: "Ocurrió un error inesperado al enviar el mensaje. Por favor, inténtelo de nuevo más tarde." });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
            {/* Elegant Soft Green Banner Header */}
            <div className="bg-primary/5 border-b border-border py-16 sm:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mb-3">
                        Contacto Directo
                    </span>
                    <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                        Contacto Oficial
                    </h1>
                    <p className="text-foreground/70 text-base sm:text-lg mt-2">
                        ¿Tiene alguna duda, consulta o trámite federativo? Póngase en contacto con nosotros.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Information Column */}
                    <div className="flex flex-col gap-8">
                        <h2 className="font-heading text-3xl font-extrabold text-foreground">Información de Contacto</h2>
                        <p className="text-foreground/70 leading-relaxed text-base sm:text-lg">
                            Estamos a su entera disposición para cualquier aclaración o trámite federativo. Utilice el formulario de la derecha o contáctenos por los siguientes medios oficiales.
                        </p>

                        <div className="space-y-6 mt-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">Dirección Postal</h4>
                                    <p className="text-foreground/60 text-sm">Calle el Hoyo 14-A. Vilaflor de Chasna 38614, Santa Cruz de Tenerife</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">Correo Electrónico</h4>
                                    <a href="mailto:foycca@gmail.com" className="text-primary hover:underline text-sm font-semibold">foycca@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground">Teléfono de Secretaría</h4>
                                    <p className="text-foreground/60 text-sm font-medium">+34 607302585</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="bg-white dark:bg-card p-8 sm:p-10 rounded-3xl shadow-xl border border-border/60">
                        <h3 className="font-heading text-2xl font-bold text-foreground mb-6">Envíenos un mensaje</h3>
                        
                        {statusMessage.text && (
                            <div className={`p-4 rounded-xl text-sm font-medium flex items-start gap-2 mb-6 animate-in fade-in duration-300 ${statusMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/20 dark:border-red-900/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30'}`}>
                                {statusMessage.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
                                <span>{statusMessage.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow outline-none"
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Correo Electrónico</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow outline-none"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Asunto</label>
                                <input
                                    type="text"
                                    required
                                    value={asunto}
                                    onChange={(e) => setAsunto(e.target.value)}
                                    className="w-full bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow outline-none"
                                    placeholder="Motivo de su consulta"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Mensaje</label>
                                <textarea
                                    rows={4}
                                    required
                                    value={mensaje}
                                    onChange={(e) => setMensaje(e.target.value)}
                                    className="w-full bg-background border border-border/60 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none outline-none"
                                    placeholder="Escriba su consulta o comentario aquí..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex h-12 items-center justify-center rounded-xl bg-primary text-primary-foreground font-semibold px-8 text-sm shadow-lg shadow-primary/20 hover:bg-primary/95 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4 self-start disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                {submitting ? "Enviando..." : "Enviar Mensaje"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
