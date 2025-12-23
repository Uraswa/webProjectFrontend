//shared/utils/parseCharacteristics.ts -->
export function parseProductCharacteristics(characteristics: any): Record<string, any> {
    if (!characteristics) return {}
    
    if (typeof characteristics === 'object') {
      return characteristics
    }
    
    if (typeof characteristics === 'string') {
      try {
        const parsed = JSON.parse(characteristics)
        return parsed || {}
      } catch {
        return {}
      }
    }
    
    return {}
  }