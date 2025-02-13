import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AboutData {
  title: string;
  content: string;
}

export function useAbout() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const { data, error } = await supabase
          .from('about')
          .select('*')
          .single();

        if (error) throw error;
        setAbout(data);
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAbout();
  }, []);

  return { about, loading };
} 