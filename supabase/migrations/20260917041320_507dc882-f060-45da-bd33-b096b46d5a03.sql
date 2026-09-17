CREATE TABLE public.contact_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  business_email text NOT NULL CHECK (char_length(business_email) <= 255),
  company text CHECK (company IS NULL OR char_length(company) <= 150),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  country text CHECK (country IS NULL OR char_length(country) <= 100),
  service_required text CHECK (service_required IS NULL OR char_length(service_required) <= 100),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 2000),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.contact_enquiries TO service_role;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;