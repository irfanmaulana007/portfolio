import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[#CA3142] text-[#FFFFFF] hover:bg-[#CA3142]/90 active:bg-[#CA3142]/80 dark:bg-[#CA3142] dark:text-[#FFFFFF] dark:hover:bg-[#CA3142]/90 dark:active:bg-[#CA3142]/80',
        'primary-outline':
          'bg-[#FAFAFA] border border-[#D94A5B] text-[#D94A5B] hover:border-[#D94A5B]/90 active:border-[#D94A5B]/80 dark:bg-[#181818] dark:border-[#D94A5B] dark:text-[#D94A5B] dark:hover:border-[#D94A5B]/90 dark:active:border-[#D94A5B]/80',
        secondary:
          'border border-[#E5E5E5] bg-[#FAFAFA] text-[#1A1A1A] hover:bg-[#FAFAFA]/90 active:bg-[#FAFAFA]/80 dark:border-[#242424] dark:bg-[#181818] dark:text-[#FFFFFF] dark:hover:bg-[#181818]/90 dark:active:bg-[#181818]/80',
        'secondary-outline':
          'border border-[#FAFAFA] text-[#1A1A1A] hover:border-[#FAFAFA]/90 active:border-[#FAFAFA]/80 dark:border-[#181818] dark:text-[#FFFFFF] dark:hover:border-[#181818]/90 dark:active:border-[#181818]/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-sm px-3',
        lg: 'h-11 rounded-sm px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
