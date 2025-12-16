<template>
  <div class="ad-carousel" v-if="carouselData">
    <q-carousel
      v-model="currentSlide"
      animated
      arrows
      navigation
      :infinite="carouselData.settings?.infinite ?? true"
      :autoplay="carouselData.settings?.autoplay ?? false"
      :style="{ height: carouselData.settings?.height || '250px' }"
      class="carousel gray-carousel"
    >
      <q-carousel-slide
        v-for="slide in sortedSlides"
        :key="slide.id"
        :name="slide.id"
        class="carousel-slide"
      >
        <SlideRenderer :slide="slide" />
      </q-carousel-slide>
    </q-carousel>
  </div>

  <!-- Skeleton -->
  <div v-else class="ad-carousel-skeleton">
    <q-skeleton height="100%" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { CarouselData } from '../types';
import { carouselApi } from '../api/adCarousel.api';
import SlideRenderer from './SlideRenderer.vue';

const carouselData = ref<CarouselData | null>(null);
const currentSlide = ref<number>(1);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Сортировка по order
const sortedSlides = computed(() => {
  if (!carouselData.value) return [];
  return [...carouselData.value.slides].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );
});

// Автоплей (кастомный)
let autoplayTimer: number | null = null;

const fetchCarouselData = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    carouselData.value = await carouselApi.fetchCarouselData();

    if (carouselData.value.slides.length > 0) {
      currentSlide.value = sortedSlides.value[0].id;
    }

    setupAutoplay();
  } catch (err) {
    error.value = 'Не удалось загрузить карусель';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const setupAutoplay = () => {
  if (!carouselData.value?.settings?.autoplay) return;

  const interval = carouselData.value.settings.autoplayInterval || 5000;

  autoplayTimer = window.setInterval(() => {
    if (!carouselData.value) return;

    const currentIndex = sortedSlides.value.findIndex(
      s => s.id === currentSlide.value
    );
    const nextIndex =
      (currentIndex + 1) % sortedSlides.value.length;

    currentSlide.value = sortedSlides.value[nextIndex].id;
  }, interval);
};

onMounted(fetchCarouselData);

onUnmounted(() => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
  }
});
</script>


<style scoped>
.ad-carousel {
  width: 100%;
  height: 100%;
}

/* Серый фон для всей карусели */
.gray-carousel {
  background-color: #cbdffeff !important; /* Светло-серый фон */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 100%;
  height: 250px;
}

/* Альтернативные оттенки серого (можно выбрать один):
  background-color: #f8f9fa !important; - очень светлый
  background-color: #e9ecef !important; - светлый
  background-color: #dee2e6 !important; - средний
  background-color: #6c757d !important; - темный (для контраста)
*/

.carousel-slide {
  padding: 0 !important;
  height: 100% !important;
}

.ad-carousel-skeleton {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f5f7fa; /* Тот же серый фон для скелетона */
}

/* Стили для серых стрелок */
.gray-carousel :deep(.q-carousel__arrow) {
  color: #6c757d !important; /* Серый цвет иконок */
  background-color: rgba(255, 255, 255, 0.9) !important; /* Белый фон с прозрачностью */
  border: 1px solid #dee2e6 !important; /* Серая рамка */
  border-radius: 50%;
  width: 44px;
  height: 44px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.25s ease;

  top: 50% !important; /* ← центрирование по вертикали */
  transform: translateY(-50%) !important; /* ← точное выравнивание */
}

/* Эффект при наведении на стрелки */
.gray-carousel :deep(.q-carousel__arrow:hover) {
  color: #495057 !important; /* Темнее при наведении */
  background-color: rgba(255, 255, 255, 1) !important;
  border-color: #adb5bd !important;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Стили для точек навигации */
.gray-carousel :deep(.q-carousel__navigation) {
  bottom: 20px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  width: 100% !important;
  position: absolute !important;
  left: 0 !important;
}

/* Каждая точка - сохраняем только нужные свойства */
.gray-carousel :deep(.q-carousel__navigation .q-btn) {
  /* Не используем all: unset! */
  width: 12px !important;
  height: 12px !important;
  min-width: 10px !important; /* важно! */
  min-height: 10px !important; /* важно! */
  border-radius: 50% !important;
  background-color: rgba(255, 255, 255, 0.6) !important;
  margin: 0 5px !important;
  padding: 0 !important; /* убираем отступы */
  border: none !important; /* убираем границу */
  display: inline-flex !important; /* сохраняем flex для центрирования */
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  box-shadow: none !important; /* убираем тень */
  outline: none !important; /* убираем обводку */
  position: relative !important;
  z-index: 2 !important;
}

/* Убираем внутренние элементы, но сохраняем кнопку */
.gray-carousel :deep(.q-carousel__navigation .q-btn__content),
.gray-carousel :deep(.q-carousel__navigation .q-focus-helper) {
  display: none !important;
}

/* Оставляем wrapper для кликабельности */
.gray-carousel :deep(.q-carousel__navigation .q-btn__wrapper) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* Активная точка */
.gray-carousel :deep(.q-carousel__navigation .q-btn.active) {
  background-color: #ffffff !important;
  transform: scale(1.4);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

.gray-carousel :deep(.q-carousel__navigation .q-btn:hover) {
  background-color: rgba(255, 255, 255, 0.9) !important;
  width: 14px !important; /* Увеличиваем размер */
  height: 14px !important;
  transform: none !important; /* Убираем scale */
}

/* Позиционирование стрелок */
.gray-carousel :deep(.q-carousel__arrow--left) {
  left: 16px !important;
}

.gray-carousel :deep(.q-carousel__arrow--right) {
  right: 16px !important;
}
</style>