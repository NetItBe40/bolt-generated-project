import React, { useState } from 'react';
import Modal from './Modal';
import EditableSection from './EditableSection';
import { Tag, Briefcase, User, Clock } from 'lucide-react';

const DetailsModal = ({ isOpen, onClose, recording }) => {
  const [notes, setNotes] = useState('');
  
  if (!recording) return null;

  const analysis = recording.analysis || {
    type: [],
    client: 'Non spécifié',
    participants: [],
    nextActions: []
  };

  const handleUpdateAnalysis = (field, value) => {
    console.log(`Updating ${field}:`, value);
  };

  const handleExport = (format) => {
    console.log(`Exporting in ${format} format...`);
  };

  const transcription = [
    {
      id: 1,
      speaker: "Jean Martin",
      text: "Bonjour, merci de nous rejoindre aujourd'hui pour discuter du projet de site web.",
      timestamp: "00:00",
      speakerColor: "blue"
    },
    {
      id: 2,
      speaker: "Marie Dupont",
      text: "Bonjour, oui je suis très intéressée par votre proposition.",
      timestamp: "00:05",
      speakerColor: "purple"
    },
    {
      id: 3,
      speaker: "Jean Martin",
      text: "Parfait. Pouvons-nous commencer par vos besoins principaux ?",
      timestamp: "00:10",
      speakerColor: "blue"
    }
  ];

  const [showTranscription, setShowTranscription] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">{recording.name}</h2>
        
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setShowTranscription(false)}
            className={`pb-2 px-4 ${!showTranscription ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Analyse
          </button>
          <button
            onClick={() => setShowTranscription(true)}
            className={`pb-2 px-4 ${showTranscription ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Transcription
          </button>
        </div>

        {showTranscription ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Interlocuteurs</h3>
              <div className="flex flex-wrap gap-3">
                {analysis.participants.map((participant, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-purple-500' : 'bg-green-500'
                    } mr-2`}></div>
                    <span className="text-sm text-gray-600">{participant}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {transcription.map((entry) => (
                <div key={entry.id} className="flex space-x-4">
                  <div className="w-24 flex-shrink-0">
                    <div className="text-sm text-gray-500">{entry.timestamp}</div>
                  </div>
                  <div className="flex-grow">
                    <div className={`font-medium mb-1 ${
                      entry.speakerColor === 'blue' ? 'text-blue-600' : 
                      entry.speakerColor === 'purple' ? 'text-purple-600' : 'text-green-600'
                    }`}>
                      {entry.speaker}
                    </div>
                    <p className="text-gray-700">{entry.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 bg-blue-50">
                <EditableSection
                  title="Type de conversation"
                  icon={Tag}
                  content={analysis.type}
                  onEdit={(value) => handleUpdateAnalysis('type', value)}
                  type="tags"
                />
              </div>

              <div className="bg-green-50">
                <EditableSection
                  title="Client"
                  icon={Briefcase}
                  content={analysis.client}
                  onEdit={(value) => handleUpdateAnalysis('client', value)}
                />
              </div>

              <div className="bg-purple-50">
                <EditableSection
                  title="Participants"
                  icon={User}
                  content={analysis.participants}
                  onEdit={(value) => handleUpdateAnalysis('participants', value)}
                  type="list"
                />
              </div>

              <div className="col-span-2 bg-yellow-50">
                <EditableSection
                  title="Actions à suivre"
                  icon={Clock}
                  content={analysis.nextActions}
                  onEdit={(value) => handleUpdateAnalysis('nextActions', value)}
                  type="list"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="relative group inline-block">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                  Exporter
                </button>
                <div className="hidden group-hover:block absolute z-10 w-48 bg-white rounded shadow-lg mt-2">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => handleExport('docx')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Word (.docx)
                  </button>
                  <button
                    onClick={() => handleExport('txt')}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Texte (.txt)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DetailsModal;
