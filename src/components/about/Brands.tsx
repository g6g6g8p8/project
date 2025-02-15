import { useNavigate } from 'react-router-dom';
import { useAbout } from '../../hooks/useAbout';

export function Brands() {
  const { about } = useAbout();
  const navigate = useNavigate();

  const handleFilter = (type: 'client' | 'year' | 'tag', value: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set(type, value);
    navigate(`/?${searchParams.toString()}`);
  };

  return (
    <div className="space-y-5">
      <h3 className="text-subheadline font-medium opacity-60 dark:text-white/60">BRANDS I'VE WORKED WITH</h3>
      <div className="bg-white dark:bg-[#282828] rounded-2xl p-6">
        <div className="flex flex-wrap gap-2">
          {about?.brands.map((brand, index) => (
            <button
              key={index}
              onClick={() => handleFilter('client', brand)}
              className="px-4 py-2 bg-gray-50 dark:bg-white/10 rounded-full text-footnote dark:text-white/90 hover:opacity-80 transition-opacity"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 