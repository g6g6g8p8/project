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

        const { data: careerData, error: careerError } = await supabase
          .from('career_highlights')
          .select('*')
          .order('created_at', { ascending: false });

        if (careerError) throw careerError;

        const { data: awardsData, error: awardsError } = await supabase
          .from('awards')
          .select('*')
          .order('year', { ascending: false });

        if (awardsError) throw awardsError;

        setAbout({
          ...aboutData,
          career_highlights: careerData,
          awards: awardsData
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