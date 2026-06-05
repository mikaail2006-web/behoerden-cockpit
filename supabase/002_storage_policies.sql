-- Behoerden-Cockpit storage policies
-- Optionaler Supabase-Storage-Pfad fuer Portal-Uploads.

insert into storage.buckets (id, name, public)
values ('behoerden-documents', 'behoerden-documents', false)
on conflict (id) do nothing;

create policy "tenant_document_upload"
on storage.objects for insert
with check (
  bucket_id = 'behoerden-documents'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = public.current_tenant_id()::text
);

create policy "tenant_document_read"
on storage.objects for select
using (
  bucket_id = 'behoerden-documents'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = public.current_tenant_id()::text
);

create policy "tenant_document_update"
on storage.objects for update
using (
  bucket_id = 'behoerden-documents'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = public.current_tenant_id()::text
)
with check (
  bucket_id = 'behoerden-documents'
  and auth.uid() is not null
  and (storage.foldername(name))[1] = public.current_tenant_id()::text
);

create policy "tenant_document_delete_admin_only"
on storage.objects for delete
using (
  bucket_id = 'behoerden-documents'
  and auth.uid() is not null
  and public.current_user_role() = 'admin'
  and (storage.foldername(name))[1] = public.current_tenant_id()::text
);
