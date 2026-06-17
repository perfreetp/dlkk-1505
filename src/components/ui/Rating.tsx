import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

export function Rating({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  readOnly = true,
  onChange,
  className,
}: RatingProps) {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(value);
          const halfFilled = !filled && i < value;
          return (
            <button
              key={i}
              type="button"
              disabled={readOnly}
              onClick={() => onChange?.(i + 1)}
              className={cn(
                'relative transition-transform',
                !readOnly && 'cursor-pointer hover:scale-110'
              )}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  filled || halfFilled ? 'fill-apple-yellow text-apple-yellow' : 'text-silver-200'
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={cn('font-semibold text-brand-700', size === 'sm' && 'text-xs', size === 'md' && 'text-sm', size === 'lg' && 'text-base')}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
