import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types/database';

interface ProjectCardProps {
  project: Project;
  imageColor?: string;
}

export default function ProjectCard({ project, imageColor }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.slug}`} className="block">
      <div className="relative">
        <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl">
          <img 
            src={project.image_url} 
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div 
            className="absolute inset-0"
            style={{
              background: imageColor 
                ? `linear-gradient(to top, ${imageColor}99 0%, ${imageColor}00 100%)`
                : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)'
            }}
          />
        </div>
        
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h2 className="text-[26px] leading-[31px] text-white mb-2">{project.title}</h2>
          <p className="text-body text-white/90">{project.description}</p>
        </div>
      </div>
    </Link>
  );
} 