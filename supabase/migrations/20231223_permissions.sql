-- Créer un type pour les rôles d'utilisateur
create type user_role as enum ('admin', 'editor', 'viewer');

-- Table pour stocker les permissions des utilisateurs
create table user_permissions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  recording_id uuid references recordings(id) on delete cascade,
  role user_role not null default 'viewer',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, recording_id)
);

-- Ajouter une colonne owner_id à la table recordings
alter table recordings 
add column owner_id uuid references auth.users(id) not null;

-- Activer RLS sur les tables
alter table recordings enable row level security;
alter table user_permissions enable row level security;

-- Politiques pour la table recordings
create policy "Les propriétaires ont un accès complet"
  on recordings
  for all
  using (auth.uid() = owner_id);

create policy "Les éditeurs peuvent modifier"
  on recordings
  for update
  using (
    exists (
      select 1 from user_permissions
      where user_id = auth.uid()
      and recording_id = recordings.id
      and role in ('editor', 'admin')
    )
  );

create policy "Les viewers peuvent voir"
  on recordings
  for select
  using (
    exists (
      select 1 from user_permissions
      where user_id = auth.uid()
      and recording_id = recordings.id
    )
  );

-- Politiques pour la table user_permissions
create policy "Les admins peuvent gérer les permissions"
  on user_permissions
  for all
  using (
    exists (
      select 1 from user_permissions
      where user_id = auth.uid()
      and recording_id = user_permissions.recording_id
      and role = 'admin'
    )
    or exists (
      select 1 from recordings
      where id = user_permissions.recording_id
      and owner_id = auth.uid()
    )
  );

-- Fonction pour vérifier les permissions
create or replace function check_user_permission(recording_id uuid, required_role user_role)
returns boolean as $$
begin
  return exists (
    select 1 from recordings r
    left join user_permissions up on up.recording_id = r.id
    where r.id = recording_id
    and (
      r.owner_id = auth.uid()
      or (up.user_id = auth.uid() and up.role >= required_role)
    )
  );
end;
$$ language plpgsql security definer;
