import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qvfatknzhbkirwwsbhqu.supabase.co';
const supabaseKey = 'RlOT0ZbuCsLp7o1PPkfMAVnUV5Fm6hYzetRadmEtDmUXQdU4b1rIK+ZXaJq1Rfht3Zz3p6rY5gDGDIATkXZc8Q==';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Fonction pour uploader un fichier audio
export const uploadAudio = async (file, userId) => {
  try {
    // Créer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    // Upload du fichier dans le bucket 'audio-recordings'
    const { data, error } = await supabase.storage
      .from('audio-recordings')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Obtenir l'URL publique du fichier
    const { data: { publicUrl } } = supabase.storage
      .from('audio-recordings')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error);
    throw error;
  }
};

// Fonction pour supprimer un fichier audio
export const deleteAudio = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('audio-recordings')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    throw error;
  }
};
