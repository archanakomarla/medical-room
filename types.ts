
export enum AppState {
  CAMERA_VIEW,
  DESIGN_VIEW,
}

export interface PredefinedObject {
  id: string;
  name: string;
  src: string;
  width: number;
  height: number;
}

export interface PlacedObject extends PredefinedObject {
  x: number;
  y: number;
  rotation: number;
}
