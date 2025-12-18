export type CarouselSlideType = 'dual' | 'image';

export interface CarouselSlide {
  id: number;
  type: CarouselSlideType;
  imageUrl: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
}

export interface CarouselData {
  slides: CarouselSlide[];
  settings?: {
    autoplay?: boolean;
    autoplayInterval?: number;
    infinite?: boolean;
    height?: string;
  };
}