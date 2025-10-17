import {Link} from 'react-router';
import {ChevronRightIcon, StarIcon} from '@heroicons/react/24/solid';

export function HeroSection() {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-image.webp"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        {/* Purple Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-600/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto py-16">
        {/* Top Badge */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md backdrop-blur-sm border border-purple-300/30 rounded-full text-white">
            <StarIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Azonnali kézbesítés</span>
          </div>
        </div>

        {/* Main Headings */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Legális szoftver kulcsok
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-400 mb-6 leading-tight">
          verhetetlen áron
        </h2>

        {/* Description */}
        <p className="text-shadow-lg text-base md:text-lg text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          Legális kulcsok, azonnali aktiválás, 24/7 ügyfélszolgálat.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
          {[
            {icon: '✓', text: 'Legális'},
            {icon: '✓', text: 'Azonnali'},
            {icon: '✓', text: 'Biztonságos'},
          ].map((feature) => (
            <div
              key={feature.text}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full text-white"
            >
              <span className="text-sm font-medium">{feature.icon}</span>
              <span className="text-sm font-medium">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 px-5 md:px-6 py-2 md:py-3 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full text-white font-semibold text-sm md:text-base hover:bg-white/20 transition-all duration-300 group"
        >
          <span>Böngészés kezdése</span>
          <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-6 border-2 border-white/50 rounded-full flex items-center justify-center">
            <svg
              className="w-3 h-3 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
