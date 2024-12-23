import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useRecordingDetails = (recordingId) => {
  const [recording, setRecording] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (recordingId) {
      fetchRecording();
    }
  }, [recordingId]);

  const fetchRecording = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('recordings')
        .select('*')
        .eq('id', recordingId)
        .single();

      if (fetchError) throw fetchError;
      setRecording(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateRecording = async (updates) => {
    try {
      setLoading(true);
      const { data, error: updateError } = await supabase
        .from('recordings')
        .update(updates)
        .eq('id', recordingId)
        .select()
        .single();

      if (updateError) throw updateError;
      setRecording(data);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateField = async (field, value) => {
    try {
      const updates = { [field]: value };
      const result = await updateRecording(updates);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  return {
    recording,
    loading,
    error,
    updateField,
    updateRecording,
    refreshRecording: fetchRecording
  };
};
