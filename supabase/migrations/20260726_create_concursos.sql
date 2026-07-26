-- SQL Migration: Create Concursos Table and policies
-- Ejecuta este script en el Editor SQL de tu proyecto en Supabase (https://supabase.com)

CREATE TABLE IF NOT EXISTS public.concursos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    lugar TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    url_bases TEXT, -- Ruta del archivo en el bucket 'documentos' (ej. 'concursos/archivo.pdf')
    documento_nombre TEXT, -- Nombre original del archivo de bases
    tamano_bases TEXT, -- Tamaño formateado (ej. '1.2 MB')
    estado TEXT DEFAULT 'Próximo', -- 'Próximo' | 'En curso' | 'Finalizado'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.concursos ENABLE ROW LEVEL SECURITY;

-- 1. Permitir acceso de lectura público (cualquier persona puede ver los concursos)
CREATE POLICY "Permitir lectura pública de concursos" ON public.concursos
    FOR SELECT USING (true);

-- 2. Permitir inserción a usuarios autenticados
CREATE POLICY "Permitir inserción de concursos a autenticados" ON public.concursos
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Permitir actualización a usuarios autenticados
CREATE POLICY "Permitir actualización de concursos a autenticados" ON public.concursos
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Permitir eliminación a usuarios autenticados
CREATE POLICY "Permitir eliminación de concursos a autenticados" ON public.concursos
    FOR DELETE USING (auth.role() = 'authenticated');
