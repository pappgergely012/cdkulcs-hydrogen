import {NavLink, useLocation, Await} from 'react-router';
import type {HeaderQuery} from 'storefrontapi.generated';
import {UserIcon} from '@heroicons/react/24/solid';
import {Suspense} from 'react';

interface MobileSidebarProps {
  menu: HeaderQuery['menu'];
  primaryDomainUrl: string;
  publicStoreDomain: string;
  isLoggedIn: Promise<boolean>;
  onClose: () => void;
}

export function MobileSidebar({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
  isLoggedIn,
  onClose,
}: MobileSidebarProps) {
  const location = useLocation();

  return (
    <div className="flex flex-col justify-between h-full p-4 z-10">
      {/* Close Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          aria-label="Menü bezárása"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex  flex-col gap-4  pt-6" role="navigation">
        {/* Menu Items */}
        {(menu || FALLBACK_MENU).items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;

          return (
            <NavLink
              to={url}
              className={`transition-colors duration-200 ${
                url === location.pathname
                  ? 'text-purple-500'
                  : 'text-gray-700 hover:text-purple-500'
              }`}
              key={item.id}
              end
              onClick={onClose}
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-gray-200">
        {/* Search Input */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Keresés..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* User Button */}
        <Suspense
          fallback={
            <NavLink
              to="/account"
              onClick={onClose}
              className="flex items-center justify-center gap-3 p-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
            >
              <UserIcon className="w-5 h-5 text-white" />
              <span className="font-medium text-white">Jelentkezz be</span>
            </NavLink>
          }
        >
          <Await resolve={isLoggedIn}>
            {(isLoggedIn: boolean) => (
              <NavLink
                to="/account"
                onClick={onClose}
                className="flex items-center justify-center gap-3 p-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
              >
                <UserIcon className="w-5 h-5 text-white" />
                <span className="font-medium text-white">
                  {isLoggedIn ? 'Fiók beállítások' : 'Jelentkezz be'}
                </span>
              </NavLink>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

const FALLBACK_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};
