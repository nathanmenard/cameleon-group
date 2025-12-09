"use client";

interface NavigationProps {
  clientLogo?: {
    src: string;
    alt: string;
  };
  date: string;
  onLogoClick?: () => void;
}

/**
 * Navigation - Navbar fixe en haut avec logo Drakkar, logo client et date
 */
export function Navigation({ clientLogo, date, onLogoClick }: NavigationProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-noir z-[1000] flex items-center justify-between px-8 md:px-4">
      {/* Logo section */}
      <button type="button"
        onClick={onLogoClick}
        className="flex items-center h-full cursor-pointer text-decoration-none"
        aria-label="Retour en haut"
      >
        <img
          src="/logos/logo_drakkar_blanc.png"
          alt="Drakkar"
          className="h-[22px] md:h-[18px] w-auto block"
        />
        {clientLogo && (
          <>
            <span className="font-sans text-base md:text-xs text-gris-400 mx-2.5 md:mx-1.5 font-normal">
              ×
            </span>
            <img
              src={clientLogo.src}
              alt={clientLogo.alt}
              className="h-8 md:h-[26px] w-auto brightness-0 invert"
            />
          </>
        )}
      </button>

      {/* Date */}
      <span className="font-sans text-xs md:text-[0.65rem] text-gris-400 tracking-wider">
        {date}
      </span>
    </nav>
  );
}
