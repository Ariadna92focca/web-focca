-- Migration for Liga Canaria SANSOFÉ configuration and registrations

-- 1. Table for Liga SANSOFÉ Configuration (edition per year, registration status, bases PDF)
CREATE TABLE IF NOT EXISTS public.liga_sansofe_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anio INTEGER NOT NULL UNIQUE,
    inscripciones_abiertas BOOLEAN NOT NULL DEFAULT false,
    url_bases TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table for Liga SANSOFÉ Registrations
CREATE TABLE IF NOT EXISTS public.liga_sansofe_inscripciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anio INTEGER NOT NULL,
    nombre_completo TEXT NOT NULL,
    numero_criador TEXT NOT NULL,
    tipo_asociacion TEXT NOT NULL CHECK (tipo_asociacion IN ('propia', 'otra')),
    asociacion_id UUID REFERENCES public.asociaciones(id) ON DELETE SET NULL,
    otra_asociacion_nombre TEXT DEFAULT NULL,
    grupos_razas TEXT[] NOT NULL DEFAULT '{}',
    estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aceptado', 'rechazado')),
    observaciones_admin TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for efficient querying by year and status
CREATE INDEX IF NOT EXISTS idx_liga_sansofe_inscripciones_anio ON public.liga_sansofe_inscripciones(anio);
CREATE INDEX IF NOT EXISTS idx_liga_sansofe_inscripciones_estado ON public.liga_sansofe_inscripciones(estado);

-- Enable RLS on both tables
ALTER TABLE public.liga_sansofe_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.liga_sansofe_inscripciones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for liga_sansofe_config
DROP POLICY IF EXISTS "Public can view config" ON public.liga_sansofe_config;
CREATE POLICY "Public can view config" ON public.liga_sansofe_config
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage config" ON public.liga_sansofe_config;
CREATE POLICY "Admins can manage config" ON public.liga_sansofe_config
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.focde_usuarios
            WHERE focde_usuarios.id = auth.uid()
            AND focde_usuarios.rol = 'admin'
        )
    );

-- RLS Policies for liga_sansofe_inscripciones
DROP POLICY IF EXISTS "Anyone can insert registrations when active" ON public.liga_sansofe_inscripciones;
CREATE POLICY "Anyone can insert registrations when active" ON public.liga_sansofe_inscripciones
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage registrations" ON public.liga_sansofe_inscripciones;
CREATE POLICY "Admins can manage registrations" ON public.liga_sansofe_inscripciones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.focde_usuarios
            WHERE focde_usuarios.id = auth.uid()
            AND focde_usuarios.rol = 'admin'
        )
    );

-- Insert default row for current year if not exists
INSERT INTO public.liga_sansofe_config (anio, inscripciones_abiertas)
VALUES (2026, false)
ON CONFLICT (anio) DO NOTHING;
