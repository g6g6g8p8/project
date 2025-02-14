import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Project } from '../types/database';

interface ProjectFiltersProps {
  projects: Project[];
  activeFilter?: {
    type: 'role' | 'client' | 'category';
    value: string;
  };
}

export default function ProjectFilters({ projects, activeFilter }: ProjectFiltersProps) {
  const navigate = useNavigate();

  // Get unique values for each filter type
  const roles = [...new Set(projects.map(p => p.role))].filter(Boolean);
  const clients = [...new Set(projects.map(p => p.client))].filter(Boolean);
  const categories = [...new Set(projects.map(p => p.category))].filter(Boolean);

  const handleFilter = (type: 'role' | 'client' | 'category', value: string) => {
    if (activeFilter?.type === type && activeFilter.value === value) {
      // Clear filter
      navigate('/');
    } else {
      // Apply filter
      navigate(`/?${type}=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Roles */}
      <div className="space-y-3">
        <h3 className="text-[14px] leading-[17px] font-medium opacity-60 uppercase">Role</h3>
        <div className="flex flex-wrap gap-2">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => handleFilter('role', role)}
              className={`px-4 py-2 rounded-full text-[14px] transition-colors ${
                activeFilter?.type === 'role' && activeFilter.value === role
                  ? 'bg-foreground text-background'
                  : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/80'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Clients */}
      <div className="space-y-3">
        <h3 className="text-[14px] leading-[17px] font-medium opacity-60 uppercase">Client</h3>
        <div className="flex flex-wrap gap-2">
          {clients.map(client => (
            <button
              key={client}
              onClick={() => handleFilter('client', client)}
              className={`px-4 py-2 rounded-full text-[14px] transition-colors ${
                activeFilter?.type === 'client' && activeFilter.value === client
                  ? 'bg-foreground text-background'
                  : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/80'
              }`}
            >
              {client}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-[14px] leading-[17px] font-medium opacity-60 uppercase">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleFilter('category', category)}
              className={`px-4 py-2 rounded-full text-[14px] transition-colors ${
                activeFilter?.type === 'category' && activeFilter.value === category
                  ? 'bg-foreground text-background'
                  : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 