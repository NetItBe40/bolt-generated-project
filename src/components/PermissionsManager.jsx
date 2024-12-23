import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PermissionsManager = ({ recordingId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('viewer');

  useEffect(() => {
    fetchUsers();
  }, [recordingId]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select(`
          user_id,
          role,
          auth.users (
            email,
            user_metadata
          )
        `)
        .eq('recording_id', recordingId);

      if (error) throw error;
      setUsers(data);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (e) => {
    e.preventDefault();
    try {
      // Rechercher l'utilisateur par email
      const { data: userData, error: userError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', newUserEmail)
        .single();

      if (userError) throw userError;

      // Ajouter la permission
      const { error: permError } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userData.id,
          recording_id: recordingId,
          role: newUserRole
        });

      if (permError) throw permError;

      setNewUserEmail('');
      fetchUsers();
    } catch (err) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur:', err);
    }
  };

  const removeUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId)
        .eq('recording_id', recordingId);

      if (error) throw error;
      fetchUsers();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    }
  };

  return (
    <div className="permissions-manager">
      <div className="section-header">
        <h3 className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Gestion des accès
        </h3>
      </div>

      <form onSubmit={addUser} className="add-user-form">
        <input
          type="email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          placeholder="Email de l'utilisateur"
          className="email-input"
        />
        <select
          value={newUserRole}
          onChange={(e) => setNewUserRole(e.target.value)}
          className="role-select"
        >
          <option value="viewer">Lecteur</option>
          <option value="editor">Éditeur</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="add-button">
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </form>

      <div className="users-list">
        {users.map((user) => (
          <div key={user.user_id} className="user-item">
            <div className="user-info">
              <span className="user-email">{user.users.email}</span>
              <span className={`role-badge ${user.role}`}>
                {user.role === 'viewer' ? 'Lecteur' :
                 user.role === 'editor' ? 'Éditeur' : 'Admin'}
              </span>
            </div>
            <button
              onClick={() => removeUser(user.user_id)}
              className="remove-button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionsManager;
