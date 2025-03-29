import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { PredictionData } from '../types';

export const usePredictions = (userId: string) => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const { data, error } = await supabase
          .from('predictions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPredictions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    // Set up real-time subscription
    const subscription = supabase
      .channel('predictions_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'predictions',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setPredictions((current) => [payload.new as PredictionData, ...current]);
        }
      )
      .subscribe();

    fetchPredictions();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const savePrediction = async (prediction: Omit<PredictionData, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('predictions')
        .insert([{ ...prediction, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  };

  return { predictions, loading, error, savePrediction };
};