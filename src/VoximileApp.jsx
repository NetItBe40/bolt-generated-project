import React, { useState } from 'react';
import { Mic, Settings, Clock } from 'lucide-react';
import Modal from './components/Modal';
import DetailsModal from './components/DetailsModal';
import EditableSection from './components/EditableSection';

const VoximileApp = () => {
  const [modalState, setModalState] = useState('CLOSED');
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [recordings, setRecordings] = useState([
    {
      id: 1,
      name: "Entretien client - Projet Site Web",
      date: new Date(),
      duration: 145,
      analysis: {
        type: ["Entretien client", "Réunion commerciale"],
        client: "Société ABC",
        participants: ["Jean Martin", "Marie Dupont"],
        nextActions: ["Envoyer proposition commerciale", "Rappeler le 15/01"]
      }
    },
    {
      id: 2,
      name: "Point hebdo - Planning",
      date: new Date(),
      duration: 920,
      analysis: {
        type: ["Réunion interne", "Planning"],
        client: "Interne",
        participants: ["Sarah Smith", "Tom Wilson", "Alice Brown"],
        nextActions: ["Mettre à jour le planning", "Envoyer le compte-rendu"]
      }
    }
  ]);

  const handleRecordingClick = (recording) => {
    setSelectedRecording(recording);
    setModalState('DETAILS');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Voximile</h1>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center mb-12">
          <button
            onClick={() => setModalState('RECORDING')}
            className="w-16 h-16 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg mb-4"
          >
            <Mic className="w-8 h-8 text-white" />
          </button>
          <span className="text-sm text-gray-600">Appuyez pour enregistrer</span>
        </div>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Enregistrements récents</h2>
          </div>
          
          <div className="space-y-3">
            {recordings.map(recording => (
              <div
                key={recording.id}
                onClick={() => handleRecordingClick(recording)}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="font-medium text-gray-800 mb-1">{recording.name}</h3>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {`${Math.floor(recording.duration / 60)}:${(recording.duration % 60)
                      .toString()
                      .padStart(2, '0')}`}
                  </span>
                  <span className="flex items-center">
                    {recording.date.toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {recording.analysis.type.map((type, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 rounded text-xs text-blue-700"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Modal
        isOpen={modalState === 'RECORDING'}
        onClose={() => setModalState('CLOSED')}
      >
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold">Enregistrement</h2>
          <div className="text-4xl font-mono">00:00</div>
          <div className="flex justify-center">
            <button className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
              <Mic className="w-10 h-10 text-white" />
            </button>
          </div>
          <p className="text-gray-500">Appuyez pour commencer</p>
        </div>
      </Modal>

      {selectedRecording && (
        <DetailsModal
          isOpen={modalState === 'DETAILS'}
          onClose={() => {
            setModalState('CLOSED');
            setSelectedRecording(null);
          }}
          recording={selectedRecording}
        />
      )}
    </div>
  );
};

export default VoximileApp;
