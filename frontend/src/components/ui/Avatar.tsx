interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'circle' | 'squircle';
  className?: string;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const shapeMap = {
  circle: 'rounded-full',
  squircle: 'rounded-xl',
};

const colorPool = [
  'bg-primary text-white',
  'bg-secondary text-white',
  'bg-info text-white',
  'bg-purple-500 text-white',
  'bg-emerald-500 text-white',
  'bg-amber-500 text-white',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorPool[Math.abs(hash) % colorPool.length];
}

export const Avatar = ({
  src,
  alt,
  name = '',
  size = 'md',
  shape = 'circle',
  className = '',
}: AvatarProps) => {
  const sizeClass = sizeMap[size];
  const shapeClass = shapeMap[shape];

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`${sizeClass} ${shapeClass} object-cover ring-2 ring-white ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} ${shapeClass} flex items-center justify-center font-bold ring-2 ring-white ${getColorFromName(name)} ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
};
