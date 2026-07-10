CREATE TABLE IF NOT EXISTS public.racing_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    date date NOT NULL,
    location_name text,
    max_lean_left numeric(5,2),
    max_lean_right numeric(5,2),
    top_speed numeric(5,2),
    notes text,
    telemetry_data jsonb,
    created_at timestamptz DEFAULT now() NOT NULL
);

-- RLS policies
ALTER TABLE public.racing_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users
CREATE POLICY "Allow authenticated read access on racing_logs" ON public.racing_logs
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow insert/update for authenticated users
CREATE POLICY "Allow authenticated insert access on racing_logs" ON public.racing_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update access on racing_logs" ON public.racing_logs
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated delete access on racing_logs" ON public.racing_logs
    FOR DELETE
    TO authenticated
    USING (true);
