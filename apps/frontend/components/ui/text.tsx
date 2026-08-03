import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      brand: 'text-[#CA3142] dark:text-[#CA3142]',
      primary: 'text-[#1A1A1A] dark:text-[#FFFFFF]',
      secondary: 'text-[#555555] dark:text-[#AAAAAA]',
    },
    size: {
      caption:
        'text-[12px] sm:text-[12px] xl:text-[12px] leading-[12px] sm:leading-[16px] xl:leading-[16px]',
      sm: 'text-[14px] sm:text-[14px] xl:text-[14px] leading-[20px] sm:leading-[20px] xl:leading-[20px]',
      md: 'text-[14px] sm:text-[16px] xl:text-[16px] leading-[20px] sm:leading-[24px] xl:leading-[24px]',
      lg: 'text-[14px] sm:text-[16px] xl:text-[18px] leading-[20px] sm:leading-[24px] xl:leading-[28px]',
      'heading-5':
        'text-[16px] sm:text-[18px] xl:text-[20px] leading-[24px] sm:leading-[28px] xl:leading-[30px]',
      'heading-4':
        'text-[20px] sm:text-[18px] xl:text-[24px] leading-[28px] sm:leading-[30px] xl:leading-[36px]',
      'heading-3':
        'text-[18px] sm:text-[24px] xl:text-[28px] leading-[30px] sm:leading-[36px] xl:leading-[40px]',
      'heading-2':
        'text-[24px] sm:text-[28px] xl:text-[32px] leading-[36px] sm:leading-[40px] xl:leading-[44px]',
      'heading-1':
        'text-[28px] sm:text-[32px] xl:text-[40px] leading-[40px] sm:leading-[44px] xl:leading-[52px]',
      'display-4':
        'text-[32px] sm:text-[40px] xl:text-[56px] leading-[44px] sm:leading-[52px] xl:leading-[68px]',
      'display-3':
        'text-[40px] sm:text-[56px] xl:text-[64px] leading-[52px] sm:leading-[68px] xl:leading-[76px]',
      'display-2':
        'text-[56px] sm:text-[68px] xl:text-[80px] leading-[68px] sm:leading-[76px] xl:leading-[92px]',
      'display-1':
        'text-[64px] sm:text-[80px] xl:text-[88px] leading-[76px] sm:leading-[92px] xl:leading-[100px]',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    transform: {
      none: 'normal-case',
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      capitalize: 'capitalize',
    },
    decoration: {
      none: 'no-underline',
      underline: 'underline',
      'line-through': 'line-through',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'sm',
    weight: 'normal',
    align: 'left',
    transform: 'none',
    decoration: 'none',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label';
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      variant,
      size,
      weight,
      align,
      transform,
      decoration,
      as = 'p',
      ...props
    },
    ref
  ) => {
    const Component = as as unknown as React.ElementType;
    return (
      <Component
        className={cn(
          textVariants({
            variant,
            size,
            weight,
            align,
            transform,
            decoration,
            className,
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = 'Text';

export { Text, textVariants };
