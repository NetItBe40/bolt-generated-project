import React, { useState } from 'react';
import { Mic, Settings } from 'lucide-react';
import RecordingModal from './components/RecordingModal';
import { useRecordings } from './hooks/useRecordings';

const VoximileApp = () => {
  const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
  const { 
    recordings, 
    loading, 
    error, 
    addRecording, 
    deleteRecording 
  } = useRecordings();

  const handleRecordingComplete = async (recordingData) => {
    const newRecording = await addRecording({
      name: recordingData.name || "Nouvel enregistrement",
      duration: recordingData.duration,
      date: new Date().toISOString(),
      tags: recordingData.tags || [],
      audio_url: recordingData.audioUrl // Si vous implémentez le stockage audio
    });

    if (newRecording) {
      setIsRecordingModalOpen(false);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1>Voximile</h1>
          <button className="icon-button">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="actions-container">
          <div className="action-button-container">
            <button 
              className="record-button"
              onClick={() => setIsRecordingModalOpen(true)}
            >
              <Mic className="w-8 h-8" />
            </button>
            <span className="action-label">Enregistrer</span>
          </div>
          <div className="action-button-container">
            <button className="import-button">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <span className="action-label">Importer</span>
          </div>
        </div>

        <section className="recordings-section">
          <h2>Enregistrements récents 2</h2>
          <div className="recordings-list">
            {recordings.map(recording => (
              <div key={recording.id} className="recording-card">
                <div className="recording-info">
                  <h3>{recording.name}</h3>
                  <div className="recording-meta">
                    <span className="duration">{recording.duration}</span>
                    <span className="date">
                      {new Date(recording.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="tags">
                    {recording.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
                <button className="transcript-button">Transcrit</button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <RecordingModal 
        isOpen={isRecordingModalOpen}
        onClose={() => setIsRecordingModalOpen(false)}
        onComplete={handleRecordingComplete}
      />
    </div>
  );
};

export default VoximileApp;
