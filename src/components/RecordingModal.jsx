import React, { useState, useEffect } from 'react';
import { Mic, X } from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';
import { uploadAudio } from '../lib/supabase';

const RecordingModal = ({ isOpen, onClose, onComplete }) => {
  const [time, setTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingError, setRecordingError] = useState(null);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erreur lors de l\'accès au microphone:', error);
      setRecordingError('Impossible d\'accéder au microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSaveRecording = async () => {
    if (!audioBlob) return;

    try {
      // Créer un fichier à partir du blob
      const file = new File([audioBlob], `recording-${Date.now()}.webm`, {
        type: 'audio/webm'
      });

      // Upload le fichier audio
      const audioUrl = await uploadAudio(file, 'user-id'); // Remplacer 'user-id' par l'ID réel de l'utilisateur

      // Appeler onComplete avec les données de l'enregistrement
      onComplete({
        name: `Enregistrement du ${new Date().toLocaleDateString()}`,
        duration: `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`,
        audioUrl,
        tags: []
      });

      // Réinitialiser l'état
      setAudioBlob(null);
      setTime(0);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setRecordingError('Erreur lors de la sauvegarde de l\'enregistrement');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="recording-modal">
        <button className="close-button" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
        <h2>Enregistrement</h2>
        <div className="timer">{formatTime(time)}</div>
        
        {recordingError && (
          <div className="error-message">{recordingError}</div>
        )}

        <div className="waveform-container">
          <WaveformVisualizer isRecording={isRecording} />
        </div>

        {!audioBlob ? (
          <button 
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            <Mic className="w-8 h-8" />
          </button>
        ) : (
          <div className="button-group">
            <button 
              className="save-button"
              onClick={handleSaveRecording}
            >
              Sauvegarder
            </button>
            <button 
              className="cancel-button"
              onClick={() => setAudioBlob(null)}
            >
              Recommencer
            </button>
          </div>
        )}

        <p>
          {isRecording ? 'Appuyez pour arrêter' : 
           audioBlob ? 'Voulez-vous sauvegarder cet enregistrement ?' : 
           'Appuyez pour commencer'}
        </p>
      </div>
    </div>
  );
};

export default RecordingModal;
