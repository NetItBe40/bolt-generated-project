// Mettre à jour le composant RecordingDetails existant
import React, { useState } from 'react';
import { Tag, Briefcase, Users, CheckSquare, FileText, Share, AlertCircle } from 'lucide-react';
import EditableSection from './EditableSection';

const RecordingDetails = ({ recording, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('informations');
  const [updateStatus, setUpdateStatus] = useState({ type: null, message: null });

  const handleUpdate = async (field, value) => {
    try {
      await onUpdate(field, value);
      setUpdateStatus({
        type: 'success',
        message: 'Modifications enregistrées'
      });
      
      // Effacer le message après 3 secondes
      setTimeout(() => {
        setUpdateStatus({ type: null, message: null });
      }, 3000);
    } catch (error) {
      setUpdateStatus({
        type: 'error',
        message: 'Erreur lors de la sauvegarde'
      });
    }
  };

  return (
    <div className="recording-details">
      <header className="details-header">
        <h2>{recording.name}</h2>
        <div className="header-actions">
          {updateStatus.message && (
            <div className={`update-status ${updateStatus.type}`}>
              {updateStatus.type === 'error' && <AlertCircle className="w-4 h-4" />}
              {updateStatus.message}
            </div>
          )}
          <button className="share-button">
            <Share className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ... reste du code ... */}
    </div>
  );
};

export default RecordingDetails;
