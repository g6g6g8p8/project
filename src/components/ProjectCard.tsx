import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types/database';

interface ProjectCardProps {
  project: Project;
  imageColor?: string;
}

export default function ProjectCard({ project, imageColor }: ProjectCardProps) {
  const is9by4 = project.aspect_ratio === '9:4';
  
  const getAspectRatioClass = () => {
    switch (project.aspect_ratio) {
      case '3:4':
        return 'aspect-[3/4]';
      case '9:4':
        return 'aspect-[3/4] md:aspect-[9/4]'; // 3:4 on mobile, 9:4 on desktop
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
      className={`block ${is9by4 ? 'md:col-span-full md:max-w-[1440px] md:mx-auto' : ''}`}
    >
      <div className={`relative ${is9by4 ? 'md:grid md:grid-cols-[33%_67%]' : ''}`}>
        {/* Content Section - Only for 9:4 on desktop */}
        {is9by4 && (
          <div className="hidden md:flex relative flex-col justify-between p-8 h-full overflow-hidden rounded-l-2xl 
            dark:ring-1 dark:ring-white/[0.08]"
          >
            <div 
              className="absolute inset-0 z-0"
              style={{
                backgroundColor: imageColor || 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(20px)',
              }}
            />
            <div className="relative z-10 space-y-4">
              <h2 className="text-[26px] leading-[31px] font-semibold text-white">{project.title}</h2>
              <p className="text-[14px] leading-[20px] text-white/90">{project.description}</p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-2">
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
        )}

        {/* Shadow wrapper */}
        <div className="rounded-2xl dark:ring-1 dark:ring-white/[0.08]">
          {/* Image Section */}
          <div className={`
            w-full overflow-hidden 
            ${is9by4 ? 'md:rounded-l-none' : ''} 
            rounded-2xl
            ${getAspectRatioClass()}
          `}>
            <img 
              src={project.image_url} 
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            
            {/* Gradient and Content Overlay - Only show on mobile or non-9:4 */}
            {(!is9by4 || window.innerWidth < 768) && (
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
            )}
          </div>
        </div>
      </div>
    </Link>
  );
} 