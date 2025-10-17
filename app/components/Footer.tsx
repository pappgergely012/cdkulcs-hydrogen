import {NavLink} from 'react-router';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/cd-key-logo.png"
                alt="CD Kulcs Logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-bold">CD Kulcs</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Legális szoftver kulcsok verhetetlen áron. Azonnali aktiválás,
              24/7 ügyfélszolgálat.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Gyors linkek</h3>
            <nav className="space-y-2">
              <NavLink
                to="/"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Főoldal
              </NavLink>
              <NavLink
                to="/collections/all"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Szoftverek
              </NavLink>
              <NavLink
                to="/pages/contact"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Kapcsolat
              </NavLink>
            </nav>
          </div>

          {/* Column 3 - Legal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Jogi információk</h3>
            <nav className="space-y-2">
              <NavLink
                to="/policies/privacy-policy"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Adatvédelmi szabályzat
              </NavLink>
              <NavLink
                to="/policies/terms-of-service"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Szolgáltatási feltételek
              </NavLink>
              <NavLink
                to="/policies/refund-policy"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Visszatérítési szabályzat
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Separator */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © 2025 CD Kulcs. Minden jog fenntartva.
          </p>
        </div>
      </div>
    </footer>
  );
}
