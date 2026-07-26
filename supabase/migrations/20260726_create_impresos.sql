-- SQL Migration: Create Impresos Table and policies
-- Ejecuta este script en el Editor SQL de tu proyecto en Supabase (o lo ejecutaremos vía CLI tras tu aprobación)

CREATE TABLE IF NOT EXISTS public.impresos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    es_externo BOOLEAN DEFAULT FALSE NOT NULL,
    url_destino TEXT NOT NULL, -- Guardará la URL externa o la ruta del archivo en Storage (ej. 'impresos/archivo.pdf')
    documento_nombre TEXT, -- Nombre original del archivo subido (opcional)
    tamano_archivo TEXT, -- Tamaño formateado (ej. '1.5 MB') o 'Enlace Web'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.impresos ENABLE ROW LEVEL SECURITY;

-- 1. Permitir acceso de lectura público (cualquier persona puede ver y descargar los impresos)
CREATE POLICY "Permitir lectura pública de impresos" ON public.impresos
    FOR SELECT USING (true);

-- 2. Permitir inserción a usuarios autenticados
CREATE POLICY "Permitir inserción de impresos a autenticados" ON public.impresos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Permitir actualización a usuarios autenticados
CREATE POLICY "Permitir actualización de impresos a autenticados" ON public.impresos
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Permitir eliminación a usuarios autenticados
CREATE POLICY "Permitir eliminación de impresos a autenticados" ON public.impresos
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insertar el registro por defecto de "Anillas" existente en el mockup
INSERT INTO public.impresos (titulo, descripcion, es_externo, url_destino, tamano_archivo)
VALUES (
    'Anillas', 
    'Enlace directo normativas y peticiones de anillas.', 
    TRUE, 
    'https://www.focde.com/anillas/normativa', 
    'Enlace Web'
) ON CONFLICT DO NOTHING;
