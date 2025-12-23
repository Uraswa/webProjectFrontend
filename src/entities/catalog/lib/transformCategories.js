// src/entities/catalog/lib/transformCategories.js

/**
 * Преобразует плоский список категорий с бэкенда в иерархическую структуру
 *
 * @param {Array} flatCategories - Плоский список категорий от сервера
 * @returns {Object} Иерархическая структура категорий
 *
 * Входной формат:
 * [
 *   { category_id: 1, parent_category_id: null, name: "Одежда" },
 *   { category_id: 2, parent_category_id: 1, name: "Мужская одежда" },
 *   { category_id: 3, parent_category_id: 2, name: "Рубашки" }
 * ]
 *
 * Выходной формат:
 * {
 *   1: {
 *     id: 1,
 *     name: "Одежда",
 *     groups: [
 *       {
 *         id: 2,
 *         name: "Мужская одежда",
 *         subcategories: [
 *           { id: 3, name: "Рубашки" }
 *         ]
 *       }
 *     ]
 *   }
 * }
 */
export function transformCategoriesToHierarchy(flatCategories) {
    if (!flatCategories || !Array.isArray(flatCategories)) {
      return {}
    }
  
    // Создаем Map для быстрого доступа к категориям по ID
    const categoriesMap = new Map()
    flatCategories.forEach(cat => {
      categoriesMap.set(cat.category_id, {
        id: cat.category_id,
        parentId: cat.parent_category_id,
        name: cat.name,
        children: []
      })
    })
  
    // Категории первого уровня (parent_category_id === null)
    const rootCategories = {}
  
    // Группируем категории по уровням
    flatCategories.forEach(cat => {
      const category = categoriesMap.get(cat.category_id)
  
      if (cat.parent_category_id === null) {
        // Это категория первого уровня
        rootCategories[cat.category_id] = {
          id: cat.category_id,
          name: cat.name,
          groups: []
        }
      } else {
        // Это дочерняя категория - добавляем в children родителя
        const parent = categoriesMap.get(cat.parent_category_id)
        if (parent) {
          parent.children.push(category)
        }
      }
    })
  
    // Теперь построим финальную структуру
    Object.values(rootCategories).forEach(rootCategory => {
      const rootCategoryData = categoriesMap.get(rootCategory.id)
  
      // Дочерние элементы корневой категории - это группы (второй уровень)
      rootCategoryData.children.forEach(group => {
        const groupObj = {
          id: group.id,
          name: group.name,
          subcategories: []
        }
  
        // Дочерние элементы группы - это подкатегории (третий уровень)
        group.children.forEach(subcategory => {
          groupObj.subcategories.push({
            id: subcategory.id,
            name: subcategory.name,
            route: `/search?category_id=${subcategory.id}`
          })
        })
  
        rootCategory.groups.push(groupObj)
      })
    })
  
    return rootCategories
  }
  
  /**
   * Преобразует иерархическую структуру категорий в массив для совместимости с существующим кодом
   *
   * @param {Object} hierarchyObject - Объект с категориями (результат transformCategoriesToHierarchy)
   * @returns {Array} Массив категорий
   */
  export function hierarchyToArray(hierarchyObject) {
    return Object.values(hierarchyObject)
  }
  
  /**
   * Получает категорию по ID из иерархической структуры
   *
   * @param {Object} hierarchyObject - Объект с категориями
   * @param {number|string} categoryId - ID категории
   * @returns {Object|null} Категория или null
   */
  export function getCategoryFromHierarchy(hierarchyObject, categoryId) {
    return hierarchyObject[categoryId] || null
  }
  
  /**
   * Получает первую категорию из иерархии (для использования по умолчанию)
   *
   * @param {Object} hierarchyObject - Объект с категориями
   * @returns {Object|null} Первая категория или null
   */
  export function getFirstCategory(hierarchyObject) {
    const categories = Object.values(hierarchyObject)
    return categories.length > 0 ? categories[0] : null
  }
  
  /**
   * Подсчитывает общее количество подкатегорий в категории
   *
   * @param {Object} category - Категория
   * @returns {number} Количество подкатегорий
   */
  export function getTotalSubcategories(category) {
    if (!category?.groups) return 0
    return category.groups.reduce((total, group) => {
      return total + (group.subcategories?.length || 0)
    }, 0)
  }
  