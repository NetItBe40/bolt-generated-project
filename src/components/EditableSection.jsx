import React, { useState } from 'react';
import { Edit2, Check, X, Plus } from 'lucide-react';

const EditableSection = ({ icon: Icon, title, content, onEdit, type = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    onEdit(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(content);
    setIsEditing(false);
  };

  const renderEditContent = () => {
    switch (type) {
      case 'tags':
        return (
          <div className="tags-editor">
            <input
              type="text"
              className="tag-input"
              placeholder="Ajouter un tag (Entrée pour valider)"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  setEditedContent([...editedContent, e.target.value.trim()]);
                  e.target.value = '';
                }
              }}
            />
            <div className="tags-list">
              {editedContent.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    onClick={() => setEditedContent(editedContent.filter((_, i) => i !== index))}
                    className="tag-remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="list-editor">
            {editedContent.map((item, index) => (
              <div key={index} className="list-item-editor">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newContent = [...editedContent];
                    newContent[index] = e.target.value;
                    setEditedContent(newContent);
                  }}
                  className="list-item-input"
                />
                <button
                  onClick={() => setEditedContent(editedContent.filter((_, i) => i !== index))}
                  className="list-item-remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setEditedContent([...editedContent, ''])}
              className="add-item-button"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </div>
        );

      case 'textarea':
        return (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="textarea-input"
            rows={4}
          />
        );

      default:
        return (
          <input
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="text-input"
          />
        );
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'tags':
        return (
          <div className="tags-list">
            {content.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        );

      case 'list':
        return (
          <ul className="content-list">
            {content.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );

      default:
        return <p className="content-text">{content}</p>;
    }
  };

  return (
    <div className={`editable-section ${isEditing ? 'editing' : ''}`}>
      <div className="section-header">
        <div className="section-title">
          <Icon className="w-5 h-5" />
          <h3>{title}</h3>
        </div>
        {isEditing ? (
          <div className="edit-actions">
            <button onClick={handleSave} className="save-button">
              <Check className="w-4 h-4" />
            </button>
            <button onClick={handleCancel} className="cancel-button">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditing(true)} className="edit-button">
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="section-content">
        {isEditing ? renderEditContent() : renderContent()}
      </div>
    </div>
  );
};

export default EditableSection;
