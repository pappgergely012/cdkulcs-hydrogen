import {Suspense} from 'react';
import {Await, NavLink, useLocation} from 'react-router';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {
  UserIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';
import {CartButton} from '~/components/CartButton';
import {useMobileMenu} from '~/components/PageLayout';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  const location = useLocation();
  const {open: openMobileMenu} = useMobileMenu();

  return (
    <div className="max-w-7xl mx-auto w-full">
      <header className="flex items-center px-4 py-3 gap-6">
        {/* Logo */}
        <NavLink prefetch="intent" to="/" end>
          <img
            src="/cd-key-logo-rounded.png"
            alt={shop.name}
            className="h-10 w-auto"
          />
        </NavLink>

        {/* Desktop Navigation Menu */}
        <nav className="hidden md:flex items-center gap-6" role="navigation">
          {menu?.items.map((item) => {
            if (!item.url) return null;
            const url =
              item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(header.shop.primaryDomain.url)
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
              >
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        {/* Right Side CTAs */}
        <div className="ml-auto">
          <nav className="flex items-center gap-2" role="navigation">
            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={openMobileMenu}
            >
              <span className="text-xl font-bold">☰</span>
            </button>

            {/* Cart - Only visible on mobile */}
            <div className="md:hidden">
              <Suspense
                fallback={
                  <button className="relative py-1 px-1 rounded-xl">
                    <div className="cursor-pointer flex items-center gap-2 px-2 py-1 rounded-xl bg-gray-100">
                      <svg
                        className="w-5 h-5 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                  </button>
                }
              >
                <Await resolve={cart}>
                  {(cart) => <CartButton cart={cart} />}
                </Await>
              </Suspense>
            </div>

            {/* Desktop CTAs - Hidden on mobile */}
            <div className="hidden md:flex items-center gap-0.5">
              {/* Account Icon */}
              <NavLink
                prefetch="intent"
                to="/account"
                className="relative py-1 px-1 rounded-xl transition-all duration-200 group"
              >
                <Suspense
                  fallback={
                    <div className="cursor-pointer flex items-center gap-2 px-2 py-1 rounded-xl bg-gray-100">
                      <UserIcon className="w-5 h-5 text-gray-700" />
                      {/* Tooltip */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        Bejelentkezés
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                      </div>
                    </div>
                  }
                >
                  <Await
                    resolve={isLoggedIn}
                    errorElement={
                      <div className="cursor-pointer flex items-center gap-2 px-2 py-1 rounded-xl bg-gray-100">
                        <UserIcon className="w-5 h-5 text-gray-700" />
                        {/* Tooltip */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          Bejelentkezés
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                        </div>
                      </div>
                    }
                  >
                    {(isLoggedIn) => (
                      <div className="cursor-pointer flex items-center gap-2 px-2 py-1 rounded-xl transition-all duration-200 bg-purple-100 hover:bg-purple-200">
                        <UserIcon className="w-5 h-5 text-purple-700" />
                        {/* Tooltip */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {isLoggedIn ? 'Fiók beállítások' : 'Bejelentkezés '}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-800"></div>
                        </div>
                      </div>
                    )}
                  </Await>
                </Suspense>
              </NavLink>

              {/* Search Toggle */}
              <NavLink to="/search" prefetch="intent">
                <button className=" cursor-pointer p-1 hover:bg-purple-100 rounded-lg transition-colors duration-200">
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-700 hover:text-purple-700" />
                </button>
              </NavLink>

              {/* Cart */}
              <Suspense
                fallback={
                  <button className="relative py-1 px-1 rounded-xl">
                    <div className="cursor-pointer flex items-center gap-2 px-2 py-1 rounded-xl bg-gray-100">
                      <svg
                        className="w-5 h-5 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                    </div>
                  </button>
                }
              >
                <Await resolve={cart}>
                  {(cart) => <CartButton cart={cart} />}
                </Await>
              </Suspense>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}
