import { useEffect, useRef } from "react";

export default function GoalExplosion({ goalX, goalY }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const width = (canvas.width = canvas.parentElement.clientWidth);
    const height = (canvas.height = canvas.parentElement.clientHeight);

    // Explosions particles array
    const particles = [];
    const particleCount = 140;

    // Shockwave properties
    let shockwaveRadius = 0;
    const shockwaveMaxRadius = 180;
    let shockwaveAlpha = 0.8;

    class ExplodingParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 4 + 1.5;
        // Directional spray (upward and outward)
        const angle = Math.random() * Math.PI + Math.PI; // random angle pointing upwards
        const speed = Math.random() * 8 + 3;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.15;
        this.drag = 0.98;
        // Lime and gold colors
        this.color = Math.random() > 0.5 ? "#ccff00" : "#d1a850";
        this.alpha = 1;
        this.fade = Math.random() * 0.015 + 0.01;
      }

      update() {
        this.vx *= this.drag;
        this.vy *= this.drag;
        this.vy += this.gravity; // fall down
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.fade;
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 6;
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fill();
        ctx.restore();
      }
    }

    // Populate explosion particles
    for (let i = 0; i < particleCount; i++) {
      // Offset slightly to spread source
      const offsetX = goalX + (Math.random() - 0.5) * 20;
      const offsetY = goalY + (Math.random() - 0.5) * 10;
      particles.push(new ExplodingParticle(offsetX, offsetY));
    }

    // Animation Loop
    function animate() {
      // Clear with slight trailing opacity
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Shockwave ring expanding
      if (shockwaveRadius < shockwaveMaxRadius) {
        shockwaveRadius += 6;
        shockwaveAlpha -= 0.025;

        if (shockwaveAlpha > 0) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(goalX, goalY, shockwaveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(204, 255, 0, ${shockwaveAlpha})`;
          ctx.lineWidth = 4;
          ctx.shadowColor = "#ccff00";
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.restore();
        }
      }

      // 2. Render and update particles
      let activeParticles = 0;
      particles.forEach((p) => {
        if (p.alpha > 0) {
          p.update();
          p.draw();
          activeParticles++;
        }
      });

      if (activeParticles > 0 || shockwaveRadius < shockwaveMaxRadius) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [goalX, goalY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-20"
    />
  );
}
