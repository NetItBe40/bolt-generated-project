import React, { useState } from 'react';
import { Tag, Briefcase, User, Clock } from 'lucide-react';

const EditableSection = ({ title, icon: Icon, content, onEdit, type = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  return (
    <div className={`p-4 ${isEditing ? 'border-2 border-blue-300' : ''} rounded-lg`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium flex items-center">
          <Icon className="w-4 h-4 mr-2" />
          {title}
        </h4>
        {isEditing ? (
          <div className="space-x-2">
            <button onClick={handleSave} className="text-sm px-3 py-1 bg-blue-500 text-white rounded">
              Sauvegarder
            </button>
            <button onClick={() => setIsEditing(false)} className="text-sm px-3 py-1 bg-gray-100 rounded">
              Annuler
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-sm px-3 py-1 bg-gray-100 rounded">
            Modifier
          </button>
        )}
      </div>
      
      {isEditing ? (
        type === 'tags' ? (
          <div className="space-y-2">
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Ajouter un tag (appuyez sur Entrée)"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  setEditedContent([...editedContent, e.target.value]);
                  e.target.value = '';
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {editedContent.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 rounded text-sm flex items-center">
                  {tag}
                  <button
                    onClick={() => setEditedContent(editedContent.filter((_, i) => i !== index))}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : type === 'list' ? (
          <div className="space-y-2">
            {editedContent.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newContent = [...editedContent];
                    newContent[index] = e.target.value;
                    setEditedContent(newContent);
                  }}
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={() => setEditedContent(editedContent.filter((_, i) => i !== index))}
                  className="text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => setEditedContent([...editedContent, ''])}
              className="text-blue-500 text-sm"
            >
              + Ajouter
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded"
          />
        )
      ) : (
        type === 'tags' ? (
          <div className="flex flex-wrap gap-2">
            {editedContent.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 rounded text-sm">{tag}</span>
            ))}
          </div>
        ) : type === 'list' ? (
          <ul className="list-disc list-inside text-sm">
            {editedContent.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm">{editedContent}</p>
        )
      )}
    </div>
  );
};

export default EditableSection;
