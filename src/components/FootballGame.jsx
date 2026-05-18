import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiTarget, FiRefreshCw, FiPlay, FiArrowRight } from "react-icons/fi";
import { playWhistle, playCrowdGoal, playExplosionSound, playKickSound, playSlowMoSound, playLightningZap, startPackOpeningLoop, stopPackOpeningLoop, playTransitionCelebration } from "../utils/audioSynth";
import GoalExplosion from "./GoalExplosion";
import PlayerCard from "./PlayerCard";

export default function FootballGame({ onGoalScored }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Game states: intro, aiming, shooting, goal, saved, post, pack-opening
  const [gameState, setGameState] = useState("intro"); 
  const [cameraShake, setCameraShake] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [goalPos, setGoalPos] = useState({ x: 0, y: 0 });

  // Particles for pack opening floating dust
  const [particles, setParticles] = useState([]);

  // Physics and aiming variables
  const aimAngleRef = useRef(0); // in radians
  const aimDirectionRef = useRef(1); // 1 = right, -1 = left
  const animationFrameIdRef = useRef(null);
  const slowMoRef = useRef(false);

  // Ball & Goalkeeper states
  const ballRef = useRef({
    x: 0,
    y: 0,
    z: 0, // 3D height simulation
    vx: 0,
    vy: 0,
    vz: 0,
    radius: 14,
    active: false,
    trail: []
  });

  const goalieRef = useRef({
    x: 0,
    y: 0,
    width: 50,
    height: 60,
    targetX: 0,
    speed: 2.2,
    state: "idle",
    dived: false
  });

  // Listen for FIFA Keyboard 'D' Key
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === "d") {
        e.preventDefault();
        if (gameState === "intro") {
          handleStartAiming();
        } else if (gameState === "aiming") {
          handleKick();
        } else if (gameState === "saved" || gameState === "post") {
          handleRetry();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState]);

  // Setup sizes
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const width = containerRef.current.clientWidth;
      const height = 480;
      canvas.width = width;
      canvas.height = height;

      // Initialize ball position
      resetBall();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // Initialize rising neon particles securely inside useEffect
  useEffect(() => {
    if (gameState === "pack-opening") {
      playLightningZap();
      startPackOpeningLoop();
      const p = Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        startX: Math.random() * (window.innerWidth || 800),
        startY: (window.innerHeight || 600) + Math.random() * 80,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * 3
      }));
      setParticles(p);
    } else {
      setParticles([]);
    }
  }, [gameState]);

  const resetBall = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    ballRef.current = {
      x: canvas.width / 2,
      y: canvas.height - 60,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      radius: 14,
      active: false,
      trail: []
    };

    goalieRef.current = {
      x: canvas.width / 2,
      y: 110,
      width: 55,
      height: 65,
      targetX: canvas.width / 2,
      speed: 2.2,
      state: "idle",
      dived: false
    };

    aimAngleRef.current = 0;
    aimDirectionRef.current = 1;
    slowMoRef.current = false;
    setShowExplosion(false);
  };

  const handleStartAiming = () => {
    setGameState("aiming");
  };

  const handleKick = () => {
    if (gameState !== "aiming") return;

    setGameState("shooting");
    playWhistle();
    playKickSound();
    
    // Shoot ball based on arrow angle
    const angle = aimAngleRef.current - Math.PI / 2;
    const speed = 12.5;

    ballRef.current.vx = Math.cos(angle) * speed;
    ballRef.current.vy = Math.sin(angle) * speed;
    ballRef.current.vz = 8.5; // kick ball upward slightly
    ballRef.current.active = true;

    // Direct goalkeeper to react based on target
    const canvas = canvasRef.current;
    const goalLineY = 110;
    const timeToGoal = (goalLineY - ballRef.current.y) / ballRef.current.vy;
    const finalX = ballRef.current.x + ballRef.current.vx * timeToGoal;

    goalieRef.current.targetX = Math.max(
      canvas.width / 2 - 140,
      Math.min(canvas.width / 2 + 140, finalX + (Math.random() - 0.5) * 50)
    );
    
    if (finalX < canvas.width / 2 - 30) {
      goalieRef.current.state = "diving-left";
    } else if (finalX > canvas.width / 2 + 30) {
      goalieRef.current.state = "diving-right";
    }
  };

  const handleRetry = () => {
    resetBall();
    setGameState("aiming");
  };

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let lastTime = performance.now();

    const loop = (currentTime) => {
      let dt = (currentTime - lastTime) / 16.666; // Normalized time step
      lastTime = currentTime;

      // Slow-motion trigger when ball is close to net
      let timeScale = 1.0;
      if (gameState === "shooting" && ballRef.current.y < 200 && ballRef.current.y > 105) {
        timeScale = 0.22;
        if (!slowMoRef.current) {
          slowMoRef.current = true;
          playSlowMoSound();
        }
      }
      dt *= timeScale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Field Turf
      drawSoccerPitch(ctx, canvas);

      // 2. Goalkeeper movement AI
      updateGoalkeeper(canvas, dt);

      // 3. Ball Physics & Deflections
      updateBall(canvas, dt);

      // 4. Render Goalpost
      drawGoalpost(ctx, canvas);

      // 5. Render Goalkeeper
      drawGoalkeeper(ctx);

      // 6. Render Ball & Trail
      drawBall(ctx);

      // 7. Render Aim Arrow
      if (gameState === "aiming") {
        drawAimArrow(ctx, canvas, dt);
      }

      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    const drawSoccerPitch = (ctx, canvas) => {
      // base color
      ctx.fillStyle = "#05060b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Perspective Grid Lines (Receding cyber-space style)
      ctx.strokeStyle = "rgba(0, 245, 255, 0.05)";
      ctx.lineWidth = 1.0;
      
      const gridCols = 16;
      for (let i = 0; i <= gridCols; i++) {
        const xTop = (canvas.width / 2 - 180) + (360 / gridCols) * i;
        const xBottom = (canvas.width * 0.05) + (canvas.width * 0.9 / gridCols) * i;
        ctx.beginPath();
        ctx.moveTo(xTop, 100);
        ctx.lineTo(xBottom, canvas.height);
        ctx.stroke();
      }

      const gridRows = 8;
      for (let i = 0; i <= gridRows; i++) {
        const ratio = i / gridRows;
        const y = 100 + (canvas.height - 100) * Math.pow(ratio, 1.4);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Penalty box border
      ctx.strokeStyle = "rgba(0, 245, 255, 0.2)";
      ctx.lineWidth = 2.0;
      const boxWidth = 380;
      const boxHeight = 180;
      const boxLeft = canvas.width / 2 - boxWidth / 2;
      ctx.strokeRect(boxLeft, 100, boxWidth, boxHeight);

      // Penalty spot
      ctx.fillStyle = "#00f5ff";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#00f5ff";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height - 60, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const updateGoalkeeper = (canvas, dt) => {
      const goalie = goalieRef.current;
      const targetX = goalie.targetX;

      if (gameState === "aiming" || gameState === "intro") {
        const osc = Math.sin(performance.now() * 0.003) * 80;
        goalie.x = canvas.width / 2 + osc;
      } else if (gameState === "shooting") {
        const diffX = targetX - goalie.x;
        if (Math.abs(diffX) > 4) {
          goalie.x += Math.sign(diffX) * goalie.speed * 1.5 * dt;
        }
      }
    };

    const updateBall = (canvas, dt) => {
      const ball = ballRef.current;
      if (!ball.active) return;

      ball.trail.push({ x: ball.x, y: ball.y, z: ball.z });
      if (ball.trail.length > 15) {
        ball.trail.shift();
      }

      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      
      ball.z += ball.vz * dt;
      ball.vz -= 0.32 * dt;
      if (ball.z < 0) {
        ball.z = 0;
        ball.vz = -ball.vz * 0.4;
      }

      const goalLeft = canvas.width / 2 - 165;
      const goalRight = canvas.width / 2 + 165;
      const goalTopY = 110;
      const crossbarHeight = 100;

      const goalie = goalieRef.current;
      if (ball.y <= goalie.y + 15 && ball.y >= goalie.y - 15 && ball.z < 60) {
        if (Math.abs(ball.x - goalie.x) < 30) {
          ball.active = false;
          ball.vx = (Math.random() - 0.5) * 4;
          ball.vy = 4;
          ball.vz = 3;
          setGameState("saved");
          playWhistle();
          return;
        }
      }

      if (Math.abs(ball.x - goalLeft) < 14 && ball.y <= goalTopY && ball.y >= goalTopY - 20) {
        if (ball.z < crossbarHeight) {
          ball.vx = -ball.vx * 0.7;
          ball.vy = Math.abs(ball.vy) * 0.5;
          setGameState("post");
          triggerCameraShake();
          return;
        }
      }
      if (Math.abs(ball.x - goalRight) < 14 && ball.y <= goalTopY && ball.y >= goalTopY - 20) {
        if (ball.z < crossbarHeight) {
          ball.vx = -ball.vx * 0.7;
          ball.vy = Math.abs(ball.vy) * 0.5;
          setGameState("post");
          triggerCameraShake();
          return;
        }
      }

      if (ball.y <= 100) {
        ball.active = false;
        
        if (ball.x > goalLeft && ball.x < goalRight && ball.z < 85) {
          setGameState("goal");
          setGoalPos({ x: ball.x, y: ball.y });
          setShowExplosion(true);
          triggerCameraShake();
          
          playWhistle();
          playExplosionSound(); 
          playCrowdGoal();      // Trigger the realistic GOAT chanting sweeps!

          setTimeout(() => {
            setGameState("pack-opening");
          }, 2200);
        } else {
          setGameState("post");
        }
      }
    };

    const drawGoalpost = (ctx, canvas) => {
      const center = canvas.width / 2;
      const goalLeft = center - 165;
      const goalRight = center + 165;
      const goalTop = 110;
      const goalDepth = 40;

      // Hexagon goal net lines
      ctx.strokeStyle = "rgba(189, 0, 255, 0.12)";
      ctx.lineWidth = 1.0;
      for (let y = goalTop - goalDepth; y < goalTop; y += 8) {
        ctx.beginPath();
        ctx.moveTo(goalLeft, y);
        ctx.lineTo(goalRight, y);
        ctx.stroke();
      }
      for (let x = goalLeft; x <= goalRight; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, goalTop);
        ctx.lineTo(x, goalTop - goalDepth);
        ctx.stroke();
      }

      // High-glow goal borders
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.lineWidth = 5.5;
      ctx.lineCap = "round";

      // Left post (Fuchsia glow)
      ctx.strokeStyle = "#bd00ff";
      ctx.shadowColor = "#bd00ff";
      ctx.beginPath();
      ctx.moveTo(goalLeft, goalTop);
      ctx.lineTo(goalLeft, goalTop - 10);
      ctx.stroke();

      // Right post (Cyan glow)
      ctx.strokeStyle = "#00f5ff";
      ctx.shadowColor = "#00f5ff";
      ctx.beginPath();
      ctx.moveTo(goalRight, goalTop);
      ctx.lineTo(goalRight, goalTop - 10);
      ctx.stroke();

      // Crossbar gradient (Fuchsia to Cyan)
      const grad = ctx.createLinearGradient(goalLeft, goalTop - 10, goalRight, goalTop - 10);
      grad.addColorStop(0, "#bd00ff");
      grad.addColorStop(1, "#00f5ff");
      ctx.strokeStyle = grad;
      ctx.shadowColor = "#00f5ff";
      ctx.beginPath();
      ctx.moveTo(goalLeft, goalTop - 10);
      ctx.lineTo(goalRight, goalTop - 10);
      ctx.stroke();

      ctx.restore();
    };

    const drawGoalkeeper = (ctx) => {
      const g = goalieRef.current;
      
      ctx.save();
      ctx.translate(g.x, g.y);

      const isDiving = g.state.startsWith("diving");
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.ellipse(0, 30, isDiving ? 32 : 22, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cyber Stick Figure Glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#bd00ff";
      ctx.lineCap = "round";

      if (isDiving) {
        const factor = g.state === "diving-left" ? -1 : 1;
        
        // Dive Torso / limbs
        ctx.strokeStyle = "#bd00ff";
        ctx.lineWidth = 6.0;
        ctx.beginPath();
        ctx.moveTo(0, 15);
        ctx.lineTo(factor * 20, -5);
        ctx.stroke();

        ctx.strokeStyle = "#00f5ff";
        ctx.beginPath();
        ctx.moveTo(factor * 20, -5);
        ctx.lineTo(factor * 35, -20);
        ctx.stroke();

        // Head
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(factor * 26, -10, 8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Torso
        ctx.strokeStyle = "#bd00ff";
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(0, 10);
        ctx.stroke();

        // Raised Arms (V angled raised high)
        ctx.strokeStyle = "#00f5ff";
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(-22, -34);
        ctx.moveTo(0, -12);
        ctx.lineTo(22, -34);
        ctx.stroke();

        // Legs (spread wide)
        ctx.strokeStyle = "#bd00ff";
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(-16, 32);
        ctx.moveTo(0, 10);
        ctx.lineTo(16, 32);
        ctx.stroke();

        // Head
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -28, 8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const drawBall = (ctx) => {
      const b = ballRef.current;
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.arc(b.x + b.z * 0.3, b.y + b.z * 0.2, Math.max(4, b.radius - b.z * 0.3), 0, Math.PI * 2);
      ctx.fill();

      if (b.trail.length > 1) {
        ctx.save();
        ctx.shadowColor = "#ccff00";
        ctx.shadowBlur = 10;
        
        for (let i = 1; i < b.trail.length; i++) {
          const t1 = b.trail[i - 1];
          const t2 = b.trail[i];
          const alpha = (i / b.trail.length) * 0.4;
          
          ctx.beginPath();
          ctx.moveTo(t1.x, t1.y - t1.z);
          ctx.lineTo(t2.x, t2.y - t2.z);
          ctx.strokeStyle = `rgba(204, 255, 0, ${alpha})`;
          ctx.lineWidth = Math.max(1, (i / b.trail.length) * 6);
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.save();
      ctx.translate(b.x, b.y - b.z);

      ctx.shadowColor = "#ccff00";
      ctx.shadowBlur = b.active ? 15 : 4;

      const scaleSize = Math.max(8, b.radius + b.z * 0.15);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, scaleSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#090a0f";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, scaleSize, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#ccff00";
      ctx.beginPath();
      ctx.arc(0, 0, scaleSize * 0.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const drawAimArrow = (ctx, canvas, dt) => {
      const ball = ballRef.current;
      const arrowLength = 75;

      const speed = 0.045 * dt;
      aimAngleRef.current += aimDirectionRef.current * speed;

      if (aimAngleRef.current > 1.0) {
        aimAngleRef.current = 1.0;
        aimDirectionRef.current = -1;
      } else if (aimAngleRef.current < -1.0) {
        aimAngleRef.current = -1.0;
        aimDirectionRef.current = 1;
      }

      const angle = aimAngleRef.current - Math.PI / 2;
      const arrowX = ball.x + Math.cos(angle) * arrowLength;
      const arrowY = ball.y + Math.sin(angle) * arrowLength;

      ctx.save();
      ctx.shadowColor = "#ccff00";
      ctx.shadowBlur = 12;

      ctx.strokeStyle = "linear-gradient(to right, #00f5ff, #ccff00)";
      const grad = ctx.createLinearGradient(ball.x, ball.y, arrowX, arrowY);
      grad.addColorStop(0, "rgba(0, 245, 255, 0.4)");
      grad.addColorStop(1, "#ccff00");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 5;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(ball.x, ball.y - 10);
      ctx.lineTo(arrowX, arrowY);
      ctx.stroke();

      const leftWingX = arrowX + Math.cos(angle + 2.3) * 12;
      const leftWingY = arrowY + Math.sin(angle + 2.3) * 12;
      const rightWingX = arrowX + Math.cos(angle - 2.3) * 12;
      const rightWingY = arrowY + Math.sin(angle - 2.3) * 12;

      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(leftWingX, leftWingY);
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(rightWingX, rightWingY);
      ctx.stroke();

      ctx.restore();
    };

    const triggerCameraShake = () => {
      setCameraShake(true);
      setTimeout(() => setCameraShake(false), 500);
    };

    animationFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [gameState]);

  // Framer Motion lightning opacity strike keyframes
  const lightningStrikeAnimation = {
    opacity: [0, 1, 0, 1, 0.1, 1, 0, 0.9, 0],
    transition: {
      duration: 1.2,
      times: [0, 0.08, 0.15, 0.22, 0.3, 0.45, 0.6, 0.75, 1],
      ease: "easeInOut",
      repeat: Infinity,
      repeatDelay: 1.5
    }
  };

  return (
    <div className={`p-[2px] rounded-3xl bg-gradient-to-tr from-[#bd00ff] via-[#00f5ff] to-[#d1a850] shadow-[0_0_35px_rgba(189,0,255,0.2)] max-w-4xl w-full mx-auto transition-all duration-300 ${
      cameraShake ? "camera-shake" : ""
    }`}>
      <div
        ref={containerRef}
        className="relative w-full rounded-[22px] overflow-hidden bg-[#05060b] shadow-2xl flex flex-col justify-between"
      >
        {/* Shifting side chevrons overlays exactly as in Image 2 */}
        {gameState !== "pack-opening" && (
          <>
            <div className="absolute left-10 top-[35%] pointer-events-none z-20 opacity-40 flex gap-1.5 text-[#00f5ff] drop-shadow-[0_0_10px_#00f5ff] animate-pulse">
              <span className="text-xl font-bold font-mono">&gt;</span>
              <span className="text-xl font-bold font-mono">&gt;</span>
              <span className="text-xl font-bold font-mono">&gt;</span>
            </div>
            <div className="absolute right-10 top-[35%] pointer-events-none z-20 opacity-40 flex gap-1.5 text-[#bd00ff] drop-shadow-[0_0_10px_#bd00ff] animate-pulse">
              <span className="text-xl font-bold font-mono">&lt;</span>
              <span className="text-xl font-bold font-mono">&lt;</span>
              <span className="text-xl font-bold font-mono">&lt;</span>
            </div>
          </>
        )}

        {/* Canvas Layer */}
        <canvas ref={canvasRef} className="block w-full h-[480px] z-10 relative" />

        {/* Goal Celebration Blast Overlays */}
        {showExplosion && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <GoalExplosion goalX={goalPos.x} goalY={goalPos.y} />
          </div>
        )}

        {/* User Interaction Floating UI States */}
        <div className="absolute inset-x-0 bottom-6 flex flex-col items-center justify-center z-30 pointer-events-auto">
          {gameState === "intro" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-6 rounded-2xl bg-[#090a0f]/95 border border-[#bd00ff]/30 max-w-sm mx-4 backdrop-blur-md shadow-[0_0_20px_rgba(189,0,255,0.15)]"
            >
              <h3 className="fc-title-slanted text-xl sm:text-2xl font-black text-[#bd00ff] tracking-wider mb-2 drop-shadow-[0_0_8px_#bd00ff]">
                PENALTY UNLOCK MODE
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                Chào mừng bạn đến với Hồ sơ Trần Trọng Tín! Hãy thực hiện một cú sút Penalty thành công để kích hoạt đường truyền giải mã hồ sơ.
              </p>
              <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-4">
                [Nhấn phím D hoặc nút dưới để bắt đầu]
              </span>
              <button
                onClick={handleStartAiming}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#bd00ff] text-fc-dark font-mono font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 w-full border border-white/10"
              >
                <FiPlay size={14} className="fill-fc-dark" />
                <span>BẮT ĐẦU SÚT</span>
              </button>
            </motion.div>
          )}

          {gameState === "aiming" && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="px-5 py-2.5 rounded-xl bg-[#090a0f]/95 border border-[#bd00ff]/50 text-center shadow-[0_0_15px_rgba(189,0,255,0.25)]">
                <span className="block text-[10px] font-mono text-[#00f5ff] uppercase tracking-widest font-semibold animate-pulse">
                  NHẤN D ĐỂ SÚT!
                </span>
                <span className="block text-[9px] font-sans text-slate-300 mt-0.5">
                  Đang nhắm góc...
                </span>
              </div>
              <button
                onClick={handleKick}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-[#00f5ff] to-[#bd00ff] text-fc-dark font-display font-extrabold text-xs uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all duration-300 flex items-center gap-2 cursor-pointer border border-white/20 shadow-md shadow-cyan-500/20"
              >
                <FiTarget size={14} />
                <span>SÚT BÓNG! (D)</span>
              </button>
            </motion.div>
          )}

          {(gameState === "saved" || gameState === "post") && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-6 rounded-2xl bg-fc-dark/95 border border-rose-500/30 max-w-sm mx-4 backdrop-blur-md"
            >
              <h3 className="fc-title-slanted text-xl sm:text-2xl font-black text-rose-500 tracking-wider mb-2">
                {gameState === "saved" ? "KICK BLOCKED!" : "MISSED THE GOAL!"}
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                Thủ môn đã xuất sắc cản phá hoặc bóng trúng cột dọc! Hãy thử căn lại góc sút chuẩn xác hơn để giành chiến thắng.
              </p>
              <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-4">
                [Nhấn phím D để thử lại]
              </span>
              <button
                onClick={handleRetry}
                className="px-6 py-3 rounded-full bg-rose-500 text-white font-mono font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-2 hover:scale-105 hover:bg-rose-400 transition-all duration-300 w-full shadow-lg shadow-rose-500/20"
              >
                <FiRefreshCw size={14} />
                <span>THỬ SÚT LẠI</span>
              </button>
            </motion.div>
          )}

          {gameState === "goal" && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h2 className="fc-title-slanted text-6xl sm:text-8xl font-black text-[#00f5ff] text-glow-lime animate-bounce">
                GOAL!!!
              </h2>
              <span className="px-4 py-1.5 rounded-full bg-black/60 border border-[#bd00ff]/30 text-xs font-mono text-slate-300 uppercase tracking-widest">
                Đồng bộ dữ liệu SIÊU SAO...
              </span>
            </motion.div>
          )}
        </div>

        {/* Footer Badges styled exactly like Image 1 & 2 */}
        {gameState !== "pack-opening" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-5 border-t border-white/5 bg-[#07080f] px-6 rounded-b-[22px] z-20 relative">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full bg-[#bd00ff]/10 border border-[#bd00ff]/30 flex items-center justify-center text-[#bd00ff] drop-shadow-[0_0_8px_rgba(189,0,255,0.4)]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[9px] font-bold text-white uppercase tracking-wider">BẢO MẬT TUYỆT ĐỐI</span>
                <span className="block text-[8px] text-slate-400">Mã hóa end-to-end</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full bg-[#00f5ff]/10 border border-[#00f5ff]/30 flex items-center justify-center text-[#00f5ff] drop-shadow-[0_0_8px_rgba(0,245,255,0.4)] animate-pulse">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[9px] font-bold text-white uppercase tracking-wider">CHUYỂN GIAO SIÊU TỐC</span>
                <span className="block text-[8px] text-slate-400">Tối ưu tốc độ xử lý</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full bg-[#d1a850]/10 border border-[#d1a850]/30 flex items-center justify-center text-[#d1a850] drop-shadow-[0_0_8px_rgba(209,168,80,0.4)]">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/>
                  <circle cx="12" cy="12" r="6"/>
                  <circle cx="12" cy="12" r="2"/>
                </svg>
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[9px] font-bold text-white uppercase tracking-wider">CHÍNH XÁC TUYỆT ĐỐI</span>
                <span className="block text-[8px] text-slate-400">Đánh trúng mục tiêu</span>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-8 h-8 rounded-full bg-[#bd00ff]/10 border border-[#bd00ff]/30 flex items-center justify-center text-[#bd00ff] drop-shadow-[0_0_8px_rgba(189,0,255,0.4)]">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[9px] font-bold text-white uppercase tracking-wider">NÂNG CẤP NĂNG LỰC</span>
                <span className="block text-[8px] text-slate-400">Bứt phá sự nghiệp</span>
              </div>
            </div>
          </div>
        )}

        {/* SURPRISE CINEMATIC FULL SCREEN EA SPORTS PACK OPENING OVERLAY */}
        {gameState === "pack-opening" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 w-screen h-screen z-50 overflow-hidden"
          >
            {/* DYNAMIC COSMIC PITCH GRADIENTS WITH MAGENTA/PURPLE & GOLD/ORANGE NEBULA AURA */}
            <div className="absolute inset-0 bg-[#040408] overflow-hidden pointer-events-none z-0">
              {/* Perspective grid floor */}
              <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />

              {/* Glowing Nebula smoke (left purple, right orange/gold) exactly like Image 1 */}
              <div className="absolute -left-20 top-1/4 w-[600px] h-[600px] bg-[#bd00ff]/10 blur-[160px] rounded-full animate-pulse" />
              <div className="absolute -right-20 top-1/4 w-[600px] h-[600px] bg-[#d1a850]/10 blur-[160px] rounded-full animate-pulse" />
              
              <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#bd00ff]/5 via-transparent to-transparent" />

              {/* Rotating conic light ray matrices */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] rounded-full border border-fuchsia-400/5 bg-[repeating-conic-gradient(from_0deg,rgba(189,0,255,0.03)_0deg_15deg,transparent_15deg_30deg)] animate-spin pointer-events-none" 
                style={{ animationDuration: "40s" }}
              />

              {/* Shifting side chevrons overlays exactly as in Image 1 */}
              <div className="absolute left-16 top-1/2 -translate-y-1/2 pointer-events-none z-10 opacity-30 flex flex-col gap-4 text-[#bd00ff] drop-shadow-[0_0_12px_#bd00ff] animate-pulse">
                <span className="text-4xl font-extrabold">&gt;&gt;&gt;</span>
              </div>
              <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none z-10 opacity-30 flex flex-col gap-4 text-[#d1a850] drop-shadow-[0_0_12px_#d1a850] animate-pulse">
                <span className="text-4xl font-extrabold">&lt;&lt;&lt;</span>
              </div>
            </div>

            {/* DUST PARTICLES FLOATING UPWARD AT 60FPS */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{
                    x: p.startX,
                    y: p.startY,
                    opacity: Math.random() * 0.7 + 0.3,
                    scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{
                    y: -50,
                    opacity: 0
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    repeat: Infinity,
                    repeatDelay: 0.5,
                    ease: "linear"
                  }}
                  className="absolute rounded-full bg-[#00f5ff]/80 shadow-[0_0_12px_#00f5ff]"
                  style={{ width: p.size, height: p.size }}
                />
              ))}
            </div>

            {/* Designer Concert Lighting Strobe Flash on Mount */}
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 bg-white z-50 pointer-events-none"
            />

            {/* Concentric Neon Vector Shockwaves expanding infinitely */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-10">
              {[1, 2, 3].map((num) => (
                <motion.div
                  key={num}
                  initial={{ scale: 0.05, opacity: 0.9 }}
                  animate={{ scale: 3.2, opacity: 0 }}
                  transition={{
                    duration: 2.2,
                    delay: num * 0.45,
                    ease: "easeOut",
                    repeat: Infinity
                  }}
                  className="absolute w-80 h-80 rounded-full border-[3px] border-[#00f5ff]/20 shadow-[0_0_35px_rgba(0,245,255,0.15)]"
                />
              ))}
            </div>

            {/* DYNAMIC JAGGED NEON LIGHTNING STRIKES DISCHARGING ONTO CARD */}
            {/* Lightning Left */}
            <motion.svg
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-30 drop-shadow-[0_0_20px_rgba(189,0,255,0.85)]"
              viewBox="0 0 1000 800"
              fill="none"
              stroke="#bd00ff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={lightningStrikeAnimation}
            >
              <path d="M0,0 L180,150 L120,200 L320,380 L260,420 L490,240" />
              <path d="M120,200 L240,290 L210,320 L380,455" strokeWidth="2.0" opacity="0.7" />
            </motion.svg>

            {/* Lightning Right */}
            <motion.svg
              className="absolute top-0 right-0 w-full h-full pointer-events-none z-30 drop-shadow-[0_0_20px_rgba(0,245,255,0.85)]"
              viewBox="0 0 1000 800"
              fill="none"
              stroke="#00f5ff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={lightningStrikeAnimation}
            >
              <path d="M1000,0 L820,160 L880,210 L680,390 L740,430 L510,240" />
              <path d="M820,160 L700,280 L730,310 L590,440" strokeWidth="2.0" opacity="0.7" />
            </motion.svg>

            {/* TOP ELEMENT: Title and badge absolute positioned */}
            <div className="absolute top-8 inset-x-0 flex flex-col items-center pointer-events-none z-20">
              <span className="px-5 py-2 rounded-full bg-[#00f5ff]/10 border border-[#00f5ff]/30 text-[#00f5ff] font-display font-black text-[9px] sm:text-[10px] uppercase tracking-widest animate-pulse drop-shadow-[0_0_6px_#00f5ff]">
                ★★★ UNLOCKED: SQUAD SPECIALIST ★★★
              </span>
            </div>

            {/* ABSOLUTE CENTER PRESENTATION BOX: Hologram + FUT Card + Electric border */}
            <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm flex items-center justify-center min-h-[380px] sm:min-h-[440px] z-20">
              
              {/* STYLIZED VECTOR GOAT PLAYER SILHOUETTE STANDING BEHIND CARD */}
              <svg
                viewBox="0 0 100 100"
                className="absolute w-[310px] h-[310px] sm:w-[410px] sm:h-[410px] text-fuchsia-500/10 fill-current drop-shadow-[0_0_35px_rgba(189,0,255,0.4)] pointer-events-none z-0 translate-y-[-20px] animate-pulse"
              >
                {/* Messi/Ronaldo style GOAT celebration pointing to sky */}
                <path d="M50,10 C53,10 56,7 56,4 C56,1 53,-2 50,-2 C47,-2 44,1 44,4 C44,7 47,10 50,10 Z M50,12 C46,12 43,15 42,19 L32,8 L24,10 L30,22 L38,24 L42,32 L40,65 L26,90 L33,94 L50,70 L67,94 L74,90 L60,65 L58,32 L62,24 L70,22 L76,10 L68,8 L58,19 C57,15 54,12 50,12 Z" />
              </svg>

              {/* Glowing 3D Pedestal Stage exactly like Image 1 */}
              <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-72 h-10 bg-gradient-to-r from-[#bd00ff]/20 to-[#00f5ff]/20 rounded-full border border-cyan-400/30 shadow-[0_0_35px_rgba(0,245,255,0.45)] pointer-events-none z-0 transform scale-y-[0.3]">
                <div className="absolute inset-2 bg-[#05060b] rounded-full border border-fuchsia-400/30" />
              </div>

              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: [0, 1.05, 0.95, 1], rotate: 0 }}
                transition={{ duration: 1.3, ease: "easeOut" }}
                className="relative z-10"
              >
                {/* Magic card backdrop fuchsia halo */}
                <div className="absolute -inset-6 bg-gradient-to-r from-[#bd00ff] via-[#00f5ff] to-[#d1a850] opacity-80 blur-3xl animate-pulse pointer-events-none" />
                
                {/* ANIMATED ELECTRIC SHIELD BORDER SPRINTING AROUND FUT CARD */}
                <svg
                  className="absolute -inset-[11px] w-[calc(100%+22px)] h-[calc(100%+22px)] pointer-events-none z-20"
                  viewBox="0 0 340 500"
                >
                  {/* Neon Fuchsia electrical flow */}
                  <motion.path
                    d="M20,60 L170,10 L320,60 L320,440 L170,490 L20,440 Z"
                    fill="none"
                    stroke="#bd00ff"
                    strokeWidth="4.0"
                    strokeDasharray="90 140"
                    animate={{
                      strokeDashoffset: [0, -460]
                    }}
                    transition={{
                      duration: 2.0,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="drop-shadow-[0_0_15px_#bd00ff]"
                  />
                  {/* Neon Cyan electrical flow */}
                  <motion.path
                    d="M20,60 L170,10 L320,60 L320,440 L170,490 L20,440 Z"
                    fill="none"
                    stroke="#00f5ff"
                    strokeWidth="3.0"
                    strokeDasharray="60 170"
                    animate={{
                      strokeDashoffset: [230, -230]
                    }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="drop-shadow-[0_0_12px_#00f5ff]"
                  />
                </svg>

                {/* Render FUT card fully visible with interactive 3D mouse parallax */}
                {/* Scaled safely for perfect alignment on small mobile up to wide screens */}
                <div className="scale-[0.7] sm:scale-[0.88] md:scale-95 origin-center">
                  <PlayerCard />
                </div>
              </motion.div>
            </div>

            {/* BOTTOM ELEMENT: Title, specs, absolute positioned */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.95 }}
              className="absolute bottom-6 sm:bottom-8 inset-x-0 flex flex-col items-center space-y-4 z-20 text-center"
            >
              <div>
                <h2 className="fc-title-slanted text-2xl sm:text-3xl font-black tracking-wider bg-gradient-to-r from-[#00f5ff] to-white bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,245,255,0.35)]">
                  TRẦN TRỌNG TÍN
                </h2>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-widest mt-1.5 uppercase">
                  FULLSTACK & FRONTEND DEVELOPER • 99 OVR
                </p>
              </div>

              <button
                onClick={() => {
                  stopPackOpeningLoop();
                  playTransitionCelebration();
                  onGoalScored();
                }}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-[#bd00ff] via-[#00f5ff] to-[#bd00ff] text-white font-display font-extrabold text-xs uppercase tracking-widest hover:scale-105 hover:shadow-2xl hover:shadow-[#bd00ff]/45 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-white/20 shadow-lg"
              >
                <span>BẮT ĐẦU CHINH PHỤC</span>
                <FiArrowRight size={14} />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Cyber overlay telemetry grids */}
        <div className="absolute top-4 left-4 font-mono text-[9px] text-[#00f5ff]/40 z-20 pointer-events-none">
          MATCH: PENALTY_SHOOTOUT_MODE<br />
          SYS.CAMERA.STATUS: ACTIVE<br />
          DILATION_TIME_SCALE: {gameState === "shooting" ? "DILATED" : "1.00"}
        </div>
        <div className="absolute top-4 right-4 font-mono text-[9px] text-[#00f5ff]/40 z-20 pointer-events-none text-right">
          BATTERY_SPEED: 12.5M/S<br />
          TDC_COORDINATES: TDC_2026<br />
          GOALIE.AI.INTELLIGENCE: 60%
        </div>
      </div>
    </div>
  );
}
