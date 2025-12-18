# Структура проекта webProjectFrontend

## Описание
Quasar Framework проект (Vue 3 + Vite) для веб-приложения электронной коммерции.

## Технологический стек
- **Framework**: Quasar Framework v2.16.0
- **Frontend**: Vue 3.5.22
- **Build Tool**: Vite (через @quasar/app-vite v2.1.0)
- **Router**: Vue Router v4
- **HTTP Client**: Axios v1.2.1
- **i18n**: Vue I18n v11.0.0
- **Styling**: Quasar Components + PostCSS + Autoprefixer
- **Auth**: JWT (jwt-decode v4.0.0)

## Структура директорий

```
webProjectFrontend/
├── .git/                          # Git репозиторий
├── .idea/                         # WebStorm IDE настройки
├── .quasar/                       # Quasar framework генерируемые файлы
│   ├── feature-flags.d.ts
│   ├── quasar.d.ts
│   └── tsconfig.json
├── .vscode/                       # VS Code настройки
│   ├── extensions.json
│   └── settings.json
├── node_modules/                  # Зависимости проекта (не коммитится)
│
├── public/                        # Статические файлы
│   ├── icons/                     # Иконки приложения
│   ├── ad1.png                    # Рекламное изображение 1
│   ├── ad2.png                    # Рекламное изображение 2
│   ├── ad3.png                    # Рекламное изображение 3
│   ├── favicon.ico                # Favicon
│   ├── mushik.png                 # Изображение
│   ├── Screenshot_4.png           # Скриншот
│   ├── statya_sbyt_tovarov.jpg    # Статья о сбыте товаров
│   └── TestPlanTemplate_IEEE_829-1998.pdf  # Шаблон тест-плана
│
├── src/                           # Исходный код (FSD архитектура)
│   ├── App.vue                    # Корневой компонент приложения
│   │
│   ├── app/                       # Слой приложения
│   │   └── MainLayout/
│   │       └── ui/
│   │           └── MainLayout.vue # Главный Layout приложения
│   │
│   ├── assets/                    # Ресурсы (изображения, шрифты)
│   │   └── quasar-logo-vertical.svg
│   │
│   ├── boot/                      # Quasar boot файлы (инициализация)
│   │   ├── .gitkeep
│   │   ├── axios.js               # Настройка Axios (HTTP клиент)
│   │   └── i18n.js                # Настройка интернационализации
│   │
│   ├── entities/                  # Слой бизнес-сущностей
│   │   ├── catalog/
│   │   │   └── config/
│   │   │       └── categories.js  # Конфигурация категорий каталога
│   │   └── Product/
│   │       └── models/
│   │           └── Product.ts     # TypeScript модель продукта
│   │
│   ├── features/                  # Слой фич/возможностей
│   │   ├── popularProducts/       # Фича популярных товаров
│   │   │   ├── api/
│   │   │   │   └── popularProductsApi.ts  # API для популярных товаров
│   │   │   └── ui/
│   │   │       └── PopularProductsGrid.vue # Сетка популярных товаров
│   │   │
│   │   └── productSearch/         # Фича поиска товаров
│   │       ├── api/
│   │       │   └── productSearchApi.ts    # API поиска
│   │       ├── lib/
│   │       │   └── useSearchFilters.ts    # Хук для фильтров поиска
│   │       ├── model/
│   │       │   └── types.ts               # TypeScript типы поиска
│   │       └── ui/
│   │           └── productSearchInput.vue # Поле ввода поиска
│   │
│   ├── i18n/                      # Интернационализация (локализация)
│   │   ├── index.js               # Главная конфигурация i18n
│   │   └── en-US/
│   │       └── index.js           # Английские переводы
│   │
│   ├── pages/                     # Страницы приложения
│   │   ├── CatalogPage.vue        # Страница каталога
│   │   ├── ErrorNotFound.vue      # 404 страница
│   │   ├── IndexPage.vue          # Главная страница
│   │   │
│   │   ├── Auth/                  # Страницы аутентификации
│   │   │   ├── AccountActivationPage.vue    # Активация аккаунта
│   │   │   ├── ChangePasswordPage.vue       # Смена пароля
│   │   │   ├── ForgotPasswordPage.vue       # Восстановление пароля
│   │   │   ├── LoginPage.vue                # Вход в систему
│   │   │   ├── MailSentPage.vue             # Письмо отправлено
│   │   │   └── RegistrationPage.vue         # Регистрация
│   │   │
│   │   └── DEMO/                  # Демо страницы (в разработке)
│   │       ├── CartPage.vue       # Корзина покупок
│   │       ├── CheckoutPage.vue   # Оформление заказа
│   │       ├── OrderDonePage.vue  # Заказ выполнен
│   │       ├── OrderPage.vue      # Детали заказа
│   │       ├── OrdersPage.vue     # Список заказов
│   │       ├── ProductFilterPage.vue  # Фильтрация товаров
│   │       ├── ProductPage.vue    # Карточка товара
│   │       └── LkSeller/          # Личный кабинет продавца
│   │           ├── OrdersList.vue     # Список заказов продавца
│   │           └── ProductsList.vue   # Список товаров продавца
│   │
│   ├── router/                    # Роутинг приложения
│   │   ├── index.js               # Конфигурация Vue Router
│   │   └── routes.js              # Определение маршрутов
│   │
│   ├── shared/                    # Слой shared (переиспользуемый код)
│   │   ├── api/
│   │   │   └── Api.js             # Общий API клиент (базовая настройка)
│   │   ├── i18n/                  # Общие переводы
│   │   │   ├── index.js
│   │   │   └── en-US/
│   │   │       └── index.js
│   │   └── ui/                    # Переиспользуемые UI компоненты
│   │       ├── CenteredFormPage.vue  # Шаблон для форм по центру
│   │       └── EssentialLink.vue     # Переиспользуемая ссылка
│   │
│   └── widgets/                   # Слой виджетов (сложные компоненты)
│       ├── AdCarousel/            # Рекламная карусель
│       │   ├── api/
│       │   │   └── adCarousel.api.ts     # API для карусели
│       │   ├── types/
│       │   │   └── index.ts              # TypeScript типы
│       │   └── ui/
│       │       ├── AdCarousel.vue        # Компонент карусели
│       │       └── SlideRenderer.vue     # Рендер слайда
│       │
│       ├── CatalogSideBar/        # Боковая панель каталога
│       │   └── ui/
│       │       └── CatalogSideBar.vue
│       │
│       ├── DemoProductsGrid/      # Сетка демо товаров
│       │   └── ui/
│       │       └── DemoProductsGrid.vue
│       │
│       ├── Footer/                # Футер сайта
│       │   └── ui/
│       │       └── Footer.vue
│       │
│       ├── Header/                # Хедер сайта
│       │   └── ui/
│       │       └── Header.vue
│       │
│       ├── LkSellerLayout/        # Лейаут личного кабинета продавца
│       │   └── ui/
│       │       └── LkSellerLayout.vue
│       │
│       ├── ProductCard/           # Карточка товара
│       │   └── ui/
│       │       └── ProductCard.vue
│       │
│       └── SubcategoryList/       # Список подкатегорий
│           └── ui/
│               └── SubcategoryList.vue
│
├── .editorconfig                  # Конфигурация редактора
├── .gitignore                     # Git ignore файл
├── .npmrc                         # NPM конфигурация
├── index.html                     # HTML точка входа
├── jsconfig.json                  # JavaScript конфигурация
├── package.json                   # Зависимости и скрипты проекта
├── package-lock.json              # Lockfile для зависимостей
├── postcss.config.js              # PostCSS конфигурация
├── quasar.config.js               # Quasar framework конфигурация
└── README.md                      # Документация проекта
```

