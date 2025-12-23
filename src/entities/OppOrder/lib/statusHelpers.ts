export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'packing': 'blue-grey',
    'shipping': 'blue',
    'waiting': 'orange',
    'done': 'green',
    'canceled': 'red',
    'in_transit': 'blue',
    'ready_for_pickup': 'teal'
  }

  return statusColors[status] || 'grey'
}

export function getStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    'packing': 'Упаковывается',
    'shipping': 'В доставке',
    'waiting': 'Ожидает в ПВЗ',
    'done': 'Выдан',
    'canceled': 'Отменён',
    'in_transit': 'В пути',
    'ready_for_pickup': 'Готов к выдаче'
  }

  return statusTexts[status] || status
}

export function getDirectionColor(direction: string): string {
  const directionColors: Record<string, string> = {
    'incoming': 'blue',
    'outgoing': 'orange'
  }

  return directionColors[direction] || 'grey'
}

export function getDirectionText(direction: string): string {
  const directionTexts: Record<string, string> = {
    'incoming': 'Входящий',
    'outgoing': 'Исходящий',
    'all': 'Все'
  }

  return directionTexts[direction] || direction
}
