import { useState, useEffect } from 'react';
import { startRecordingAnalysis, getAnalysisResults } from '../lib/supabase';

export const useRecordingAnalysis = (recordingId) => {
  const [analysisStatus, setAnalysisStatus] = useState('pending');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!recordingId) return;

    const checkAnalysisStatus = async () => {
      try {
        const results = await getAnalysisResults(recordingId);
        setAnalysisStatus(results.status);
        setAnalysisResults(results);

        // Continuer de vérifier si l'analyse est en cours
        if (results.status === 'analyzing') {
          setTimeout(checkAnalysisStatus, 5000); // Vérifier toutes les 5 secondes
        }
      } catch (err) {
        setError(err.message);
      }
    };

    checkAnalysisStatus();
  }, [recordingId]);

  const startAnalysis = async () => {
    try {
      setAnalysisStatus('analyzing');
      await startRecordingAnalysis(recordingId);
    } catch (err) {
      setError(err.message);
      setAnalysisStatus('error');
    }
  };

  return {
    analysisStatus,
    analysisResults,
    error,
    startAnalysis
  };
};