## Архитектура: Feature-Sliced Design (FSD)

Проект использует **Feature-Sliced Design** методологию для организации кода.

### Слои (Layers):
1. **app** - Инициализация приложения, глобальные стили и провайдеры
2. **pages** - Композиция страниц из сущностей и фич
3. **widgets** - Композитные блоки (составные компоненты)
4. **features** - Обработка пользовательских сценариев
5. **entities** - Бизнес-сущности
6. **shared** - Переиспользуемый код без привязки к бизнес-логике

### Сегменты (Segments) внутри слоев:
- **ui** - UI компоненты (Vue компоненты)
- **api** - Работа с API
- **model** - Бизнес-логика и типы
- **lib** - Вспомогательные утилиты
- **config** - Конфигурация
- **types** - TypeScript типы

## Основные функции приложения

### Реализованные модули:
- Аутентификация и авторизация (JWT)
- Система регистрации пользователей
- Восстановление пароля
- Активация аккаунта
- Каталог товаров с категориями
- Поиск товаров с фильтрацией
- Отображение популярных товаров
- Рекламная карусель (AdCarousel)
- Интернационализация (i18n)
- Адаптивный дизайн (Quasar responsive)

### В разработке (DEMO):
- Корзина покупок (CartPage)
- Оформление заказа (CheckoutPage)
- Личный кабинет продавца (LkSeller)
- Управление заказами (OrdersPage)
- Детальная страница товара (ProductPage)
- Расширенная фильтрация товаров (ProductFilterPage)

## Скрипты package.json

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки (hot-reload)
npm run dev
# или
quasar dev

# Сборка для продакшена
npm run build
# или
quasar build

# Постустановка (подготовка Quasar)
npm run postinstall
```

## Требования к окружению
- **Node.js**: ^28 || ^26 || ^24 || ^22 || ^20
- **NPM**: >= 6.13.4
- **Yarn**: >= 1.21.1 (опционально)

## Git статус

- **Текущая ветка**: master
- **Основная ветка**: master
- **Статус**: clean (нет незакоммиченных изменений)

### Последние коммиты:
1. `f9700ff` - Merge pull request #1 from Uraswa/feature/fsd-carousel-search-popular
2. `94a4d17` - merge popular-products
3. `c9ff3db` - product-search
4. `a6870f9` - merge FSD
5. `8219f27` - update ProductFilterPage

## Особенности проекта

### TypeScript
Проект использует смешанный подход: часть файлов на JavaScript (.js), часть на TypeScript (.ts), с настройкой через jsconfig.json.

### Интернационализация
Настроена поддержка мультиязычности через vue-i18n с английским языком (en-US) как основным.

### API клиент
Используется Axios для HTTP запросов с централизованной настройкой в boot/axios.js и shared/api/Api.js.

## Автор
Uraswa <33593469+Uraswa@users.noreply.github.com>

---

Последнее обновление: 2025-12-18
