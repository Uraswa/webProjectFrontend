// shared/utils/parsePhotos.ts
export function parseProductPhotos(photos: any): string[] {
    console.log('🔍 [parseProductPhotos] Input:', {
      value: photos,
      type: typeof photos,
      isArray: Array.isArray(photos),
      length: photos?.length,
      stringPreview: typeof photos === 'string' ? photos.substring(0, 100) : 'N/A'
    });
    
    // Если уже массив
    if (Array.isArray(photos)) {
      console.log('✅ [parseProductPhotos] Already array, returning:', photos);
      return photos;
    }
    
    // Если строка
    if (typeof photos === 'string') {
      try {
        let cleanStr = photos.trim();
        console.log('📝 [parseProductPhotos] After trim:', cleanStr);
        
        // Убираем внешние одинарные кавычки
        if (cleanStr.startsWith("'") && cleanStr.endsWith("'")) {
          cleanStr = cleanStr.slice(1, -1);
          console.log('✂️ [parseProductPhotos] After removing quotes:', cleanStr);
        }
        
        // Парсим JSON
        console.log('🔄 [parseProductPhotos] Attempting JSON.parse...');
        const parsed = JSON.parse(cleanStr);
        console.log('✅ [parseProductPhotos] Parsed successfully:', parsed);
        
        // Убедимся что это массив
        const result = Array.isArray(parsed) ? parsed : [];
        console.log('🎯 [parseProductPhotos] Final result:', result);
        return result;
        
      } catch (error) {
        console.error('❌ [parseProductPhotos] Failed to parse:', {
          original: photos,
          error: error.message,
          stack: error.stack
        });
        return [];
      }
    }
    
    console.log('⚠️ [parseProductPhotos] Unknown type, returning empty array');
    return [];
  }