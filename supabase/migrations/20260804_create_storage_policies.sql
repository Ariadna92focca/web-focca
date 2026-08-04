-- SQL Migration: Create storage bucket policies for 'documentos'
-- Ejecuta este script en el Editor SQL de tu proyecto en Supabase para otorgar permisos de subida.

-- Asegurar que el bucket 'documentos' existe y es público
INSERT INTO storage.buckets (id, name, public)
VALUES ('documentos', 'documentos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 1. Permitir acceso de lectura público a los archivos de 'documentos'
CREATE POLICY "Permitir lectura pública de documentos" ON storage.objects
    FOR SELECT USING (bucket_id = 'documentos');

-- 2. Permitir inserción de archivos en 'documentos' a usuarios autenticados
CREATE POLICY "Permitir inserción de documentos a autenticados" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documentos' AND auth.role() = 'authenticated');

-- 3. Permitir actualización de archivos en 'documentos' a usuarios autenticados
CREATE POLICY "Permitir actualización de documentos a autenticados" ON storage.objects
    FOR UPDATE USING (bucket_id = 'documentos' AND auth.role() = 'authenticated');

-- 4. Permitir eliminación de archivos en 'documentos' a usuarios autenticados
CREATE POLICY "Permitir eliminación de documentos a autenticados" ON storage.objects
    FOR DELETE USING (bucket_id = 'documentos' AND auth.role() = 'authenticated');
