-- Add phone column to messages table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'messages' AND column_name = 'phone') THEN
        ALTER TABLE public.messages ADD COLUMN phone text default '';
    END IF;
END $$;
