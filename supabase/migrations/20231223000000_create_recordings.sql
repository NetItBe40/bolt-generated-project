-- Création de la table recordings avec plus de champs
create table recordings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  duration text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  tags text[] default array[]::text[],
  audio_url text,
  transcript text,
  status text default 'pending',
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index pour améliorer les performances
create index recordings_user_id_idx on recordings(user_id);
create index recordings_status_idx on recordings(status);
create index recordings_created_at_idx on recordings(created_at desc);

-- Activer Row Level Security
alter table recordings enable row level security;

-- Fonction pour mettre à jour le timestamp updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at
create trigger update_recordings_updated_at
  before update on recordings
  for each row
  execute function update_updated_at_column();
