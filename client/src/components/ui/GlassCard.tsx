import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  gradient?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, gradient = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "glass-card rounded-xl p-6 relative overflow-hidden",
          className
        )}
        {...props}
      >
        {gradient && (
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
        )}
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);
GlassCard.displayName = 'GlassCard';
