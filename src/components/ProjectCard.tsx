import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types/database';

interface ProjectCardProps {
  project: Project;
  imageColor?: string;
}

export default function ProjectCard({ project, imageColor }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block relative aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.092)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] dark:shadow-none transition-shadow"
    >
      <img
        src={project.image_url}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div 
        className="absolute inset-0"
        style={{
          background: imageColor 
            ? `linear-gradient(to top, ${imageColor}99 0%, ${imageColor}00 100%)`
            : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)'
        }}
      />
      <div className="absolute bottom-0 left-0 p-6 text-left max-w-[90%]">
        <h3 className="text-title-3 text-white mb-2 leading-tight">
          {project.title}
        </h3>
        <p className="text-callout text-white/90 leading-relaxed">
          {project.description}
        </p>
      </div>
    </Link>
  );
} 