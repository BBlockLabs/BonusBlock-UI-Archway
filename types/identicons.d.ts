declare module "@whi/identicons" {
  export interface RenderOptions {
    seed: string;
    size: number;
    base?: number;
    minDiscs?: number;
    maxDiscs?: number;
    colorRange?: number;
    grayscale?: boolean;
  }

  export interface Disks {
    settings: DiskSettings;
    width: number;
    height: number;
    ratio: number;
    maxSize: number;
    minDiscs: number;
    maxDiscs: number;
    color_range: number;
    bg_radius: number;
    canvas: any;
    dataURL: string;
  }

  export interface DiskSettings {
    seed: string;
    base: number;
    numDiscs: number;
    background_color;
    discMulti: number;
    discSizes: number;
    discPositions: Array<number>;
  }

  export function renderDiscs(options: RenderOptions): Disks;
}
