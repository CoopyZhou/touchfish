import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Fish, Bubble, Jellyfish, InteractionMode, SimulationConfig, Vector2D } from '../types';
import { FISH_COLORS, JELLYFISH_COLORS, VISUAL_RANGE, PROTECTED_RANGE, MATCHING_FACTOR, CENTERING_FACTOR, AVOID_FACTOR, TURN_FACTOR, MOUSE_INFLUENCE_RANGE, MOUSE_ATTRACT_FACTOR, MOUSE_REPEL_FACTOR } from '../constants';

interface UnderwaterCanvasProps {
  config: SimulationConfig;
  onCanvasClick?: (x: number, y: number) => void;
}

const UnderwaterCanvas: React.FC<UnderwaterCanvasProps> = ({ config, onCanvasClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State refs to avoid closure staleness in animation loop
  const fishRef = useRef<Fish[]>([]);
  const bubblesRef = useRef<Bubble[]>([]);
  const jellyfishRef = useRef<Jellyfish[]>([]);
  const mouseRef = useRef<Vector2D>({ x: -1000, y: -1000 });
  const timeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  // --- Initialization ---

  const initFish = useCallback((count: number, width: number, height: number) => {
    const newFish: Fish[] = [];
    for (let i = 0; i < count; i++) {
      newFish.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.baseSpeed,
        vy: (Math.random() - 0.5) * config.baseSpeed,
        color: FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)],
        size: 4 + Math.random() * 4,
        speed: config.baseSpeed * (0.8 + Math.random() * 0.4),
        angle: 0,
        tailPhase: Math.random() * Math.PI * 2,
      });
    }
    fishRef.current = newFish;
  }, [config.baseSpeed]);

  const initJellyfish = useCallback((count: number, width: number, height: number) => {
    const newJellies: Jellyfish[] = [];
    for (let i = 0; i < count; i++) {
      newJellies.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 0.5 + 0.2), // Always drift up slowly
        size: 20 + Math.random() * 30,
        tentacleOffset: Math.random() * 100,
        color: JELLYFISH_COLORS[Math.floor(Math.random() * JELLYFISH_COLORS.length)],
      });
    }
    jellyfishRef.current = newJellies;
  }, []);

  // --- Simulation Logic (Boids) ---

  const updateFish = (width: number, height: number) => {
    const fish = fishRef.current;
    
    for (let i = 0; i < fish.length; i++) {
      const f = fish[i];
      
      let closeDx = 0, closeDy = 0;
      let xAvg = 0, yAvg = 0;
      let vxAvg = 0, vyAvg = 0;
      let neighbors = 0;

      // Check interaction with other fish
      for (let j = 0; j < fish.length; j++) {
        if (i === j) continue;
        const other = fish[j];
        const dx = f.x - other.x;
        const dy = f.y - other.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < VISUAL_RANGE * VISUAL_RANGE) {
          if (distSq < PROTECTED_RANGE * PROTECTED_RANGE) {
            closeDx += dx;
            closeDy += dy;
          } else {
            xAvg += other.x;
            yAvg += other.y;
            vxAvg += other.vx;
            vyAvg += other.vy;
            neighbors++;
          }
        }
      }

      // 1. Separation
      f.vx += closeDx * AVOID_FACTOR;
      f.vy += closeDy * AVOID_FACTOR;

      // 2. Alignment & 3. Cohesion
      if (neighbors > 0) {
        xAvg /= neighbors;
        yAvg /= neighbors;
        vxAvg /= neighbors;
        vyAvg /= neighbors;

        f.vx += (xAvg - f.x) * CENTERING_FACTOR;
        f.vy += (yAvg - f.y) * CENTERING_FACTOR;

        f.vx += (vxAvg - f.vx) * MATCHING_FACTOR;
        f.vy += (vyAvg - f.vy) * MATCHING_FACTOR;
      }

      // 4. Mouse Interaction
      const mDx = f.x - mouseRef.current.x;
      const mDy = f.y - mouseRef.current.y;
      const mDistSq = mDx * mDx + mDy * mDy;

      if (mDistSq < MOUSE_INFLUENCE_RANGE * MOUSE_INFLUENCE_RANGE) {
        if (config.interactionMode === InteractionMode.REPEL) {
          // Flee
          f.vx += (mDx / Math.sqrt(mDistSq)) * MOUSE_REPEL_FACTOR * 100;
          f.vy += (mDy / Math.sqrt(mDistSq)) * MOUSE_REPEL_FACTOR * 100;
        } else if (config.interactionMode === InteractionMode.ATTRACT) {
          // Seek
          f.vx -= (mDx / Math.sqrt(mDistSq)) * MOUSE_ATTRACT_FACTOR * 100;
          f.vy -= (mDy / Math.sqrt(mDistSq)) * MOUSE_ATTRACT_FACTOR * 100;
        }
      }

      // 5. Screen Edges (Soft Turn)
      const margin = 100;
      if (f.x < margin) f.vx += TURN_FACTOR;
      if (f.x > width - margin) f.vx -= TURN_FACTOR;
      if (f.y < margin) f.vy += TURN_FACTOR;
      if (f.y > height - margin) f.vy -= TURN_FACTOR;

      // Limit Speed
      const speed = Math.sqrt(f.vx * f.vx + f.vy * f.vy);
      if (speed > f.speed * 2) {
        f.vx = (f.vx / speed) * f.speed * 2;
        f.vy = (f.vy / speed) * f.speed * 2;
      } else if (speed < f.speed * 0.5) {
         // Prevent stalling
         f.vx = (f.vx / speed) * f.speed * 0.5;
         f.vy = (f.vy / speed) * f.speed * 0.5;
      }

      // Move
      f.x += f.vx;
      f.y += f.vy;

      // Update Visuals
      f.angle = Math.atan2(f.vy, f.vx);
      f.tailPhase += 0.2 + (speed / 10);
    }
  };

  const updateBubbles = (height: number) => {
    for (let i = bubblesRef.current.length - 1; i >= 0; i--) {
      const b = bubblesRef.current[i];
      b.y += b.vy;
      b.x += Math.sin(b.y * 0.05) * 0.5; // Wiggle
      
      // Remove if off top
      if (b.y < -50) {
        bubblesRef.current.splice(i, 1);
      }
    }
  };

  const updateJellyfish = (width: number, height: number) => {
    jellyfishRef.current.forEach(j => {
      j.y += j.vy;
      // Drift horizontally with sine wave
      j.x += Math.sin(timeRef.current * 0.002 + j.id) * 0.2;

      // Wrap vertically
      if (j.y < -100) j.y = height + 100;
      
      // Wrap horizontally
      if (j.x < -50) j.x = width + 50;
      if (j.x > width + 50) j.x = -50;
    });
  };

  // --- Rendering ---

  const drawFish = (ctx: CanvasRenderingContext2D) => {
    fishRef.current.forEach(f => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);

      // Body
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, f.size * 2, f.size, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(f.size, -f.size * 0.3, f.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(f.size + 1, -f.size * 0.3, f.size * 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Tail
      const tailWag = Math.sin(f.tailPhase) * (Math.PI / 8);
      ctx.translate(-f.size * 1.5, 0);
      ctx.rotate(tailWag);
      ctx.fillStyle = f.color; // slightly darker?
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-f.size * 1.5, -f.size);
      ctx.lineTo(-f.size * 1.5, f.size);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });
  };

  const drawJellyfish = (ctx: CanvasRenderingContext2D) => {
    jellyfishRef.current.forEach(j => {
      ctx.save();
      ctx.translate(j.x, j.y);
      
      // Pulse size
      const pulse = Math.sin(timeRef.current * 0.005 + j.tentacleOffset) * 0.05 + 1;
      ctx.scale(pulse, pulse);

      // Head
      ctx.fillStyle = j.color;
      ctx.beginPath();
      ctx.arc(0, 0, j.size, Math.PI, 0);
      // Bezier bottom of head
      ctx.bezierCurveTo(j.size, j.size * 0.5, -j.size, j.size * 0.5, -j.size, 0);
      ctx.fill();
      
      // Tentacles
      ctx.strokeStyle = j.color;
      ctx.lineWidth = 2;
      const tentacleCount = 6;
      for(let i=0; i<tentacleCount; i++) {
        const xOff = (i - tentacleCount/2 + 0.5) * (j.size / 2);
        ctx.beginPath();
        ctx.moveTo(xOff, 0);
        
        // Wavy line
        const wave = Math.sin(timeRef.current * 0.01 + i + j.tentacleOffset) * 10;
        ctx.quadraticCurveTo(xOff + wave, j.size * 1.5, xOff - wave, j.size * 3);
        ctx.stroke();
      }

      ctx.restore();
    });
  };

  const drawBubbles = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    bubblesRef.current.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fill();
      // Shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(b.x - b.radius*0.3, b.y - b.radius*0.3, b.radius*0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; // reset
    });
  };

  const drawLightRays = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.globalCompositeOperation = 'overlay'; // Blend mode for light
    
    // Create gradient rays
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    
    // Animated sliding rays
    const shift = (timeRef.current * 0.05) % 200;
    
    ctx.translate(-200 + shift, 0);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(100, height);
    ctx.lineTo(300, height);
    ctx.lineTo(200, 0);
    ctx.fill();

    ctx.translate(400, 0);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-50, height);
    ctx.lineTo(250, height);
    ctx.lineTo(300, 0);
    ctx.fill();

    ctx.translate(500, 0);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(50, height);
    ctx.lineTo(350, height);
    ctx.lineTo(250, 0);
    ctx.fill();

    ctx.restore();
  };

  // --- Main Loop ---

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Update Physics
    updateFish(width, height);
    updateBubbles(height);
    updateJellyfish(width, height);
    timeRef.current += 1;

    // Draw Background Gradient (if not done in CSS, but CSS is faster for static bg)
    // We rely on parent container CSS for base gradient, but let's add a "deep water" overlay
    // No, let's keep it transparent to use CSS gradient efficiently.

    // Draw Entities
    // Order matters for layering
    drawJellyfish(ctx); // Back
    drawFish(ctx);      // Middle
    drawBubbles(ctx);   // Front
    drawLightRays(ctx, width, height); // Top Overlay

    animationFrameRef.current = requestAnimationFrame(render);
  }, [config.interactionMode]); // Re-create render if major config changes (though usually refs handle dynamic values)

  // --- Effects ---

  // Resize Handler
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        canvasRef.current.width = clientWidth;
        canvasRef.current.height = clientHeight;
        
        // Re-init if empty
        if (fishRef.current.length === 0) {
            initFish(config.fishCount, clientWidth, clientHeight);
            initJellyfish(config.jellyfishCount, clientWidth, clientHeight);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial size

    return () => window.removeEventListener('resize', handleResize);
  }, [initFish, initJellyfish, config.fishCount, config.jellyfishCount]);

  // Loop Starter
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [render]);

  // Config Update Listener (re-init population if count changes significantly)
  useEffect(() => {
    if (Math.abs(fishRef.current.length - config.fishCount) > 5) {
        if (canvasRef.current) {
             // Basic adjustment logic: add or remove
             if (config.fishCount > fishRef.current.length) {
                 const diff = config.fishCount - fishRef.current.length;
                 const newFish: Fish[] = [];
                 for(let i=0; i<diff; i++) {
                     newFish.push({
                        id: Date.now() + i,
                        x: Math.random() * canvasRef.current.width,
                        y: Math.random() * canvasRef.current.height,
                        vx: (Math.random() - 0.5) * config.baseSpeed,
                        vy: (Math.random() - 0.5) * config.baseSpeed,
                        color: FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)],
                        size: 4 + Math.random() * 4,
                        speed: config.baseSpeed * (0.8 + Math.random() * 0.4),
                        angle: 0,
                        tailPhase: Math.random() * Math.PI * 2,
                     });
                 }
                 fishRef.current = [...fishRef.current, ...newFish];
             } else {
                 fishRef.current = fishRef.current.slice(0, config.fishCount);
             }
        }
    }
    // Update base speeds dynamically
    fishRef.current.forEach(f => f.speed = config.baseSpeed * (0.8 + Math.random() * 0.4));
  }, [config.fishCount, config.baseSpeed]);

  // Mouse Handlers
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  const handleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Spawn bubbles
      for(let i=0; i<5; i++) {
        bubblesRef.current.push({
            id: Date.now() + i,
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 1,
            vy: -1 - Math.random() * 2,
            radius: 2 + Math.random() * 5,
            alpha: 1
        });
      }
      
      if (onCanvasClick) onCanvasClick(x, y);
    }
  };

  return (
    <div 
        ref={containerRef} 
        className="relative w-full h-full overflow-hidden"
        style={{
            background: `linear-gradient(to bottom, ${config.waterColorStart}, ${config.waterColorEnd})`
        }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="block cursor-crosshair active:cursor-grabbing"
      />
      {/* Optional ambient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-blue-500 opacity-10 mix-blend-overlay"></div>
    </div>
  );
};

export default UnderwaterCanvas;
