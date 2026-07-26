"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, Plus, Trash2, Edit, Download, AlertCircle, CheckCircle2, Loader2, FileUp, X, ExternalLink } from "lucide-react";

interface Impreso {
    id: string;
    titulo: string;
    descripcion: string;
    es_externo: boolean;
    url_destino: string;
    documento_nombre: string | null;
    tamano_archivo: string | null;
    created_at?: string;
}

export default function ImpresosAdmin() {
    const [listaImpresos, setListaImpresos] = useState<Impreso[]>([]);
    const [cargando, setCargando] = useState(true);
    const [subiendo, setSubiendo] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

    // Estados de Formulario
    const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
    const [idEditar, setIdEditar] = useState<string | null>(null);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [esExterno, setEsExterno] = useState(false);
    const [urlExterna, setUrlExterna] = useState("");
    const [archivoDocumento, setArchivoDocumento] = useState<File | null>(null);
    const [urlDestinoExistente, setUrlDestinoExistente] = useState<string | null>(null);
    const [documentoNombreExistente, setDocumentoNombreExistente] = useState<string | null>(null);

    useEffect(() => {
        fetchImpresos();
    }, []);

    const fetchImpresos = async () => {
        try {
            setCargando(true);
            const { data, error } = await supabase
                .from("impresos")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setListaImpresos(data || []);
        } catch (error: any) {
            console.error("Error al obtener impresos:", error.message);
            mostrarMensaje("error", "No se pudieron cargar los impresos de la base de datos.");
        } finally {
            setCargando(false);
        }
    };

    const mostrarMensaje = (tipo: "exito" | "error", texto: string) => {
        setMensaje({ tipo, texto });
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000);
    };

    const limpiarFormulario = () => {
        setTitulo("");
        setDescripcion("");
        setEsExterno(false);
        setUrlExterna("");
        setArchivoDocumento(null);
        setUrlDestinoExistente(null);
        setDocumentoNombreExistente(null);
        setModoFormulario("crear");
        setIdEditar(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 25 * 1024 * 1024) {
                mostrarMensaje("error", "El archivo excede el tamaño máximo permitido de 25MB.");
                e.target.value = "";
                return;
            }
            setArchivoDocumento(file);
        }
    };

    const handleSaveImpreso = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo || !descripcion) {
            mostrarMensaje("error", "Por favor, rellena los campos obligatorios.");
            return;
        }

        if (esExterno && !urlExterna) {
            mostrarMensaje("error", "Por favor, introduce la URL externa.");
            return;
        }

        if (!esExterno && !archivoDocumento && !urlDestinoExistente) {
            mostrarMensaje("error", "Por favor, selecciona un archivo para subir.");
            return;
        }

        try {
            setSubiendo(true);
            let finalUrlDestino = esExterno ? urlExterna : urlDestinoExistente;
            let finalDocumentoNombre = esExterno ? null : documentoNombreExistente;
            let finalTamanoArchivo = esExterno ? "Enlace Web" : null;

            // Si es archivo físico y se ha seleccionado un archivo nuevo
            if (!esExterno && archivoDocumento) {
                // Eliminar archivo anterior si existía uno físico
                if (urlDestinoExistente && !esExterno) {
                    await supabase.storage.from("documentos").remove([urlDestinoExistente]);
                }

                const fileExt = archivoDocumento.name.split(".").pop();
                const tituloLimpio = titulo
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, "_")
                    .replace(/^_+|_+$/g, "");
                
                const randomSuffix = Math.random().toString(36).substring(2, 7);
                const pathName = `impresos/${tituloLimpio}_${randomSuffix}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("documentos")
                    .upload(pathName, archivoDocumento);

                if (uploadError) throw uploadError;

                finalUrlDestino = pathName;
                finalDocumentoNombre = archivoDocumento.name;
                
                const sizeInMB = (archivoDocumento.size / (1024 * 1024)).toFixed(1);
                finalTamanoArchivo = archivoDocumento.size < 1024 * 1024 
                    ? `${Math.round(archivoDocumento.size / 1024)} KB` 
                    : `${sizeInMB} MB`;
            }

            // Si pasa a ser externo pero antes tenía un archivo físico, borrar el archivo del storage
            if (esExterno && urlDestinoExistente && !urlDestinoExistente.startsWith("http")) {
                await supabase.storage.from("documentos").remove([urlDestinoExistente]);
            }

            const payload: any = {
                titulo,
                descripcion,
                es_externo: esExterno,
                url_destino: finalUrlDestino,
                documento_nombre: finalDocumentoNombre,
                tamano_archivo: finalTamanoArchivo
            };

            if (modoFormulario === "crear") {
                const { error } = await supabase.from("impresos").insert(payload);
                if (error) throw error;
                mostrarMensaje("exito", "Impreso/Formulario creado exitosamente.");
            } else {
                const { error } = await supabase
                    .from("impresos")
                    .update(payload)
                    .eq("id", idEditar);
                if (error) throw error;
                mostrarMensaje("exito", "Impreso/Formulario actualizado exitosamente.");
            }

            limpiarFormulario();
            fetchImpresos();
        } catch (error: any) {
            console.error("Error al guardar impreso:", error.message);
            mostrarMensaje("error", error.message || "Error al procesar el impreso.");
        } finally {
            setSubiendo(false);
        }
    };

    const handleEditClick = (impreso: Impreso) => {
        setModoFormulario("editar");
        setIdEditar(impreso.id);
        setTitulo(impreso.titulo);
        setDescripcion(impreso.descripcion);
        setEsExterno(impreso.es_externo);
        if (impreso.es_externo) {
            setUrlExterna(impreso.url_destino);
            setUrlDestinoExistente(null);
            setDocumentoNombreExistente(null);
        } else {
            setUrlExterna("");
            setUrlDestinoExistente(impreso.url_destino);
            setDocumentoNombreExistente(impreso.documento_nombre);
        }
        setArchivoDocumento(null);
    };

    const handleDeleteImpreso = async (id: string, urlDestino: string, esExterno: boolean) => {
        if (!confirm("¿Seguro que deseas eliminar este impreso permanentemente?")) return;

        try {
            setCargando(true);
            if (!esExterno && urlDestino) {
                const { error: storageError } = await supabase.storage
                    .from("documentos")
                    .remove([urlDestino]);
                if (storageError) console.error("Error al borrar archivo:", storageError.message);
            }

            const { error } = await supabase.from("impresos").delete().eq("id", id);
            if (error) throw error;

            mostrarMensaje("exito", "Impreso eliminado correctamente.");
            fetchImpresos();
        } catch (error: any) {
            console.error("Error al eliminar impreso:", error.message);
            mostrarMensaje("error", "No se pudo eliminar el impreso.");
        } finally {
            setCargando(false);
        }
    };

    const handleDownload = async (filePath: string, fileName: string) => {
        try {
            const { data, error } = await supabase.storage.from("documentos").download(filePath);
            if (error) throw error;

            const url = window.URL.createObjectURL(data);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error al descargar:", error);
            alert("No se pudo descargar el archivo.");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Formulario de Impresos */}
            <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-heading text-xl font-bold text-foreground">
                            {modoFormulario === "crear" ? "Registrar Nuevo Impreso/Formulario" : "Editar Impreso/Formulario"}
                        </h2>
                        <p className="text-sm text-foreground/60">
                            Añade accesos directos externos o sube formularios PDF/DOC.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSaveImpreso} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Título *</label>
                            <input
                                required
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="Ej. Solicitud de Anillas, Alta de Asociación..."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Descripción Corta *</label>
                            <input
                                required
                                type="text"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="Ej. Requisitos y formulario de federación."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Tipo de Destino</label>
                            <select
                                value={esExterno ? "externo" : "archivo"}
                                onChange={(e) => setEsExterno(e.target.value === "externo")}
                                className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                            >
                                <option value="archivo">Archivo Descargable (PDF/DOC)</option>
                                <option value="externo">Enlace/Redirección Web Externa</option>
                            </select>
                        </div>

                        {esExterno ? (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-foreground">URL Externa *</label>
                                <input
                                    required
                                    type="url"
                                    value={urlExterna}
                                    onChange={(e) => setUrlExterna(e.target.value)}
                                    className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="https://www.focde.com/anillas/normativa"
                                />
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-foreground">Documento Descargable *</label>
                                <div className="flex items-center gap-2">
                                    <label className="flex-grow flex items-center justify-center gap-2 border border-dashed border-border/80 hover:bg-slate-50 dark:hover:bg-secondary/20 rounded-lg p-2 text-center transition-colors cursor-pointer text-xs font-semibold">
                                        <FileUp className="w-4 h-4 text-foreground/60" />
                                        <span>{archivoDocumento ? archivoDocumento.name : "Seleccionar Archivo"}</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    {documentoNombreExistente && !archivoDocumento && (
                                        <span className="text-xs text-primary max-w-[120px] truncate" title={documentoNombreExistente}>
                                            {documentoNombreExistente}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {mensaje.texto && (
                        <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${mensaje.tipo === "error" ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"}`}>
                            {mensaje.tipo === "error" ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
                            {mensaje.texto}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-border/50">
                        {modoFormulario === "editar" && (
                            <button
                                type="button"
                                onClick={limpiarFormulario}
                                className="px-5 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/80 transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={subiendo}
                            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            {subiendo ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : modoFormulario === "crear" ? (
                                <Plus className="w-4 h-4" />
                            ) : (
                                <Edit className="w-4 h-4" />
                            )}
                            {subiendo ? "Guardando..." : modoFormulario === "crear" ? "Registrar Impreso" : "Actualizar Impreso"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Listado de Impresos */}
            <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                <h2 className="font-heading text-xl font-bold text-foreground mb-6">Listado de Impresos y Formularios</h2>
                
                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-12 text-foreground/50">
                        <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary/50" />
                        <p className="text-sm">Cargando impresos...</p>
                    </div>
                ) : listaImpresos.length === 0 ? (
                    <p className="text-center py-8 text-foreground/40 italic text-sm border-2 border-dashed border-border rounded-xl">
                        No hay impresos registrados en la base de datos.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {listaImpresos.map((impreso) => (
                            <div
                                key={impreso.id}
                                className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 border border-border/60 hover:border-border transition-colors rounded-2xl bg-slate-50/50 dark:bg-background/20 group"
                            >
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="p-3 bg-white dark:bg-background rounded-xl shadow-sm border border-border/50 text-foreground/50 group-hover:text-primary transition-colors shrink-0">
                                        {impreso.es_externo ? <ExternalLink className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-foreground text-sm truncate max-w-[250px] sm:max-w-md" title={impreso.titulo}>
                                            {impreso.titulo}
                                        </h3>
                                        <p className="text-xs text-foreground/60 mt-0.5">{impreso.descripcion}</p>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-secondary text-secondary-foreground mt-1.5 font-bold">
                                            {impreso.es_externo ? "Redirección Web" : `Archivo PDF • ${impreso.tamano_archivo}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                                    {!impreso.es_externo && impreso.url_destino && (
                                        <button
                                            onClick={() => handleDownload(impreso.url_destino, impreso.documento_nombre || "Formulario.pdf")}
                                            className="p-2 bg-white dark:bg-background border border-border hover:bg-secondary transition-colors rounded-xl text-primary"
                                            title="Descargar"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEditClick(impreso)}
                                        className="p-2 bg-white dark:bg-background border border-border hover:bg-secondary transition-colors rounded-xl text-indigo-600"
                                        title="Editar"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteImpreso(impreso.id, impreso.url_destino, impreso.es_externo)}
                                        className="p-2 bg-white dark:bg-background border border-border hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors rounded-xl text-red-500"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
