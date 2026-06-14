interface ClientAvatarProps {
  name: string;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function ClientAvatar({ name, className }: ClientAvatarProps) {
  return (
    <div
      className={`flex size-11 shrink-0 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/80 text-sm font-medium text-zinc-200 ${className ?? ''}`}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
