interface SpadeIconProps {
  className?: string;
  variant?: "default" | "card";
}

export function SpadeIcon({ className = "w-6 h-6", variant = "default" }: SpadeIconProps) {
  if (variant === "card") {
    // Chalky cartoon ace of spades card
    return (
      <svg
        viewBox="0 0 40 56"
        className={className}
        aria-hidden="true"
      >
        {/* Card background */}
        <rect x="1" y="1" width="38" height="54" rx="4" ry="4" fill="#f5f0e1" stroke="#d4af37" strokeWidth="2"/>
        {/* Chalky texture overlay */}
        <rect x="1" y="1" width="38" height="54" rx="4" ry="4" fill="url(#chalky)" opacity="0.3"/>
        {/* Big center spade */}
        <path 
          d="M20 12C20 12 10 22 10 28C10 32 12.5 35 17 35C17 35 16 38 20 38C24 38 23 35 23 35C27.5 35 30 32 30 28C30 22 20 12 20 12Z" 
          fill="#d4af37"
        />
        {/* Stem */}
        <path d="M18 35L17 44H23L22 35" fill="#d4af37"/>
        {/* Corner A */}
        <text x="5" y="11" fontSize="8" fontWeight="bold" fill="#d4af37" fontFamily="serif">A</text>
        {/* Corner spade small */}
        <path 
          d="M7 13C7 13 4 16 4 18C4 19.5 5 20.5 6.5 20.5C6.5 20.5 6 21.5 7 21.5C8 21.5 7.5 20.5 7.5 20.5C9 20.5 10 19.5 10 18C10 16 7 13 7 13Z" 
          fill="#d4af37"
        />
        {/* Bottom corner A (rotated) */}
        <text x="35" y="51" fontSize="8" fontWeight="bold" fill="#d4af37" fontFamily="serif" transform="rotate(180, 35, 48)">A</text>
        {/* Bottom corner spade */}
        <path 
          d="M33 43C33 43 30 40 30 38C30 36.5 31 35.5 32.5 35.5C32.5 35.5 32 34.5 33 34.5C34 34.5 33.5 35.5 33.5 35.5C35 35.5 36 36.5 36 38C36 40 33 43 33 43Z" 
          fill="#d4af37"
        />
        {/* Chalky texture pattern */}
        <defs>
          <pattern id="chalky" patternUnits="userSpaceOnUse" width="4" height="4">
            <circle cx="1" cy="1" r="0.5" fill="#000" opacity="0.1"/>
            <circle cx="3" cy="3" r="0.3" fill="#000" opacity="0.08"/>
          </pattern>
        </defs>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C12 2 4 10 4 14C4 17.5 6.5 20 10 20C10 20 10 22 12 22C14 22 14 20 14 20C17.5 20 20 17.5 20 14C20 10 12 2 12 2Z" />
    </svg>
  );
}
