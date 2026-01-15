/**
 * Image Optimization Utilities for Mobile Performance
 * Provides props for optimal image loading without requiring CDN transformations
 */

export interface ResponsiveImageConfig {
  src: string
  alt: string
  priority?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Returns props for optimized image loading
 * Focuses on loading strategies rather than URL transformations
 */
export function getOptimizedImageProps(config: ResponsiveImageConfig) {
  const { src, alt, priority = false, className, style } = config
  
  return {
    src,
    alt,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    decoding: 'async' as const,
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
    className,
    style: {
      ...style,
      // CSS optimizations for better rendering
      imageRendering: '-webkit-optimize-contrast' as any,
      backfaceVisibility: 'hidden' as const,
      transform: 'translateZ(0)',
      willChange: priority ? 'transform' : undefined
    }
  }
}
