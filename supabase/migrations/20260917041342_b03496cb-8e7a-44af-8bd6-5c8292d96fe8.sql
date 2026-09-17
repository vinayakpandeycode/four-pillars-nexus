CREATE POLICY "Backend service manages contact enquiries"
ON public.contact_enquiries
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);