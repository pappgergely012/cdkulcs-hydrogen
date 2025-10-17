import {MobileSidebar} from './MobileSidebar';
import type {HeaderQuery} from 'storefrontapi.generated';
import {useMobileMenu} from './PageLayout';

interface MobileMenuProps {
  menu: HeaderQuery['menu'];
  primaryDomainUrl: string;
  publicStoreDomain: string;
  isLoggedIn: Promise<boolean>;
}

export function MobileMenu({
  menu,
  primaryDomainUrl,
  publicStoreDomain,
  isLoggedIn,
}: MobileMenuProps) {
  const {isOpen, close} = useMobileMenu();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <button
            className="absolute inset-0 w-full h-full"
            onClick={close}
            aria-label="Menü bezárása"
          />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Content */}
        <div className="h-full overflow-y-auto">
          <MobileSidebar
            menu={menu}
            primaryDomainUrl={primaryDomainUrl}
            publicStoreDomain={publicStoreDomain}
            isLoggedIn={isLoggedIn}
            onClose={close}
          />
        </div>
      </div>
    </>
  );
}
