"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, MapPin, FileText, Plus, Trash2, Edit, Download, AlertCircle, CheckCircle2, Loader2, FileUp, X, Image as ImageIcon } from "lucide-react";

interface Concurso {
    id: string;
    titulo: string;
    lugar: string;
    fecha_inicio: string;
    fecha_fin: string;
    url_bases: string | null;
    documento_nombre: string | null;
    tamano_bases: string | null;
    estado: string;
    url_cartel: string | null;
    created_at?: string;
}

export default function ConcursosAdmin() {
    const [listaConcursos, setListaConcursos] = useState<Concurso[]>([]);
    const [cargando, setCargando] = useState(true);
    const [subiendo, setSubiendo] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

    // Estados de Formulario
    const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
    const [idEditar, setIdEditar] = useState<string | null>(null);
    const [titulo, setTitulo] = useState("");
    const [lugar, setLugar] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [estado, setEstado] = useState("Próximo");
    
    // Archivo de bases
    const [archivoBases, setArchivoBases] = useState<File | null>(null);
    const [urlBasesExistente, setUrlBasesExistente] = useState<string | null>(null);
    const [documentoNombreExistente, setDocumentoNombreExistente] = useState<string | null>(null);
    const [urlBasesParaEliminar, setUrlBasesParaEliminar] = useState<string | null>(null);

    // Archivo de cartel
    const [archivoCartel, setArchivoCartel] = useState<File | null>(null);
    const [urlCartelExistente, setUrlCartelExistente] = useState<string | null>(null);
    const [urlCartelParaEliminar, setUrlCartelParaEliminar] = useState<string | null>(null);

    useEffect(() => {
        fetchConcursos();
    }, []);

    const fetchConcursos = async () => {
        try {
            setCargando(true);
            const { data, error } = await supabase
                .from("concursos")
                .select("*")
                .order("fecha_inicio", { ascending: false });

            if (error) throw error;
            setListaConcursos(data || []);
        } catch (error: any) {
            console.error("Error al obtener concursos:", error.message);
            mostrarMensaje("error", "No se pudieron cargar los concursos de la base de datos.");
        } finally {
            setCargando(false);
        }
    };

    const getPublicUrl = (path: string) => {
        return supabase.storage.from("documentos").getPublicUrl(path).data.publicUrl;
    };

    const mostrarMensaje = (tipo: "exito" | "error", texto: string) => {
        setMensaje({ tipo, texto });
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000);
    };

    const limpiarFormulario = () => {
        setTitulo("");
        setLugar("");
        setFechaInicio("");
        setFechaFin("");
        setEstado("Próximo");
        setArchivoBases(null);
        setUrlBasesExistente(null);
        setDocumentoNombreExistente(null);
        setUrlBasesParaEliminar(null);
        setArchivoCartel(null);
        setUrlCartelExistente(null);
        setUrlCartelParaEliminar(null);
        setModoFormulario("crear");
        setIdEditar(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 20 * 1024 * 1024) {
                mostrarMensaje("error", "El archivo de bases excede el tamaño máximo permitido de 20MB.");
                e.target.value = "";
                return;
            }
            setArchivoBases(file);
        }
    };

    const handleCartelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                mostrarMensaje("error", "El archivo del cartel excede el tamaño máximo permitido de 10MB.");
                e.target.value = "";
                return;
            }
            setArchivoCartel(file);
        }
    };

    const handleSaveConcurso = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo || !lugar || !fechaInicio || !fechaFin) {
            mostrarMensaje("error", "Por favor, rellena todos los campos obligatorios.");
            return;
        }

        try {
            setSubiendo(true);
            let urlBases = urlBasesExistente;
            let documentoNombre = documentoNombreExistente;
            let tamanoBases = null;
            let urlCartel = urlCartelExistente;

            // Eliminar archivos del storage si el usuario los borró en la edición
            if (urlBasesParaEliminar) {
                const { error: removeError } = await supabase.storage.from("documentos").remove([urlBasesParaEliminar]);
                if (removeError) console.error("Error al borrar bases anteriores:", removeError.message);
            }
            if (urlCartelParaEliminar) {
                const { error: removeError } = await supabase.storage.from("documentos").remove([urlCartelParaEliminar]);
                if (removeError) console.error("Error al borrar cartel anterior:", removeError.message);
            }

            const tituloLimpio = titulo
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "_")
                .replace(/^_+|_+$/g, "");

            // Subir archivo de bases si se ha seleccionado uno nuevo
            if (archivoBases) {
                // Eliminar archivo anterior si existía
                if (urlBasesExistente) {
                    await supabase.storage.from("documentos").remove([urlBasesExistente]);
                }

                const fileExt = archivoBases.name.split(".").pop();
                const randomSuffix = Math.random().toString(36).substring(2, 7);
                const pathName = `concursos/${tituloLimpio}_${randomSuffix}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("documentos")
                    .upload(pathName, archivoBases);

                if (uploadError) throw uploadError;

                urlBases = pathName;
                documentoNombre = archivoBases.name;
                
                const sizeInMB = (archivoBases.size / (1024 * 1024)).toFixed(1);
                tamanoBases = archivoBases.size < 1024 * 1024 
                    ? `${Math.round(archivoBases.size / 1024)} KB` 
                    : `${sizeInMB} MB`;
            } else if (urlBasesExistente === null) {
                // El usuario borró las bases
                urlBases = null;
                documentoNombre = null;
            }

            // Subir archivo del cartel si se ha seleccionado uno nuevo
            if (archivoCartel) {
                // Eliminar cartel anterior si existía
                if (urlCartelExistente) {
                    await supabase.storage.from("documentos").remove([urlCartelExistente]);
                }

                const fileExt = archivoCartel.name.split(".").pop();
                const randomSuffix = Math.random().toString(36).substring(2, 7);
                const pathName = `concursos/carteles/${tituloLimpio}_${randomSuffix}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("documentos")
                    .upload(pathName, archivoCartel);

                if (uploadError) throw uploadError;

                urlCartel = pathName;
            } else if (urlCartelExistente === null) {
                // El usuario borró el cartel
                urlCartel = null;
            }

            const payload: any = {
                titulo,
                lugar,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
                estado,
                url_bases: urlBases,
                documento_nombre: documentoNombre,
                url_cartel: urlCartel,
            };
            if (tamanoBases) {
                payload.tamano_bases = tamanoBases;
            }

            if (modoFormulario === "crear") {
                const { error } = await supabase.from("concursos").insert(payload);
                if (error) throw error;
                mostrarMensaje("exito", "Concurso creado exitosamente.");
            } else {
                const { error } = await supabase
                    .from("concursos")
                    .update(payload)
                    .eq("id", idEditar);
                if (error) throw error;
                mostrarMensaje("exito", "Concurso actualizado exitosamente.");
            }

            limpiarFormulario();
            fetchConcursos();
        } catch (error: any) {
            console.error("Error al guardar concurso:", error);
            const msgError = error?.message || (typeof error === 'string' ? error : "Error interno al procesar el concurso.");
            mostrarMensaje("error", msgError);
        } finally {
            setSubiendo(false);
        }
    };

    const handleEditClick = (concurso: Concurso) => {
        setModoFormulario("editar");
        setIdEditar(concurso.id);
        setTitulo(concurso.titulo);
        setLugar(concurso.lugar);
        setFechaInicio(concurso.fecha_inicio);
        setFechaFin(concurso.fecha_fin);
        setEstado(concurso.estado);
        setUrlBasesExistente(concurso.url_bases);
        setDocumentoNombreExistente(concurso.documento_nombre);
        setUrlCartelExistente(concurso.url_cartel);
        setArchivoBases(null);
        setArchivoCartel(null);
    };

    const handleDeleteConcurso = async (id: string, urlBases: string | null, urlCartel: string | null) => {
        if (!confirm("¿Seguro que deseas eliminar este concurso permanentemente?")) return;

        try {
            setCargando(true);
            if (urlBases) {
                const { error: storageError } = await supabase.storage
                    .from("documentos")
                    .remove([urlBases]);
                if (storageError) console.error("Error al borrar archivo de bases:", storageError.message);
            }
            if (urlCartel) {
                const { error: storageError } = await supabase.storage
                    .from("documentos")
                    .remove([urlCartel]);
                if (storageError) console.error("Error al borrar archivo de cartel:", storageError.message);
            }

            const { error } = await supabase.from("concursos").delete().eq("id", id);
            if (error) throw error;

            mostrarMensaje("exito", "Concurso eliminado correctamente.");
            fetchConcursos();
        } catch (error: any) {
            console.error("Error al eliminar concurso:", error.message);
            mostrarMensaje("error", "No se pudo eliminar el concurso.");
        } finally {
            setCargando(false);
        }
    };

    const handleDownloadBases = async (filePath: string, fileName: string) => {
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
            console.error("Error al descargar bases:", error);
            alert("No se pudo descargar el archivo de bases.");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Formulario de Registro / Edición */}
            <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-heading text-xl font-bold text-foreground">
                            {modoFormulario === "crear" ? "Registrar Nuevo Concurso" : "Editar Concurso"}
                        </h2>
                        <p className="text-sm text-foreground/60">
                            Ingresa los detalles oficiales del concurso ornitológico.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSaveConcurso} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Título del Concurso *</label>
                            <input
                                required
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="Ej. VII Concurso Ornitológico Regional"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Lugar / Ubicación *</label>
                            <input
                                required
                                type="text"
                                value={lugar}
                                onChange={(e) => setLugar(e.target.value)}
                                className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="Ej. Pabellón Municipal de Deportes"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Fecha Inicio *</label>
                            <input
                                required
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Fecha Fin *</label>
                            <input
                                required
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Estado *</label>
                            <select
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                                className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                            >
                                <option value="Próximo">Próximo</option>
                                <option value="En curso">En curso</option>
                                <option value="Finalizado">Finalizado</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Documento de Bases (PDF/DOC) (Opcional)</label>
                            <div className="flex items-center gap-2">
                                <label className="flex-grow flex items-center justify-center gap-2 border border-dashed border-border/80 hover:bg-slate-50 dark:hover:bg-secondary/20 rounded-lg p-2 text-center transition-colors cursor-pointer text-xs font-semibold">
                                    <FileUp className="w-4 h-4 text-foreground/60" />
                                    <span>{archivoBases ? archivoBases.name : "Seleccionar Archivo"}</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                {(archivoBases || documentoNombreExistente) && (
                                    <div className="flex items-center gap-1 shrink-0 bg-secondary/40 px-2 py-1 rounded-lg">
                                        <span className="text-xs text-primary max-w-[100px] truncate" title={archivoBases ? archivoBases.name : documentoNombreExistente!}>
                                            {archivoBases ? archivoBases.name : documentoNombreExistente}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (urlBasesExistente) {
                                                    setUrlBasesParaEliminar(urlBasesExistente);
                                                }
                                                setArchivoBases(null);
                                                setUrlBasesExistente(null);
                                                setDocumentoNombreExistente(null);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                            title="Eliminar bases"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-medium text-foreground">Cartel del Concurso (Imagen) (Opcional)</label>
                            <div className="flex items-center gap-4">
                                <label className="flex-grow flex items-center justify-center gap-2 border border-dashed border-border/80 hover:bg-slate-50 dark:hover:bg-secondary/20 rounded-lg p-2.5 text-center transition-colors cursor-pointer text-xs font-semibold">
                                    <FileUp className="w-4 h-4 text-foreground/60" />
                                    <span>{archivoCartel ? archivoCartel.name : "Seleccionar Cartel"}</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleCartelChange}
                                    />
                                </label>
                                
                                {/* Vista previa del cartel */}
                                {(archivoCartel || urlCartelExistente) && (
                                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0 shadow-sm bg-slate-50">
                                        <img
                                            src={archivoCartel ? URL.createObjectURL(archivoCartel) : getPublicUrl(urlCartelExistente!)}
                                            alt="Vista previa del cartel"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (urlCartelExistente) {
                                                    setUrlCartelParaEliminar(urlCartelExistente);
                                                }
                                                setArchivoCartel(null);
                                                setUrlCartelExistente(null);
                                            }}
                                            className="absolute top-0 right-0 p-0.5 bg-black/60 text-white rounded-bl-lg hover:bg-black/80 transition-colors"
                                            title="Eliminar cartel"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
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
                            {subiendo ? "Guardando..." : modoFormulario === "crear" ? "Registrar Concurso" : "Actualizar Concurso"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Listado de Concursos */}
            <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                <h2 className="font-heading text-xl font-bold text-foreground mb-6">Listado de Concursos Publicados</h2>
                
                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-12 text-foreground/50">
                        <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary/50" />
                        <p className="text-sm">Cargando concursos...</p>
                    </div>
                ) : listaConcursos.length === 0 ? (
                    <p className="text-center py-8 text-foreground/40 italic text-sm border-2 border-dashed border-border rounded-xl">
                        No hay concursos registrados en la base de datos.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {listaConcursos.map((concurso) => (
                            <div
                                key={concurso.id}
                                className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-5 border border-border/60 hover:border-border transition-colors rounded-2xl bg-slate-50/50 dark:bg-background/20 group"
                            >
                                <div className="flex items-start sm:items-center gap-4 min-w-0">
                                    {concurso.url_cartel && (
                                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-border shrink-0 shadow-sm relative bg-slate-100 flex items-center justify-center">
                                            <img
                                                src={getPublicUrl(concurso.url_cartel)}
                                                alt={`Cartel ${concurso.titulo}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="font-heading font-bold text-foreground text-base group-hover:text-primary transition-colors truncate max-w-[250px] sm:max-w-md" title={concurso.titulo}>
                                                {concurso.titulo}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${
                                                concurso.estado === "En curso" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                                                concurso.estado === "Finalizado" ? "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400" :
                                                "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                            }`}>
                                                {concurso.estado}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-foreground/60 font-semibold">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {concurso.fecha_inicio} al {concurso.fecha_fin}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {concurso.lugar}
                                            </span>
                                            {concurso.documento_nombre && (
                                                <span className="flex items-center gap-1.5 text-primary">
                                                    <FileText className="w-3.5 h-3.5" />
                                                    Bases: {concurso.documento_nombre} ({concurso.tamano_bases})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full md:w-auto shrink-0 justify-end">
                                    {concurso.url_bases && concurso.documento_nombre && (
                                        <button
                                            onClick={() => handleDownloadBases(concurso.url_bases!, concurso.documento_nombre!)}
                                            className="p-2.5 bg-white dark:bg-background border border-border hover:bg-secondary transition-colors rounded-xl text-primary"
                                            title="Descargar Bases"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleEditClick(concurso)}
                                        className="p-2.5 bg-white dark:bg-background border border-border hover:bg-secondary transition-colors rounded-xl text-indigo-600"
                                        title="Editar Concurso"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteConcurso(concurso.id, concurso.url_bases, concurso.url_cartel)}
                                        className="p-2.5 bg-white dark:bg-background border border-border hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors rounded-xl text-red-500"
                                        title="Eliminar Concurso"
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
