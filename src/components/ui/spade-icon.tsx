interface SpadeIconProps {
  className?: string;
}

export function SpadeIcon({ className = "w-6 h-6" }: SpadeIconProps) {
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
