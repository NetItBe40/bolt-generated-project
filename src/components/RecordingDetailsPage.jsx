import React from 'react';
import { useRecordingDetails } from '../hooks/useRecordingDetails';
import RecordingDetails from './RecordingDetails';
import { Loader } from 'lucide-react';

const RecordingDetailsPage = ({ recordingId }) => {
  const {
    recording,
    loading,
    error,
    updateField,
    refreshRecording
  } = useRecordingDetails(recordingId);

  if (loading) {
    return (
      <div className="loading-container">
        <Loader className="animate-spin" />
        <p>Chargement des détails...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Erreur: {error}</p>
        <button onClick={refreshRecording} className="retry-button">
          Réessayer
        </button>
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="error-container">
        <p>Enregistrement non trouvé</p>
      </div>
    );
  }

  const handleUpdate = async (field, value) => {
    const { success, error } = await updateField(field, value);
    if (!success) {
      // Gérer l'erreur (vous pouvez ajouter un système de notification ici)
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  return (
    <RecordingDetails
      recording={recording}
      onUpdate={handleUpdate}
    />
  );
};

export default RecordingDetailsPage;
