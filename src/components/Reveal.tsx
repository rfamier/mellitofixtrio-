import type { ReactNode, ElementType } from 'react';
import { useInView } from '@/hooks/useInView';

type RevealDirection = 'up' | 'left' | 'right' | 'scale';

type RevealProps = {
  children: ReactNode;
  direction?: RevealDirection;
  delay?: number;
  as?: ElementType;
  className?: string;
};

const directionClass: Record<RevealDirection, string> = {
  up: 'animate-reveal-up',
  left: 'animate-reveal-left',
  right: 'animate-reveal-right',
  scale: 'animate-reveal-scale',
};

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  as: Tag = 'div',
  className = '',
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.12 });

  return (
    <Tag
      ref={ref as never}
      data-visible={inView}
      className={`${inView ? directionClass[direction] : 'reveal-hidden'} ${className}`}
      style={delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
