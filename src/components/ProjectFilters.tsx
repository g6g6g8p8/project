import React from 'react';
import { useSearchParams } from 'react-router-dom';

interface FilterOption {
  label: string;
  value: string;
}

interface ProjectFiltersProps {
  roles: FilterOption[];
  agencies: FilterOption[];
  clients: FilterOption[];
  categories: FilterOption[];
}

export default function ProjectFilters({ roles, agencies, clients, categories }: ProjectFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilter = (type: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (searchParams.get(type) === value) {
      newParams.delete(type);
    } else {
      newParams.set(type, value);
    }
    setSearchParams(newParams);
  };

  const isActive = (type: string, value: string) => searchParams.get(type) === value;

  const FilterSection = ({ title, options, type }: { title: string, options: FilterOption[], type: string }) => (
    <div className="space-y-3">
      <h3 className="text-[14px] leading-[17px] font-medium opacity-60 dark:text-white/60 uppercase">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleFilter(type, option.value)}
            className={`px-4 py-2 rounded-full text-footnote transition-colors ${
              isActive(type, option.value)
                ? 'bg-foreground text-white'
                : 'bg-foreground/5 hover:bg-foreground/10 text-foreground/80'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <FilterSection title="Role" options={roles} type="role" />
      <FilterSection title="Agency" options={agencies} type="agency" />
      <FilterSection title="Client" options={clients} type="client" />
      <FilterSection title="Category" options={categories} type="category" />
    </div>
  );
} 