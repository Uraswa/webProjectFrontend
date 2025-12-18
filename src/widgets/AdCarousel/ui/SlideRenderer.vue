<template>
  <div class="slide-renderer">
    <!-- Dual Slide -->
    <div v-if="slide.type === 'dual'" class="row dual-slide">
      <div class="col-6 dual-slide__content">
        <div class="dual-slide__text">
          <h4 class="dual-slide__title">{{ slide.title }}</h4>
          <p class="dual-slide__description">{{ slide.description }}</p>
          <q-btn
            v-if="slide.buttonText"
            color="primary"
            :to="slide.buttonLink"
            @click="handleButtonClick"
          >
            {{ slide.buttonText }}
          </q-btn>
        </div>
      </div>
      <div class="col-6 dual-slide__image-container">
        <img
          :src="slide.imageUrl"
          :alt="slide.title"
          class="dual-slide__image"
        />
      </div>
    </div>

    <!-- Image Slide (полноэкранное изображение) -->
    <div v-else-if="slide.type === 'image'" class="image-slide">
      <img
        :src="slide.imageUrl"
        :alt="slide.title"
        class="image-slide__image"
      />
      <div class="image-slide__overlay">
        <div class="image-slide__content">
          <h4 class="image-slide__title">{{ slide.title }}</h4>
          <p class="image-slide__description">{{ slide.description }}</p>
          <q-btn
            v-if="slide.buttonText"
            color="white"
            text-color="primary"
            :to="slide.buttonLink"
            @click="handleButtonClick"
          >
            {{ slide.buttonText }}
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CarouselSlide } from '../types';

interface Props {
  slide: CarouselSlide;
}

const props = defineProps<Props>();

const handleButtonClick = () => {
  if (props.slide.buttonAction) {
    props.slide.buttonAction();
  }
};
</script>

<style scoped>
/* ===== DUAL SLIDE ===== */
.dual-slide {
  height: 250px; /* высота карусели */
  margin: 0;
  overflow: hidden; /* ← скрываем выходящее за границы */
}

.dual-slide__content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 2rem;
}

.dual-slide__text {
  max-width: 400px;
}

.dual-slide__title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.dual-slide__description {
  margin: 0 0 1.5rem 0;
  color: #666;
}

/* ПРАВАЯ ЧАСТЬ - картинка растягивается */
.dual-slide__image-container {
  height: 100%;
  overflow: hidden; /* ← обрезаем лишнее */
}

.dual-slide__image {
  width: 100%;
  height: 100%;
  object-fit: fill !important; /* ← РАСТЯГИВАЕМ и обрезаем */
  object-position: center; /* центрируем обрезку */
  display: block;
}

/* ===== IMAGE SLIDE ===== */
.image-slide {
  position: relative;
  width: 100%;
  height: 250px; /* высота карусели */
  overflow: hidden; /* ← скрываем выходящее */
}

.image-slide__image {
  width: 100%;
  height: 100%;
  object-fit: fill !important; /* ← РАСТЯГИВАЕМ на весь слайд */
  object-position: center; /* центрируем обрезку */
}

.image-slide__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-slide__content {
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 2rem;
}

.image-slide__title {
  margin: 0 0 1rem 0;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.image-slide__description {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
</style>