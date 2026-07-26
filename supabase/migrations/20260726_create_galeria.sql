-- SQL Migration: Create Galeria Table and policies
-- Ejecuta este script en el Editor SQL de tu proyecto en Supabase (o lo ejecutaremos vía CLI)

CREATE TABLE IF NOT EXISTS public.galeria (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT,
    album TEXT NOT NULL DEFAULT 'General', -- Carpeta/Álbum para organizar las fotos
    url_imagen TEXT NOT NULL, -- Ruta del Storage (ej. 'galeria/archivo.jpg') o ruta estática (ej. '/assets/...')
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.galeria ENABLE ROW LEVEL SECURITY;

-- 1. Permitir acceso de lectura público (cualquier persona puede ver la galería)
CREATE POLICY "Permitir lectura pública de galeria" ON public.galeria
    FOR SELECT USING (true);

-- 2. Permitir inserción a usuarios autenticados
CREATE POLICY "Permitir inserción de galeria a autenticados" ON public.galeria
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Permitir actualización a usuarios autenticados
CREATE POLICY "Permitir actualización de galeria a autenticados" ON public.galeria
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Permitir eliminación a usuarios autenticados
CREATE POLICY "Permitir eliminación de galeria a autenticados" ON public.galeria
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insertar las imágenes por defecto que ya estaban en el mockup
INSERT INTO public.galeria (titulo, album, url_imagen)
VALUES 
('FOCCA', 'Federación', '/assets/federacion/FOCCA.JPG'),
('AO AviLancelot', 'Asociaciones', '/assets/asociaciones/AO AviLancelot.jpg'),
('Costa Adeje', 'Asociaciones', '/assets/asociaciones/Costa Adeje.jpg'),
('MAXORATA', 'Asociaciones', '/assets/asociaciones/MAXORATA.jpg'),
('Logo TACUENSE', 'Asociaciones', '/assets/asociaciones/logo TACUENSE.jpeg')
ON CONFLICT DO NOTHING;
