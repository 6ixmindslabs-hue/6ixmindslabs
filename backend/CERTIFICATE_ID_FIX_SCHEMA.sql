-- ============================================
-- CERTIFICATE SYSTEM UPDATE (FINAL FIX)
-- ============================================

-- 1. Add certificate_number column (String/Text as requested)
ALTER TABLE public.certificates 
ADD COLUMN IF NOT EXISTS certificate_number text;

-- 2. Add Unique Constraint to prevent duplicates
DROP INDEX IF EXISTS idx_certificates_number;
CREATE UNIQUE INDEX idx_certificates_number 
ON public.certificates(certificate_number);

-- 3. Backfill existing data
-- Format: Extract number from certificate_id (e.g., "6ML-IN-2025-00123" -> "00123")
-- This ensures the system picks up from the last issued certificate continuously.
UPDATE public.certificates
SET certificate_number = SUBSTRING(certificate_id FROM '[0-9]+$')
WHERE certificate_number IS NULL;

-- 4. Ensure consistency (Re-pad to 5 digits if necessary)
UPDATE public.certificates
SET certificate_number = LPAD(certificate_number, 5, '0')
WHERE LENGTH(certificate_number) < 5 AND certificate_number IS NOT NULL;
