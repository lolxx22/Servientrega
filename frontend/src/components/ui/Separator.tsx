interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator = ({ orientation = 'horizontal', className = '' }: SeparatorProps) => {
  return (
    <div
      role="separator"
      className={`bg-neutral-100 ${
        orientation === 'horizontal' ? 'w-full h-px' : 'h-full w-px'
      } ${className}`}
    />
  );
};
