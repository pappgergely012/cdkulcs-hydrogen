import {Await, Link} from 'react-router';
import {
  Suspense,
  useId,
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Footer} from '~/components/Footer';
import {Header} from '~/components/Header';
import {MobileMenu} from '~/components/MobileMenu';
import {CartMain} from '~/components/CartMain';
import {Aside} from '~/components/Aside';

// Mobile Menu Context
interface MobileMenuContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const MobileMenuContext = createContext<MobileMenuContextValue | null>(null);

// Cart Context
interface CartContextValue {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useMobileMenu() {
  const context = useContext(MobileMenuContext);
  if (!context) {
    throw new Error('useMobileMenu must be used within a MobileMenuProvider');
  }
  return context;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

function MobileMenuProvider({children}: {children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <MobileMenuContext.Provider value={{open, close, isOpen}}>
      {children}
    </MobileMenuContext.Provider>
  );
}

function CartProvider({children}: {children: React.ReactNode}) {
  const [isOpen, setIsOpen] = useState(false);

  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when cart is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <CartContext.Provider value={{open, close, isOpen}}>
      {children}
    </CartContext.Provider>
  );
}

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <MobileMenuProvider>
      <CartProvider>
        <Aside.Provider>
          <CartSidebar cart={cart} />
          {header && header.menu && header.shop.primaryDomain?.url && (
            <MobileMenu
              menu={header.menu}
              primaryDomainUrl={header.shop.primaryDomain.url}
              publicStoreDomain={publicStoreDomain}
              isLoggedIn={isLoggedIn}
            />
          )}
          {header && (
            <Header
              header={header}
              cart={cart}
              isLoggedIn={isLoggedIn}
              publicStoreDomain={publicStoreDomain}
            />
          )}
          <main>{children}</main>
          <Footer />
        </Aside.Provider>
      </CartProvider>
    </MobileMenuProvider>
  );
}

function CartSidebar({cart}: {cart: PageLayoutProps['cart']}) {
  const {isOpen, close} = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <button
            className="absolute inset-0 w-full h-full"
            onClick={close}
            aria-label="Kosár bezárása"
          />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[71] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Content */}
        <div className="h-full overflow-y-auto">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Kosár</h3>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                onClick={close}
                aria-label="Bezárás"
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

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
              <Suspense fallback={<p className="p-4">Kosár betöltése...</p>}>
                <Await resolve={cart}>
                  {(cart) => {
                    return <CartMain cart={cart} layout="aside" />;
                  }}
                </Await>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
