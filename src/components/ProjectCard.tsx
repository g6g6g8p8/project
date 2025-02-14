import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types/database';

interface ProjectCardProps {
  project: Project;
  imageColor?: string;
}

export default function ProjectCard({ project, imageColor }: ProjectCardProps) {
  const getAspectRatioClass = () => {
    switch (project.aspect_ratio) {
      case '3:4':
        return 'aspect-[3/4]';
      case '9:2':
        return 'aspect-[9/2]';
      default:
        return 'aspect-[3/4] md:aspect-[4/3]'; // Default: 3:4 on mobile, 4:3 on desktop
    }
  };

  const allTags = [
    ...project.tags,
    project.client,
    project.role
  ];

  return (
    <Link to={`/projects/${project.slug}`} className="block">
      <div className="relative">
        <div className={`w-full overflow-hidden rounded-2xl ${getAspectRatioClass()}`}>
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
          <h2 className="text-[26px] leading-[31px] font-semibold text-white mb-2">{project.title}</h2>
          <p className="text-[14px] leading-[20px] text-white/90 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-white/10 rounded-full text-[12px] text-white/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
} 