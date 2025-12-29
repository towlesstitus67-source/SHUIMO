
export interface Particle {
  update(): void;
  draw(ctx: CanvasRenderingContext2D): void;
  life: number;
}

export interface ZenQuote {
  text: string;
  source?: string;
}

export enum ZenMode {
  POETRY = 'POETRY',
  PHILOSOPHY = 'PHILOSOPHY',
  KOAN = 'KOAN'
}
