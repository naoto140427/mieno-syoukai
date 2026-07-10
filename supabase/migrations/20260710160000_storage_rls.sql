-- unit-documents バケット用のRLSポリシー
-- （バケットは管理API経由で作成済みですが、オブジェクトに対するRLSが必要です）

-- 1. 認証済みユーザーのみアップロード可能
CREATE POLICY "Allow authenticated users to upload documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK ( bucket_id = 'unit-documents' );

-- 2. 認証済みユーザーのみ更新可能
CREATE POLICY "Allow authenticated users to update documents"
ON storage.objects FOR UPDATE TO authenticated
USING ( bucket_id = 'unit-documents' );

-- 3. 認証済みユーザーのみ削除可能
CREATE POLICY "Allow authenticated users to delete documents"
ON storage.objects FOR DELETE TO authenticated
USING ( bucket_id = 'unit-documents' );

-- 4. 誰でも読み取り可能（Publicバケットのため）
CREATE POLICY "Allow public read access to documents"
ON storage.objects FOR SELECT TO public
USING ( bucket_id = 'unit-documents' );
