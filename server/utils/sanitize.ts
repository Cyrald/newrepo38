export function sanitizeSearchQuery(query: string | undefined): string {
  if (!query || typeof query !== 'string') {
    return '';
  }
  
  return query
    .trim()
    .slice(0, 200)
    .replace(/[<>]/g, '');
}

export function sanitizeNumericParam(param: string | undefined, defaultValue: number = 0): number {
  if (!param) return defaultValue;
  const num = parseInt(param, 10);
  return isNaN(num) ? defaultValue : Math.max(0, num);
}

export function sanitizeId(id: string | undefined): string | null {
  if (!id || typeof id !== 'string') {
    return null;
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    return null;
  }
  
  return id.slice(0, 100);
}
