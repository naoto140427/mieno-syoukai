-- ============================================================
-- Migration: Add Gemini File API caching to unit_documents
-- Date: 2026-08-04
-- Purpose: Cache the uploaded PDF URI from Gemini API for AI Chat
-- ============================================================

ALTER TABLE public.unit_documents
ADD COLUMN gemini_file_uri text,
ADD COLUMN gemini_file_expires_at timestamptz;
