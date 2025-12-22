import { CarouselData, CarouselSlide } from '../types';
import Api from 'src/shared/api/Api.js';

interface BackendCarouselSlide {
  id: number;
  type: 'dual' | 'image';
  title?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  image_url: string;
  order?: number;
}

const mockCarouselData: CarouselData = {
  slides: [
    {
      id: 1,
      type: 'dual',
      title: 'Слайд #1',
      description: 'Описание первого слайда',
      imageUrl: 'public/Screenshot_4.png',
      buttonText: 'Шопинг',
      order: 1
    },
    {
      id: 2,
      type: 'image',
      imageUrl: 'public/ad1.png',
      order: 2
    },
    {
      id: 3,
      type: 'image',
      title: 'Новая коллекция',
      description: 'Успей купить первым',
      imageUrl: 'public/ad3.png',
      buttonText: 'Смотреть',
      order: 3
    }
  ],
  settings: {
    autoplay: true,
    autoplayInterval: 5000,
    infinite: true,
    height: '250px'
  }
};

export const carouselApi = {
  async fetchCarouselData(limit = 3): Promise<CarouselData> {
    try {
      const response = await Api.get(`/carousel/slides?limit=${limit}`);

      const slides: CarouselSlide[] = response.data.data.map(
        (slide: BackendCarouselSlide) => ({
          id: slide.id,
          type: slide.type,
          title: slide.title || undefined,
          description: slide.description || undefined,
          buttonText: slide.button_text || undefined,
          buttonLink: slide.button_link || undefined,
          imageUrl: slide.image_url,
          order: slide.order
        })
      );

      return {
        slides,
        settings: {
          autoplay: true,
          autoplayInterval: 5000,
          infinite: true,
          height: '250px'
        }
      };

    } catch (error) {
      console.warn('Backend unavailable, using mock carousel data', error);
      return mockCarouselData;
    }
  }
};
