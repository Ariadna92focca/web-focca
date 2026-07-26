"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Image as ImageIcon, Plus, Trash2, Edit, AlertCircle, CheckCircle2, Loader2, FileUp, X, Folder } from "lucide-react";

interface Foto {
    id: string;
    titulo: string | null;
    album: string;
    url_imagen: string;
    created_at?: string;
}

export default function GaleriaAdmin() {
    const [listaFotos, setListaFotos] = useState<Foto[]>([]);
    const [albumesDisponibles, setAlbumesDisponibles] = useState<string[]>([]);
    const [cargando, setCargando] = useState(true);
    const [subiendo, setSubiendo] = useState(false);
    const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

    // Estados de Formulario
    const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar'>('crear');
    const [idEditar, setIdEditar] = useState<string | null>(null);
    const [titulo, setTitulo] = useState("");
    const [albumSeleccionado, setAlbumSeleccionado] = useState("General");
    const [nuevoAlbum, setNuevoAlbum] = useState("");
    const [crearNuevoAlbum, setCrearNuevoAlbum] = useState(false);
    const [archivoImagen, setArchivoImagen] = useState<File | null>(null);
    const [urlImagenExistente, setUrlImagenExistente] = useState<string | null>(null);

    useEffect(() => {
        fetchFotos();
    }, []);

    const fetchFotos = async () => {
        try {
            setCargando(true);
            const { data, error } = await supabase
                .from("galeria")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setListaFotos(data || []);

            // Extraer álbumes únicos
            if (data) {
                const uniqueAlbums = Array.from(new Set(data.map((f: Foto) => f.album))) as string[];
                setAlbumesDisponibles(uniqueAlbums.length > 0 ? uniqueAlbums : ["General", "Federación", "Asociaciones"]);
            }
        } catch (error: any) {
            console.error("Error al obtener fotos:", error.message);
            mostrarMensaje("error", "No se pudieron cargar las fotos de la base de datos.");
        } finally {
            setCargando(false);
        }
    };

    const getPublicUrl = (path: string) => {
        if (path.startsWith("/assets/")) return path;
        return supabase.storage.from("documentos").getPublicUrl(path).data.publicUrl;
    };

    const mostrarMensaje = (tipo: "exito" | "error", texto: string) => {
        setMensaje({ tipo, texto });
        setTimeout(() => setMensaje({ tipo: "", texto: "" }), 5000);
    };

    const limpiarFormulario = () => {
        setTitulo("");
        setAlbumSeleccionado("General");
        setNuevoAlbum("");
        setCrearNuevoAlbum(false);
        setArchivoImagen(null);
        setUrlImagenExistente(null);
        setModoFormulario("crear");
        setIdEditar(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file.size > 15 * 1024 * 1024) {
                mostrarMensaje("error", "El archivo de imagen excede el tamaño máximo permitido de 15MB.");
                e.target.value = "";
                return;
            }
            setArchivoImagen(file);
        }
    };

    const handleSaveFoto = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const finalAlbum = crearNuevoAlbum ? nuevoAlbum.trim() : albumSeleccionado;
        if (!finalAlbum) {
            mostrarMensaje("error", "Por favor, introduce o selecciona un álbum para organizar la foto.");
            return;
        }

        if (modoFormulario === "crear" && !archivoImagen) {
            mostrarMensaje("error", "Por favor, selecciona una imagen para subir.");
            return;
        }

        try {
            setSubiendo(true);
            let finalUrlImagen = urlImagenExistente;

            // Subir archivo de imagen si se ha seleccionado uno nuevo
            if (archivoImagen) {
                // Eliminar archivo anterior si existía en el storage y no era estático de assets
                if (urlImagenExistente && !urlImagenExistente.startsWith("/assets/")) {
                    await supabase.storage.from("documentos").remove([urlImagenExistente]);
                }

                const fileExt = archivoImagen.name.split(".").pop();
                const albumLimpio = finalAlbum
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, "_")
                    .replace(/^_+|_+$/g, "");
                
                const randomSuffix = Math.random().toString(36).substring(2, 7);
                const pathName = `galeria/${albumLimpio}_${Date.now()}_${randomSuffix}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("documentos")
                    .upload(pathName, archivoImagen);

                if (uploadError) throw uploadError;

                finalUrlImagen = pathName;
            }

            const payload: any = {
                titulo: titulo ? titulo.trim() : null,
                album: finalAlbum,
                url_imagen: finalUrlImagen,
            };

            if (modoFormulario === "crear") {
                const { error } = await supabase.from("galeria").insert(payload);
                if (error) throw error;
                mostrarMensaje("exito", "Foto añadida a la galería con éxito.");
            } else {
                const { error } = await supabase
                    .from("galeria")
                    .update(payload)
                    .eq("id", idEditar);
                if (error) throw error;
                mostrarMensaje("exito", "Foto de galería actualizada con éxito.");
            }

            limpiarFormulario();
            fetchFotos();
        } catch (error: any) {
            console.error("Error al guardar foto en galeria:", error.message);
            mostrarMensaje("error", error.message || "Error al procesar la foto.");
        } finally {
            setSubiendo(false);
        }
    };

    const handleEditClick = (foto: Foto) => {
        setModoFormulario("editar");
        setIdEditar(foto.id);
        setTitulo(foto.titulo || "");
        
        // Comprobar si el álbum está entre los predefinidos
        if (albumesDisponibles.includes(foto.album)) {
            setAlbumSeleccionado(foto.album);
            setCrearNuevoAlbum(false);
        } else {
            setCrearNuevoAlbum(true);
            setNuevoAlbum(foto.album);
        }
        setUrlImagenExistente(foto.url_imagen);
        setArchivoImagen(null);
    };

    const handleDeleteFoto = async (id: string, urlImagen: string) => {
        if (!confirm("¿Seguro que deseas eliminar esta foto permanentemente?")) return;

        try {
            setCargando(true);
            // Si el archivo estaba en Storage (no en la carpeta /assets local)
            if (urlImagen && !urlImagen.startsWith("/assets/")) {
                const { error: storageError } = await supabase.storage
                    .from("documentos")
                    .remove([urlImagen]);
                if (storageError) console.error("Error al borrar archivo físico:", storageError.message);
            }

            const { error } = await supabase.from("galeria").delete().eq("id", id);
            if (error) throw error;

            mostrarMensaje("exito", "Foto eliminada de la galería.");
            fetchFotos();
        } catch (error: any) {
            console.error("Error al eliminar foto:", error.message);
            mostrarMensaje("error", "No se pudo eliminar la foto de la galería.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Formulario de Galería */}
            <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="font-heading text-xl font-bold text-foreground">
                            {modoFormulario === "crear" ? "Añadir Foto a la Galería" : "Editar Foto de la Galería"}
                        </h2>
                        <p className="text-sm text-foreground/60">
                            Sube una imagen, ponle un título opcional y organízala por carpetas/álbumes.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSaveFoto} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Título (Opcional)</label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                placeholder="Ej. Entrega de Premios 2026"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-foreground">Álbum / Carpeta *</label>
                            <div className="flex gap-2">
                                {!crearNuevoAlbum ? (
                                    <select
                                        value={albumSeleccionado}
                                        onChange={(e) => {
                                            if (e.target.value === "NEW_ALBUM") {
                                                setCrearNuevoAlbum(true);
                                                setAlbumSeleccionado("");
                                            } else {
                                                setAlbumSeleccionado(e.target.value);
                                            }
                                        }}
                                        className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                    >
                                        {albumesDisponibles.map(album => (
                                            <option key={album} value={album}>{album}</option>
                                        ))}
                                        <option value="NEW_ALBUM">+ Crear nuevo álbum...</option>
                                    </select>
                                ) : (
                                    <div className="flex w-full gap-2 items-center">
                                        <input
                                            required
                                            type="text"
                                            value={nuevoAlbum}
                                            onChange={(e) => setNuevoAlbum(e.target.value)}
                                            className="w-full border border-border/60 bg-background rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="Nombre del nuevo álbum"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setCrearNuevoAlbum(false)}
                                            className="p-2 border border-border text-foreground/60 hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                                            title="Volver a lista"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-medium text-foreground">Imagen *</label>
                            <div className="flex items-center gap-4">
                                <label className="flex-grow flex items-center justify-center gap-2 border border-dashed border-border/80 hover:bg-slate-50 dark:hover:bg-secondary/20 rounded-lg p-2.5 text-center transition-colors cursor-pointer text-xs font-semibold">
                                    <FileUp className="w-4 h-4 text-foreground/60" />
                                    <span>{archivoImagen ? archivoImagen.name : "Seleccionar Imagen"}</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                
                                {/* Previsualización de Imagen */}
                                {(archivoImagen || urlImagenExistente) && (
                                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0 shadow-sm bg-slate-50">
                                        <img
                                            src={archivoImagen ? URL.createObjectURL(archivoImagen) : getPublicUrl(urlImagenExistente!)}
                                            alt="Vista previa"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setArchivoImagen(null);
                                                setUrlImagenExistente(null);
                                            }}
                                            className="absolute top-0 right-0 p-0.5 bg-black/60 text-white rounded-bl-lg hover:bg-black/80 transition-colors"
                                            title="Quitar imagen"
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
                            {subiendo ? "Añadiendo..." : modoFormulario === "crear" ? "Añadir Foto" : "Actualizar Foto"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Listado de Fotos */}
            <div className="bg-white dark:bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
                <h2 className="font-heading text-xl font-bold text-foreground mb-6">Listado de Fotos en la Galería</h2>
                
                {cargando ? (
                    <div className="flex flex-col items-center justify-center py-12 text-foreground/50">
                        <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary/50" />
                        <p className="text-sm">Cargando galería...</p>
                    </div>
                ) : listaFotos.length === 0 ? (
                    <p className="text-center py-8 text-foreground/40 italic text-sm border-2 border-dashed border-border rounded-xl">
                        No hay fotos registradas en la galería.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {listaFotos.map((foto) => (
                            <div
                                key={foto.id}
                                className="flex flex-col border border-border/60 hover:border-border transition-colors rounded-2xl bg-slate-50/50 dark:bg-background/20 overflow-hidden relative group"
                            >
                                <div className="aspect-video w-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
                                    <img
                                        src={getPublicUrl(foto.url_imagen)}
                                        alt={foto.titulo || "Foto de galería"}
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                                    />
                                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/60 text-white flex items-center gap-1">
                                        <Folder className="w-3 h-3" />
                                        {foto.album}
                                    </span>
                                    
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditClick(foto)}
                                            className="p-1.5 bg-white/95 text-indigo-600 hover:bg-white rounded-lg shadow transition-colors"
                                            title="Editar"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFoto(foto.id, foto.url_imagen)}
                                            className="p-1.5 bg-white/95 text-red-500 hover:bg-white rounded-lg shadow transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                {foto.titulo && (
                                    <div className="p-3">
                                        <h4 className="font-bold text-foreground text-xs truncate" title={foto.titulo}>
                                            {foto.titulo}
                                        </h4>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
