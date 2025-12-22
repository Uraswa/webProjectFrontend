// src/entities/catalog/config/categories.js
export const CATEGORIES_CONFIG = [
  {
    id: 'clothes',
    name: 'Одежда',
    groups: [
      {
        id: 'women',
        name: 'Женская одежда',
        subcategories: [
          { id: 'dresses', name: 'Платья', route: '/catalog/clothes/women/dresses' },
          { id: 'skirts', name: 'Юбки', route: '/catalog/clothes/women/skirts' },
          { id: 'blouses', name: 'Блузки', route: '/catalog/clothes/women/blouses' },
          { id: 'jackets-women', name: 'Куртки', route: '/catalog/clothes/women/jackets' }
        ]
      },
      {
        id: 'men',
        name: 'Мужская одежда',
        subcategories: [
          { id: 'shirts', name: 'Рубашки', route: '/catalog/clothes/men/shirts' },
          { id: 'pants', name: 'Брюки', route: '/catalog/clothes/men/pants' },
          { id: 't-shirts', name: 'Футболки', route: '/catalog/clothes/men/t-shirts' },
          { id: 'underwear', name: 'Нижнее белье', route: '/catalog/clothes/men/underwear' }
        ]
      },
      {
        id: 'children',
        name: 'Детская одежда',
        subcategories: [
            { id: 'shorts', name: 'Шорты', route: '/catalog/clothes/children/shorts' },
            { id: 't-shirts', name: 'Футболки', route: '/catalog/clothes/children/t-shirts' },
            { id: 'caps', name: 'Кепки', route: '/catalog/clothes/children/caps' },
            { id: 'boots', name: 'Ботинки', route: '/catalog/clothes/children/boots' }
        ]
      },
      {
        id: 'uniform',
        name: 'Униформа и рабочая одежда',
        subcategories: [
            { id: 'corporate', name: 'Корпоративная униформа', route: '/catalog/clothes/uniform/corporate' },
            { id: 'security', name: 'Одежда для охраны', route: '/catalog/clothes/uniform/security' },
            { id: 'industrial', name: 'Промышленная одежда', route: '/catalog/clothes/uniform/industrial' },
            { id: 'overalls', name: 'Комбинезоны', route: '/catalog/clothes/uniform/overalls' },
            { id: 'jackets-work', name: 'Рабочие куртки', route: '/catalog/clothes/uniform/jackets' }
        ]
      },
    ]
  },
  {
    id: 'electronics',
    name: 'Электроника',
    groups: [
      {
        id: 'computers',
        name: 'Компьютеры',
        subcategories: [
          { id: 'laptops', name: 'Ноутбуки', route: '/catalog/electronics/computers/laptops' },
          { id: 'pc', name: 'Настольные ПК', route: '/catalog/electronics/computers/pc' }
        ]
      },
      {
        id: 'mobile',
        name: 'Смартфоны',
        subcategories: [
          { id: 'smartphones', name: 'Смартфоны', route: '/catalog/electronics/mobile/smartphones' },
          { id: 'tablets', name: 'Планшеты', route: '/catalog/electronics/mobile/tablets' }
        ]
      }
    ]
  },
  {
    id: 'books',
    name: 'Книги',
    groups: [
      {
        id: 'fiction',
        name: 'Художественная',
        subcategories: [
          { id: 'novels', name: 'Романы', route: '/catalog/books/fiction/novels' },
          { id: 'detective', name: 'Детективы', route: '/catalog/books/fiction/detective' }
        ]
      },
      {
        id: 'non-fiction',
        name: 'Нехудожественная',
        subcategories: [
          { id: 'business', name: 'Бизнес', route: '/catalog/books/non-fiction/business' },
          { id: 'science', name: 'Наука', route: '/catalog/books/non-fiction/science' }
        ]
      }
    ]
  }
]

// Хелперы (ДОБАВЬ ЭТИ ЭКСПОРТЫ!)
export const getCategoryById = (id) => CATEGORIES_CONFIG.find(cat => cat.id === id)

export const getDefaultCategory = () => CATEGORIES_CONFIG[0]

export const getAllCategories = () => CATEGORIES_CONFIG.map(cat => ({
  id: cat.id,
  name: cat.name
}))

export const getTotalSubcategories = (category) => {
  if (!category?.groups) return 0
  return category.groups.reduce((total, group) => {
    return total + (group.subcategories?.length || 0)
  }, 0)
}