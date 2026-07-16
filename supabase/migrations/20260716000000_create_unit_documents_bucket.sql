-- unit-documents バケットが存在しない場合は作成する
INSERT INTO storage.buckets (id, name, public)
VALUES ('unit-documents', 'unit-documents', true)
ON CONFLICT (id) DO NOTHING;
