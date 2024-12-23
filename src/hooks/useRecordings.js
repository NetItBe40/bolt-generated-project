import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useRecordings = () => {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      const { data, error } = await supabase
        .from('recordings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecordings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addRecording = async (recordingData) => {
    try {
      const { data, error } = await supabase
        .from('recordings')
        .insert([recordingData])
        .select();

      if (error) throw error;
      setRecordings(prev => [data[0], ...prev]);
      return data[0];
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const deleteRecording = async (id) => {
    try {
      const { error } = await supabase
        .from('recordings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRecordings(prev => prev.filter(recording => recording.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    recordings,
    loading,
    error,
    addRecording,
    deleteRecording,
    refreshRecordings: fetchRecordings
  };
};
