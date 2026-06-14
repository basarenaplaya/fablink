import { Children, isValidElement, cloneElement } from 'react';

import { cn } from '@/lib/utils';

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
}

export function Stagger({ children, className }: StaggerProps) {
  const items = Children.toArray(children);

  return (
    <div className={className}>
      {items.map((child, index) => {
        if (!isValidElement<{ className?: string }>(child)) {
          return child;
        }

        return cloneElement(child, {
          className: cn(
            child.props.className,
            'motion-fade-up motion-ease-premium',
            `motion-delay-${Math.min(index + 1, 5)}`,
          ),
        });
      })}
    </div>
  );
}
