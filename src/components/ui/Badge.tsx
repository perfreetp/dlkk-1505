import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'new';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-silver-100 text-silver-600',
    success: 'bg-apple-green/15 text-apple-green',
    warning: 'bg-apple-orange/15 text-apple-orange',
    danger: 'bg-apple-red/15 text-apple-red',
    info: 'bg-apple-blue/15 text-apple-blue',
    new: 'bg-gradient-to-r from-apple-purple to-apple-pink text-white',
  };

  return (
    <span className={cn('badge', variants[variant], className)} {...props}>
      {children}
    </span>
  );
}
