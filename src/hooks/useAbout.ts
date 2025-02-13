import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface AboutData {
  title: string;
  content: string;
}

export function useAbout() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const { data: aboutData, error: aboutError } = await supabase
          .from('about')
          .select('*')
          .single();

        if (aboutError) throw aboutError;

        const { data: experienceData, error: experienceError } = await supabase
          .from('experiences')
          .select('*')
          .order('created_at', { ascending: false });

        if (experienceError) throw experienceError;

        setAbout({
          ...aboutData,
          experiences: experienceData
        });
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