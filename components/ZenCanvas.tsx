
import React, { useEffect, useRef, useCallback } from 'react';
import { Particle } from '../types';

interface ZenCanvasProps {
  trailText: string;
}

// Helper to simulate "bleeding" light-ink effect
const drawInkBlur = (ctx: CanvasRenderingContext2D, life: number) => {
  const blurAmount = (1 - life) * 30;
  ctx.shadowColor = `rgba(240, 240, 255, ${life * 0.3})`;
  ctx.shadowBlur = blurAmount + 4;
};

class InkChar implements Particle {
  x: number;
  y: number;
  char: string;
  life: number;
  size: number;
  scale: number;
  rotation: number;
  velocity: { x: number; y: number };
  inkDensity: number;

  constructor(x: number, y: number, char: string) {
    this.x = x;
    this.y = y;
    this.char = char;
    this.life = 1.0;
    this.size = 20 + Math.random() * 70; 
    this.scale = 0.8 + Math.random() * 0.5;
    this.rotation = (Math.random() - 0.5) * 0.6;
    this.velocity = {
      x: (Math.random() - 0.5) * 0.6,
      y: (Math.random() - 0.5) * 0.4 - 0.2,
    };
    this.inkDensity = Math.random() > 0.5 ? 0.95 : 0.7;
  }

  update() {
    this.scale += 0.005; 
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.life -= 0.012; // Even faster fade for white ink
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.scale(this.scale, this.scale);
    drawInkBlur(ctx, this.life);
    ctx.font = `${this.size}px 'Ma Shan Zheng', 'ZCOOL XiaoWei', serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Use white/silver tones
    ctx.fillStyle = `rgba(240, 242, 255, ${this.life * this.inkDensity})`;
    ctx.fillText(this.char, 0, 0);
    ctx.restore();
  }
}

class InkFlower implements Particle {
  x: number;
  y: number;
  life: number = 1.0;
  rotation: number = Math.random() * Math.PI * 2;
  size: number = 18 + Math.random() * 30;
  petals: number = 5 + Math.floor(Math.random() * 3);

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update() {
    this.life -= 0.015;
    this.size += 0.15;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    drawInkBlur(ctx, this.life);
    
    for (let i = 0; i < this.petals; i++) {
      ctx.beginPath();
      ctx.rotate((Math.PI * 2) / this.petals);
      ctx.ellipse(this.size * 0.8, 0, this.size * 0.7, this.size * 0.45, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 230, 255, ${this.life * 0.25})`;
      ctx.fill();
    }
    
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.life * 0.7})`;
    ctx.fill();
    ctx.restore();
  }
}

class InkLeaf implements Particle {
  x: number;
  y: number;
  life: number = 1.0;
  rotation: number = Math.random() * Math.PI * 2;
  length: number = 40 + Math.random() * 50;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  update() {
    this.life -= 0.018;
    this.x += Math.sin(this.rotation) * 0.8;
    this.y += Math.cos(this.rotation) * 0.8;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    drawInkBlur(ctx, this.life);
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(this.length * 0.4, -this.length * 0.15, this.length, 0);
    ctx.quadraticCurveTo(this.length * 0.4, this.length * 0.15, 0, 0);
    ctx.fillStyle = `rgba(200, 255, 220, ${this.life * 0.35})`;
    ctx.fill();
    ctx.restore();
  }
}

class InkSplat implements Particle {
  x: number;
  y: number;
  life: number;
  radius: number;
  color: string;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.life = 1.0;
    this.radius = 1 + Math.random() * 5;
    this.color = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.15})`;
  }

  update() {
    this.life -= 0.025;
    this.radius += 0.4;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color.replace(/[\d.]+\)$/, `${this.life * 0.2})`);
    ctx.fill();
    ctx.restore();
  }
}

const ZenCanvas: React.FC<ZenCanvasProps> = ({ trailText }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const charIndexRef = useRef(0);
  const lastMousePos = useRef({ x: -1000, y: -1000 });
  const textChars = trailText.split('').filter(c => c.trim().length > 0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let animationFrame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX: x, clientY: y } = e;
    const dist = Math.hypot(x - lastMousePos.current.x, y - lastMousePos.current.y);

    if (dist > 35) { 
      const char = textChars[charIndexRef.current % textChars.length];
      particlesRef.current.push(new InkChar(x, y, char));
      
      const rand = Math.random();
      if (rand > 0.90) {
        particlesRef.current.push(new InkFlower(x, y));
      } else if (rand > 0.80) {
        particlesRef.current.push(new InkLeaf(x, y));
      }

      if (Math.random() > 0.5) {
        for (let i = 0; i < 2; i++) {
          particlesRef.current.push(new InkSplat(
            x + (Math.random() - 0.5) * 70,
            y + (Math.random() - 0.5) * 70
          ));
        }
      }

      charIndexRef.current++;
      lastMousePos.current = { x, y };
    }
  }, [textChars]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      className="fixed inset-0 z-0 touch-none"
    />
  );
};

export default ZenCanvas;
