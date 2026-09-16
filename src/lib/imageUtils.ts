export function compressImage(file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function generatePlaceholderImage(category: string, color: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d')!;
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 400, 300);
  gradient.addColorStop(0, color + '40');
  gradient.addColorStop(1, color + '80');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 300);
  
  // Category text
  ctx.fillStyle = color;
  ctx.font = 'bold 24px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(category, 200, 150);
  
  return canvas.toDataURL('image/jpeg', 0.7);
}

export function getImageSizeKB(base64: string): number {
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  const base64Length = base64.split(',')[1]?.length || base64.length;
  return Math.round((base64Length * 3 / 4 - padding) / 1024);
}
