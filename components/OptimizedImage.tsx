import Image from 'next/image';
import { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src: string;
  alt: string;
  title?: string;
  priority?: boolean;
}

export default function OptimizedImage({ 
  src, 
  alt, 
  title, 
  priority = false,
  className = '',
  ...props 
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      title={title}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyOpC4QBmI3Rnp3pe1S5zNPpIFx5PoZ7fU3Zns4+pjWlxdNHMJE4t5rWWuqm6hQ/wBy2cV9pLHDrfA8uvBtnzn9T99LJJPkH0KrlrCgGQJOSBrzgHoKz1XGTOV0gREIyYOVwCxIB/mKlGWPGOCE6bfFfMr1rOe4qMwYEpoBEUfIVTSJGQe5OON3cYgLJ1VY2CjJOBgH5pGoYjKQj5fY3k4H4OfPmI+8VpbW9/IgvLq1EUlvJNDLE5YbtrmQgEjojDggYPgGtdCqmNhQR5BfVz5Y9NHbNvJfRq6yYaGSKKPJXj17r0r1qpnpA4QV//2Q=="
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className={`rounded-lg shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
      {...props}
    />
  );
}