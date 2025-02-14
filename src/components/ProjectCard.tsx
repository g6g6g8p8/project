import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types/database';

interface ProjectCardProps {
  project: Project;
  imageColor?: string;
}

export default function ProjectCard({ project, imageColor }: ProjectCardProps) {
  const is9by2 = project.aspect_ratio === '9:2';
  
  const getAspectRatioClass = () => {
    switch (project.aspect_ratio) {
      case '3:4':
        return 'aspect-[3/4]';
      case '9:2':
        return 'aspect-[3/4] md:aspect-[9/2]'; // 3:4 on mobile, 9:2 on desktop
      default:
        return 'aspect-[3/4] md:aspect-[4/3]';
    }
  };

  const displayTags = [
    project.category,
    project.client
  ].filter(Boolean);

  return (
    <Link 
      to={`/projects/${project.slug}`} 
      className={`block ${is9by2 ? 'md:col-span-full md:max-w-[1440px] md:mx-auto' : ''}`}
    >
      <div className="relative">
        <div className={`
          w-full overflow-hidden rounded-2xl 
          shadow-[0_2px_8px_rgba(0,0,0,0.05)] 
          dark:shadow-none 
          ${getAspectRatioClass()}
        `}>
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
          <div className="absolute inset-x-0 bottom-0 p-6">
            <h2 className="text-[26px] leading-[31px] font-semibold text-white mb-2">{project.title}</h2>
            <p className="text-[14px] leading-[20px] text-white/90 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {displayTags.map((tag, index) => (
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
      </div>
    </Link>
  );
} 