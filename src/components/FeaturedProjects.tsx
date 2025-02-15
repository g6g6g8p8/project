import { useSearchParams } from 'react-router-dom';
import { ProjectCard } from './ProjectCard';
import { useProjects, ProjectFilters } from '../hooks/useProjects';
import { getImageColor } from '../lib/utils';
import { useEffect, useState } from 'react';

export function FeaturedProjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [imageColors, setImageColors] = useState<Record<number, string>>({});
  
  const filters: ProjectFilters = {
    client: searchParams.get('client') || undefined,
    year: searchParams.get('year') || undefined,
    tag: searchParams.get('tag') || undefined,
    role: searchParams.get('role') || undefined,
  };

  const { projects, loading } = useProjects(filters);

  useEffect(() => {
    async function loadImageColors() {
      const colors: Record<number, string> = {};
      for (const project of projects) {
        colors[project.id] = await getImageColor(project.image_url);
      }
      setImageColors(colors);
    }
    if (projects.length > 0) {
      loadImageColors();
    }
  }, [projects]);

  const hasFilters = Boolean(filters.client || filters.year || filters.tag || filters.role);

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="space-y-8">
      {hasFilters && (
        <div className="px-5 md:px-8 lg:px-10 max-w-[1200px] mx-auto">
          <button
            onClick={clearFilters}
            className="text-[14px] leading-[17px] opacity-60 hover:opacity-100 transition-opacity"
          >
            Clear filters
          </button>
        </div>
      )}
      
      <div className="px-5 md:px-8 lg:px-10 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 auto-rows-fr">
        {projects.map((project) => (
          <ProjectCard 
            key={project.id} 
            project={project}
            imageColor={imageColors[project.id]}
          />
        ))}
      </div>
    </div>
  );
} 