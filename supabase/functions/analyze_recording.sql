-- Fonction pour analyser un enregistrement
create or replace function analyze_recording()
returns trigger as $$
begin
  -- Mettre à jour le statut de l'enregistrement
  update recordings
  set 
    status = 'analyzing',
    updated_at = now()
  where id = NEW.id;

  -- Vous pouvez ajouter ici d'autres instructions SQL
  -- Par exemple, extraire des mots-clés, calculer la durée, etc.

  return NEW;
end;
$$ language plpgsql security definer;

-- Créer le déclencheur
create trigger on_recording_created
  after insert on recordings
  for each row
  execute function analyze_recording();

-- Politique de sécurité pour la table recordings
create policy "Utilisateurs authentifiés peuvent lire tous les enregistrements"
  on recordings for select
  to authenticated
  using (true);

create policy "Utilisateurs peuvent créer leurs propres enregistrements"
  on recordings for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Utilisateurs peuvent modifier leurs propres enregistrements"
  on recordings for update
  to authenticated
  using (auth.uid() = user_id);
