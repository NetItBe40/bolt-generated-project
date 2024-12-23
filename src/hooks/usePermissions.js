import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const usePermissions = (recordingId) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (recordingId) {
      fetchUserPermissions();
    }
  }, [recordingId]);

  const fetchUserPermissions = async () => {
    try {
      setLoading(true);
      
      // Vérifier si l'utilisateur est le propriétaire
      const { data: recording } = await supabase
        .from('recordings')
        .select('owner_id')
        .eq('id', recordingId)
        .single();

      if (recording?.owner_id === (await supabase.auth.getUser()).data.user?.id) {
        setUserRole('admin');
        return;
      }

      // Sinon, vérifier les permissions
      const { data: permission } = await supabase
        .from('user_permissions')
        .select('role')
        .eq('recording_id', recordingId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      setUserRole(permission?.role || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const canEdit = () => {
    return ['admin', 'editor'].includes(userRole);
  };

  const canManagePermissions = () => {
    return userRole === 'admin';
  };

  const canDelete = () => {
    return userRole === 'admin';
  };

  const updateUserPermission = async (userId, newRole) => {
    if (!canManagePermissions()) {
      throw new Error('Permissions insuffisantes');
    }

    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          recording_id: recordingId,
          role: newRole
        })
        .select();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  };

  return {
    userRole,
    loading,
    error,
    canEdit,
    canManagePermissions,
    canDelete,
    updateUserPermission,
    refreshPermissions: fetchUserPermissions
  };
};
