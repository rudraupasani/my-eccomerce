'use client'

import { useScrollAnimation } from '@/hooks/use-scroll-animation'
import { cn } from '@/lib/utils'
import React from 'react'

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up'

interface ScrollAnimateProps {
  children: React.ReactNode
  type?: AnimationType
  delay?: number
  className?: string
  as?: React.ElementType
  threshold?: number
}

export function ScrollAnimate({
  children,
  type = 'fade-up',
  delay = 0,
  className,
  as: Tag = 'div',
  threshold = 0.15,
}: ScrollAnimateProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold })

  return (
    <Tag
      ref={ref}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : {}}
      className={cn(
        'scroll-animate',
        `scroll-${type}`,
        isVisible && 'in-view',
        className
      )}
    >
      {children}
    </Tag>
  )
}
