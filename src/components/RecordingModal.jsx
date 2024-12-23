import React, { useState, useEffect } from 'react';
import { Mic, X } from 'lucide-react';
import WaveformVisualizer from './WaveformVisualizer';

const RecordingModal = ({ isOpen, onClose }) => {
  const [time, setTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleRecordingClick = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      setIsRecording(false);
      onClose();
      setTime(0);
    }
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
        <div className="waveform-container">
          <WaveformVisualizer isRecording={isRecording} />
        </div>
        <button 
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={handleRecordingClick}
        >
          <Mic className="w-8 h-8" />
        </button>
        <p>{isRecording ? 'Appuyez pour arrêter' : 'Appuyez pour commencer'}</p>
      </div>
    </div>
  );
};

export default RecordingModal;
