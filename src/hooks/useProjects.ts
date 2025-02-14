import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Project } from '../types/database';

export interface ProjectFilters {
  client?: string;
  year?: string;
  tag?: string;
  role?: string;
}

export function useProjects(filters?: ProjectFilters) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        let query = supabase
          .from('projects')
          .select()
          .order('order', { ascending: true });

        if (filters?.client) {
          query = query.eq('client', filters.client);
        }
        if (filters?.year) {
          query = query.eq('year', filters.year);
        }
        if (filters?.tag) {
          query = query.contains('tags', [filters.tag]);
        }
        if (filters?.role) {
          query = query.eq('role', filters.role);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching projects:', error);
          return;
        }

        setProjects(data || []);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [filters?.client, filters?.year, filters?.tag, filters?.role]);

  return { projects, loading };
}