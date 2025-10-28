import type { PredefinedObject } from './types';

// Simple SVG placeholders converted to base64 data URLs
const createPlaceholder = (width: number, height: number, color: string, name: string) => {
    const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="${width}" height="${height}" rx="8" fill="${color}" fill-opacity="0.3"/>
<rect x="0.5" y="0.5" width="${width-1}" height="${height-1}" rx="7.5" stroke="${color}" stroke-opacity="0.8"/>
<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="14" fill="${color}">${name}</text>
</svg>`;
    return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export const PREDEFINED_OBJECTS: PredefinedObject[] = [
  {
    id: 'bed_1',
    name: 'Hospital Bed',
    // STEP 2: Replace this URL with the direct link to YOUR hospital bed image
    src: 'public/bed_1.png',
    width: 200, // You can adjust this
    height: 114, // You can adjust this
  },
  {
    id: 'trolley_1',
    name: 'Medical Trolley',
    // STEP 2: Replace this URL with the direct link to YOUR trolley image
    src: 'public/trolley_1.png',
    width: 100, // You can adjust this
    height: 100, // You can adjust this
  },
  {
    id: 'screen_1',
    name: 'Hospital Screen',
    src: createPlaceholder(150, 180, '#4ade80', 'Screen'),
    width: 150,
    height: 180,
  },
  {
    id: 'blinds_1',
    name: 'Window Blinds',
    src: createPlaceholder(120, 150, '#facc15', 'Blinds'),
    width: 120,
    height: 150,
  },
];
