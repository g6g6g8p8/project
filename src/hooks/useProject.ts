import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Project, ProjectContent } from '../types/database';

export function useProject(slug: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [content, setContent] = useState<ProjectContent[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select()
          .eq('slug', slug)
          .maybeSingle();

        if (projectError) {
          console.error('Error fetching project:', projectError);
          setProject(null);
          return;
        }

        setProject(projectData);

        // Fetch project content if project exists
        if (projectData) {
          const { data: contentData, error: contentError } = await supabase
            .from('projects_content')
            .select()
            .eq('project_id', projectData.id)
            .order('order');

          if (contentError) {
            console.error('Error fetching project content:', contentError);
          } else {
            setContent(contentData);
          }
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  return { project, content, loading };
}