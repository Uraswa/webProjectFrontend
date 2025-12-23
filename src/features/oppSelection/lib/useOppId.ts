/**
 * Utility функция для работы с выбранным ПВЗ (oppId)
 * Использует localStorage для хранения выбранного ПВЗ
 */

export function useOppId() {
  const STORAGE_KEY = 'selectedOppId'

  const getOppId = (): number | null => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? parseInt(stored, 10) : null
  }

  const setOppId = (oppId: number): void => {
    localStorage.setItem(STORAGE_KEY, oppId.toString())
  }

  const clearOppId = (): void => {
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    getOppId,
    setOppId,
    clearOppId
  }
}
