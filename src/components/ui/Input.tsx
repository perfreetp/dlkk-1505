import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Search, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  searchMode?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, searchMode, type = 'text', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className="relative">
        {searchMode && (
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-400" />
        )}
        {leftIcon && !searchMode && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-silver-400">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          className={cn(
            'input',
            (searchMode || leftIcon) && 'pl-11',
            isPassword && 'pr-11',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-silver-400 hover:text-brand-500 transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-3 rounded-xl bg-silver-50 border border-silver-200 text-brand-800 placeholder-silver-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
