import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import type { CollectionFragment } from 'storefrontapi.generated';

interface CategoriesDropdownProps {
  collections: CollectionFragment[];
}

export function CategoriesDropdown({ collections }: CategoriesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // No need for click outside handling since we use hover

  // Close dropdown when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isCollectionsPage = location.pathname.startsWith('/collections');

  return (
    <div
      className='relative'
      ref={dropdownRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Main Categories Link with Arrow */}
      <Link
        to='/collections'
        className={`transition-colors duration-200 flex items-center gap-1 ${
          isCollectionsPage
            ? 'text-purple-500'
            : 'text-gray-700 hover:text-purple-500'
        }`}
      >
        Termék kategóriák
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Link>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className='absolute top-full left-0 pt-2 w-64 z-50'
          onMouseEnter={() => setIsOpen(true)}
        >
          <div className='bg-white rounded-lg shadow-lg border border-gray-200 py-2'>
            {/* All Categories Link */}
            <Link
              to='/collections'
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors duration-200'
            >
              Összes kategória
            </Link>

            {/* Divider */}
            <div className='border-t border-gray-100 my-1'></div>

            {/* Individual Categories */}
            {collections.map(collection => (
              <Link
                key={collection.id}
                to={`/collections/${collection.handle}`}
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-colors duration-200'
              >
                {collection.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
