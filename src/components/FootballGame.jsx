import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiTarget, FiRefreshCw, FiPlay, FiArrowRight, FiVolume2, FiVolumeX } from "react-icons/fi";
import { 
  playWhistle, 
  playCrowdGoal, 
  playExplosionSound, 
  playKickSound, 
  playSlowMoSound, 
  playLightningZap, 
  startPackOpeningLoop, 
  stopPackOpeningLoop, 
  playTransitionCelebration,
  playBeepSound,
  playHoverSound,
  playBassKick,
  playCountdownSound,
  isMuted,
  toggleMute
} from "../utils/audioSynth";
import GoalExplosion from "./GoalExplosion";
import PlayerCard from "./PlayerCard";
import confetti from "canvas-confetti";

export default function FootballGame({ onGoalScored }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Game states: intro, stadium-intro, countdown, aiming, shooting, goal, saved, post, pack-opening, full-time
  const [gameState, setGameState] = useState("intro"); 
  const [introStage, setIntroStage] = useState("black"); // black, sweep, done
  const [countdownVal, setCountdownVal] = useState(3);
  const [cameraShake, setCameraShake] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [goalPos, setGoalPos] = useState({ x: 0, y: 0 });
  const [soundMuted, setSoundMuted] = useState(isMuted());

  // Scoreboard Telemetry
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [matchTime, setMatchTime] = useState({ min: 89, sec: 40 });

  // Particles for pack opening floating dust
  const [particles, setParticles] = useState([]);

  // Physics and aiming variables
  const aimAngleRef = useRef(0); 
  const aimDirectionRef = useRef(1); 
  const animationFrameIdRef = useRef(null);
  const slowMoRef = useRef(false);

  // Ball & Goalkeeper states
  const ballRef = useRef({
    x: 0,
    y: 0,
    z: 0, 
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

  // Sound control
  const handleToggleMute = () => {
    const isMute = toggleMute();
    setSoundMuted(isMute);
    playBeepSound();
  };

  // Scoreboard Timer ticking logic
  useEffect(() => {
    if (gameState === "intro" || gameState === "stadium-intro") return;
    const interval = setInterval(() => {
      setMatchTime((prev) => {
        if (prev.min >= 90 && prev.sec >= 0) {
          return { min: 90, sec: 0 }; // clamp at full time
        }
        let nextSec = prev.sec + 1;
        let nextMin = prev.min;
        if (nextSec >= 60) {
          nextSec = 0;
          nextMin += 1;
        }
        return { min: nextMin, sec: nextSec };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Keyboard 'D' Trigger
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === "d") {
        e.preventDefault();
        if (gameState === "intro") {
          triggerStadiumIntro();
        } else if (gameState === "aiming") {
          handleKick();
        } else if (gameState === "saved" || gameState === "post") {
          handleRetry();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Setup Sizes
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const width = containerRef.current.clientWidth;
      const height = 480;
      canvas.width = width;
      canvas.height = height;
      resetBall();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, []);

  // Holographic particles effect trigger
  useEffect(() => {
    if (gameState === "pack-opening") {
      playLightningZap();
      startPackOpeningLoop();
      const p = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        startX: Math.random() * (window.innerWidth || 800),
        startY: (window.innerHeight || 600) + Math.random() * 80,
        duration: Math.random() * 5 + 3,
        delay: Math.random() * 2
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

  // Stadium cinematic intro trigger
  const triggerStadiumIntro = () => {
    setGameState("stadium-intro");
    setIntroStage("black");
    playCrowdGoal(); // play huge ambient stadium crowd roar

    // Sweep lighting step
    setTimeout(() => {
      setIntroStage("sweep");
      triggerCameraShake(800);
    }, 800);

    // Fade to countdown
    setTimeout(() => {
      setIntroStage("done");
      startCountdown();
    }, 3200);
  };

  // Countdown clock 3..2..1
  const startCountdown = () => {
    setGameState("countdown");
    setCountdownVal(3);
    playCountdownSound(3);
    triggerCameraShake(200);

    setTimeout(() => {
      setCountdownVal(2);
      playCountdownSound(2);
      triggerCameraShake(200);
    }, 1000);

    setTimeout(() => {
      setCountdownVal(1);
      playCountdownSound(1);
      triggerCameraShake(250);
    }, 2000);

    setTimeout(() => {
      setGameState("aiming");
      playWhistle();
    }, 3000);
  };

  const handleKick = () => {
    if (gameState !== "aiming") return;

    setGameState("shooting");
    playWhistle();
    playKickSound();
    
    const canvas = canvasRef.current;
    const goalLeft = canvas.width / 2 - 165;
    const goalRight = canvas.width / 2 + 165;

    // Guaranteed shot landing inside the net!
    // Map the user's aim to a target X inside the posts with a safe margin
    const aimRatio = (aimAngleRef.current + 1.0) / 2.0; 
    const targetX = goalLeft + 35 + aimRatio * (goalRight - goalLeft - 70);
    
    // Exact forward velocity
    const vy = -12.5; 
    const goalLineY = 100;
    const timeToGoal = (goalLineY - ballRef.current.y) / vy;
    const vx = (targetX - ballRef.current.x) / timeToGoal;

    ballRef.current.vx = vx;
    ballRef.current.vy = vy;

    // Upward launch velocity (vz) so that height is perfectly inside goal net (never "lên trời")
    ballRef.current.vz = 5.2; 
    ballRef.current.active = true;

    // Goalkeeper dives to the opposite side of targetX
    if (targetX < canvas.width / 2) {
      goalieRef.current.targetX = canvas.width / 2 + 95;
      goalieRef.current.state = "diving-right";
    } else {
      goalieRef.current.targetX = canvas.width / 2 - 95;
      goalieRef.current.state = "diving-left";
    }
  };

  const handleRetry = () => {
    resetBall();
    setGameState("aiming");
  };

  // Trigger FULL TIME ending screen
  const triggerFullTime = () => {
    stopPackOpeningLoop();
    setGameState("full-time");
    playTransitionCelebration(); // trumpet fanfare, celebratory referee whistle

    setTimeout(() => {
      // Golden Confetti blast!
      confetti({
        particleCount: 220,
        spread: 100,
        origin: { y: 0.55 },
        colors: ["#ffd700", "#ffffff", "#00f5ff", "#7b2fff", "#ff006e"]
      });
    }, 200);
  };

  const triggerCameraShake = (duration = 500) => {
    setCameraShake(true);
    setTimeout(() => setCameraShake(false), duration);
  };

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let lastTime = performance.now();

    const loop = (currentTime) => {
      let dt = (currentTime - lastTime) / 16.666; 
      lastTime = currentTime;

      // Time dilation slow motion trigger
      let timeScale = 1.0;
      if (gameState === "shooting" && ballRef.current.y < 195 && ballRef.current.y > 105) {
        timeScale = 0.22;
        if (!slowMoRef.current) {
          slowMoRef.current = true;
          playSlowMoSound();
        }
      }
      dt *= timeScale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawSoccerPitch(ctx, canvas);
      updateGoalkeeper(canvas, dt);
      updateBall(canvas, dt);
      drawGoalpost(ctx, canvas);
      drawGoalkeeper(ctx);
      drawBall(ctx);

      if (gameState === "aiming") {
        drawAimArrow(ctx, canvas, dt);
      }

      animationFrameIdRef.current = requestAnimationFrame(loop);
    };

    const drawSoccerPitch = (ctx, canvas) => {
      ctx.fillStyle = "#05060b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Receding futuristic space grid
      ctx.strokeStyle = "rgba(0, 245, 255, 0.05)";
      ctx.lineWidth = 1.0;
      
      const gridCols = 18;
      for (let i = 0; i <= gridCols; i++) {
        const xTop = (canvas.width / 2 - 180) + (360 / gridCols) * i;
        const xBottom = (canvas.width * 0.05) + (canvas.width * 0.9 / gridCols) * i;
        ctx.beginPath();
        ctx.moveTo(xTop, 100);
        ctx.lineTo(xBottom, canvas.height);
        ctx.stroke();
      }

      const gridRows = 9;
      for (let i = 0; i <= gridRows; i++) {
        const ratio = i / gridRows;
        const y = 100 + (canvas.height - 100) * Math.pow(ratio, 1.45);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Penalty boundaries
      ctx.strokeStyle = "rgba(0, 245, 255, 0.16)";
      ctx.lineWidth = 2.0;
      const boxWidth = 380;
      const boxHeight = 180;
      const boxLeft = canvas.width / 2 - boxWidth / 2;
      ctx.strokeRect(boxLeft, 100, boxWidth, boxHeight);

      // Penalty mark
      ctx.fillStyle = "#00f5ff";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#00f5ff";
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height - 60, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    const updateGoalkeeper = (canvas, dt) => {
      const goalie = goalieRef.current;
      const targetX = goalie.targetX;

      if (gameState === "aiming" || gameState === "intro" || gameState === "countdown" || gameState === "stadium-intro") {
        const osc = Math.sin(performance.now() * 0.003) * 80;
        goalie.x = canvas.width / 2 + osc;
      } else if (gameState === "shooting") {
        const diffX = targetX - goalie.x;
        if (Math.abs(diffX) > 4) {
          goalie.x += Math.sign(diffX) * goalie.speed * 1.55 * dt;
        }
      }
    };

    const updateBall = (canvas, dt) => {
      const ball = ballRef.current;
      if (!ball.active) return;

      // Dynamic motion blur trail calculations
      ball.trail.push({ x: ball.x, y: ball.y, z: ball.z });
      if (ball.trail.length > 18) {
        ball.trail.shift();
      }

      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;
      ball.z += ball.vz * dt;
      ball.vz -= 0.32 * dt; // gravity

      if (ball.z < 0) {
        ball.z = 0;
        ball.vz = -ball.vz * 0.4;
      }

      const goalLeft = canvas.width / 2 - 165;
      const goalRight = canvas.width / 2 + 165;
      const goalTopY = 110;
      const crossbarHeight = 100;

      const goalie = goalieRef.current;
      // Guaranteed goal: disabled goalie catch collision block
      if (false && ball.y <= goalie.y + 15 && ball.y >= goalie.y - 15 && ball.z < 60) {
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

      // Hit Left/Right Posts
      if (Math.abs(ball.x - goalLeft) < 14 && ball.y <= goalTopY && ball.y >= goalTopY - 20) {
        if (ball.z < crossbarHeight) {
          ball.vx = -ball.vx * 0.7;
          ball.vy = Math.abs(ball.vy) * 0.5;
          setGameState("post");
          triggerCameraShake(400);
          return;
        }
      }
      if (Math.abs(ball.x - goalRight) < 14 && ball.y <= goalTopY && ball.y >= goalTopY - 20) {
        if (ball.z < crossbarHeight) {
          ball.vx = -ball.vx * 0.7;
          ball.vy = Math.abs(ball.vy) * 0.5;
          setGameState("post");
          triggerCameraShake(400);
          return;
        }
      }

      // Back of Net Check
      if (ball.y <= 100) {
        ball.active = false;
        
        if (ball.x > goalLeft && ball.x < goalRight && ball.z < 85) {
          setGameState("goal");
          setHomeScore(1); // update flip scoreboard score
          setGoalPos({ x: ball.x, y: ball.y });
          setShowExplosion(true);
          triggerCameraShake(600);
          
          playWhistle();
          playExplosionSound(); 
          playCrowdGoal();      

          setTimeout(() => {
            setGameState("pack-opening");
          }, 2400);
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

      // Net lines structure
      ctx.strokeStyle = "rgba(123, 47, 255, 0.15)";
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

      // High-glow posts rendering
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.lineWidth = 5.5;
      ctx.lineCap = "round";

      ctx.strokeStyle = "#bd00ff";
      ctx.shadowColor = "#bd00ff";
      ctx.beginPath();
      ctx.moveTo(goalLeft, goalTop);
      ctx.lineTo(goalLeft, goalTop - 10);
      ctx.stroke();

      ctx.strokeStyle = "#00f5ff";
      ctx.shadowColor = "#00f5ff";
      ctx.beginPath();
      ctx.moveTo(goalRight, goalTop);
      ctx.lineTo(goalRight, goalTop - 10);
      ctx.stroke();

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
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.beginPath();
      ctx.ellipse(0, 30, isDiving ? 32 : 22, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Laser goalie styling
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#bd00ff";
      ctx.lineCap = "round";

      if (isDiving) {
        const factor = g.state === "diving-left" ? -1 : 1;
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

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(factor * 26, -10, 8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = "#bd00ff";
        ctx.lineWidth = 6.5;
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(0, 10);
        ctx.stroke();

        ctx.strokeStyle = "#00f5ff";
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(-22, -34);
        ctx.moveTo(0, -12);
        ctx.lineTo(22, -34);
        ctx.stroke();

        ctx.strokeStyle = "#bd00ff";
        ctx.lineWidth = 5.5;
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(-16, 32);
        ctx.moveTo(0, 10);
        ctx.lineTo(16, 32);
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -28, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawBall = (ctx) => {
      const b = ballRef.current;
      
      // Dynamic Shadow (Parallax projection)
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.arc(b.x + b.z * 0.35, b.y + b.z * 0.25, Math.max(4, b.radius - b.z * 0.3), 0, Math.PI * 2);
      ctx.fill();

      // Motion Blur Trails
      if (b.trail.length > 1) {
        ctx.save();
        ctx.shadowColor = "#ccff00";
        ctx.shadowBlur = 10;
        
        for (let i = 1; i < b.trail.length; i++) {
          const t1 = b.trail[i - 1];
          const t2 = b.trail[i];
          const alpha = (i / b.trail.length) * 0.35;
          
          ctx.beginPath();
          ctx.moveTo(t1.x, t1.y - t1.z);
          ctx.lineTo(t2.x, t2.y - t2.z);
          ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
          ctx.lineWidth = Math.max(1, (i / b.trail.length) * 6);
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.save();
      ctx.translate(b.x, b.y - b.z);
      ctx.shadowColor = "#ccff00";
      ctx.shadowBlur = b.active ? 18 : 5;

      const scaleSize = Math.max(8, b.radius + b.z * 0.15);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(0, 0, scaleSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#0a0a0f";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, scaleSize, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#00f5ff";
      ctx.beginPath();
      ctx.arc(0, 0, scaleSize * 0.45, 0, Math.PI * 2);
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

    animationFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
    };
  }, [gameState]);

  // Lightning keyframes
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
    <div className={`p-[2.5px] rounded-[24px] bg-gradient-to-tr from-[#7b2fff] via-[#00f5ff] to-[#ffd700] shadow-[0_0_35px_rgba(123,47,255,0.25)] max-w-4xl w-full mx-auto transition-all duration-300 relative ${
      cameraShake ? "camera-shake" : ""
    }`}>
      
      {/* Floating Sound Toggle */}
      <button
        onClick={handleToggleMute}
        className="absolute top-4 left-4 z-40 bg-black/60 backdrop-blur border border-white/10 hover:border-[#00f5ff] w-9 h-9 rounded-full flex items-center justify-center text-slate-300 hover:text-[#00f5ff] transition-all cursor-pointer"
        title={soundMuted ? "Unmute sounds" : "Mute sounds"}
      >
        {soundMuted ? <FiVolumeX size={15} /> : <FiVolume2 size={15} className="animate-pulse" />}
      </button>

      <div
        ref={containerRef}
        className="relative w-full rounded-[22px] overflow-hidden bg-[#05060b] shadow-2xl flex flex-col justify-between"
      >
        
        {/* ESPN/FIFA HUD Scoreboard */}
        {gameState !== "pack-opening" && gameState !== "full-time" && (
          <div className="absolute top-4 right-4 z-30 flex items-center bg-black/85 backdrop-blur border border-cyan-400/25 rounded-md px-3.5 py-1.5 font-display text-[10px] sm:text-xs font-black uppercase tracking-wider text-white shadow-[0_0_12px_rgba(0,245,255,0.15)]">
            <span className="text-[#00f5ff] text-glow-cyan mr-2">TDC INTRO</span>
            <div className="flex items-center gap-1.5 bg-neutral-900 px-2.5 py-0.5 rounded border border-white/5">
              <span className="font-mono text-white">TDC</span>
              <span className="px-1.5 bg-[#7b2fff] text-white rounded font-mono font-black scale-y-95">
                {homeScore}
              </span>
              <span className="text-slate-500 font-mono">:</span>
              <span className="px-1.5 bg-neutral-800 text-white rounded font-mono font-black scale-y-95">
                {awayScore}
              </span>
              <span className="font-mono text-slate-400">GST</span>
            </div>
            <span className="ml-3 font-mono text-[#ffd700] text-glow-gold">
              {String(matchTime.min).padStart(2, "0")}:{String(matchTime.sec).padStart(2, "0")}
            </span>
          </div>
        )}

        {/* Shifting side chevrons overlays */}
        {gameState !== "pack-opening" && gameState !== "full-time" && (
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

        {/* Goal Explosion overlay */}
        {showExplosion && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            <GoalExplosion goalX={goalPos.x} goalY={goalPos.y} />
          </div>
        )}

        {/* Cinematic Stadium Intro Overlay */}
        {gameState === "stadium-intro" && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black z-40 flex items-center justify-center overflow-hidden pointer-events-none"
          >
            {introStage === "black" && (
              <span className="font-display font-black text-xs text-slate-500 uppercase tracking-widest animate-pulse">
                INITIALIZING STADIUM CAMERA REEL...
              </span>
            )}

            {introStage === "sweep" && (
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Diagonal Sweeping Light beams */}
                <div 
                  className="absolute w-[200vw] h-[40vh] bg-gradient-to-r from-transparent via-[#00f5ff]/20 to-transparent transform -rotate-45 -translate-x-full animate-spin"
                  style={{ animationDuration: "3s" }}
                />
                <div 
                  className="absolute w-[200vw] h-[40vh] bg-gradient-to-r from-transparent via-[#7b2fff]/20 to-transparent transform rotate-45 translate-x-full animate-spin"
                  style={{ animationDuration: "2.5s" }}
                />
                <div className="text-center relative z-10 flex flex-col items-center">
                  <h2 className="fc-title-slanted text-3xl sm:text-5xl font-black bg-gradient-to-r from-[#ffd700] via-white to-[#00f5ff] bg-clip-text text-transparent text-glow-cyan animate-pulse">
                    TDC ARENA STADIUM
                  </h2>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-widest mt-2 uppercase">
                    MATCH DAY LIVE • ROUND OF 16 PORTFOLIO
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Interactive CountDown 3..2..1 overlay */}
        {gameState === "countdown" && (
          <div className="absolute inset-0 bg-black/45 z-30 flex items-center justify-center pointer-events-none">
            <motion.h1
              key={countdownVal}
              initial={{ scale: 3.5, opacity: 0, rotate: -15 }}
              animate={{ scale: [3.5, 1, 1.1, 1], opacity: 1, rotate: 0 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="font-display font-black text-8xl sm:text-9xl text-glow-cyan bg-gradient-to-b from-white to-[#00f5ff] bg-clip-text text-transparent"
            >
              {countdownVal}
            </motion.h1>
          </div>
        )}

        {/* AIMING & IN GAME UI OVERLAYS */}
        <div className="absolute inset-x-0 bottom-6 flex flex-col items-center justify-center z-30 pointer-events-auto">
          {gameState === "intro" && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-6 rounded-2xl bg-[#090a0f]/95 border border-[#7b2fff]/40 max-w-sm mx-4 backdrop-blur-md shadow-[0_0_20px_rgba(123,47,255,0.2)]"
            >
              <h3 className="fc-title-slanted text-xl sm:text-2xl font-black text-[#7b2fff] tracking-wider mb-2 drop-shadow-[0_0_8px_#7b2fff]">
                PENALTY UNLOCK MODE
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                Chào mừng bạn đến với Hồ sơ Trần Trọng Tín! Hãy thực hiện một cú sút Penalty thành công để kích hoạt đường truyền giải mã hồ sơ.
              </p>
              <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-4 font-bold">
                [Nhấn phím D hoặc nút dưới để bắt đầu]
              </span>
              <button
                onClick={triggerStadiumIntro}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#00f5ff] via-[#7b2fff] to-[#ffd700] text-[#05060b] font-mono font-extrabold tracking-widest text-xs uppercase flex items-center justify-center gap-2 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 w-full border border-white/10 btn-shimmer cursor-pointer"
              >
                <FiPlay size={14} className="fill-[#05060b]" />
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
              <div className="px-5 py-2.5 rounded-xl bg-[#0a0a0f]/95 border border-[#00f5ff]/40 text-center shadow-[0_0_15px_rgba(0,245,255,0.25)]">
                <span className="block text-[10px] font-mono text-[#ffd700] text-glow-gold uppercase tracking-widest font-black animate-pulse">
                  NHẤN PHÍM D HOẶC NÚT ĐỂ SÚT!
                </span>
                <span className="block text-[9px] font-sans text-slate-300 mt-0.5">
                  Đang dao động nhắm góc...
                </span>
              </div>
              <button
                onClick={handleKick}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-[#00f5ff] via-[#7b2fff] to-[#ffd700] text-black font-display font-extrabold text-xs uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] transition-all duration-300 flex items-center gap-2 cursor-pointer border border-white/20 shadow-md shadow-cyan-500/20 btn-shimmer"
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
              className="text-center p-6 rounded-2xl bg-[#0a0a0f]/95 border border-rose-500/30 max-w-sm mx-4 backdrop-blur-md"
            >
              <h3 className="fc-title-slanted text-xl sm:text-2xl font-black text-rose-500 tracking-wider mb-2">
                {gameState === "saved" ? "KICK BLOCKED!" : "MISSED THE GOAL!"}
              </h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed mb-4">
                Cản phá xuất sắc hoặc bóng trúng cột dọc! Hãy thử căn lại góc sút chính xác để ghi bàn.
              </p>
              <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-4 font-bold">
                [Nhấn phím D để thử lại]
              </span>
              <button
                onClick={handleRetry}
                className="px-6 py-3 rounded-full bg-rose-500 text-white font-mono font-bold tracking-widest text-xs uppercase flex items-center justify-center gap-2 hover:scale-105 hover:bg-rose-400 transition-all duration-300 w-full shadow-lg shadow-rose-500/20 cursor-pointer"
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
              <h2 className="fc-title-slanted text-6xl sm:text-8xl font-black text-[#00f5ff] text-glow-cyan animate-bounce">
                GOAL!!!
              </h2>
              <span className="px-4 py-1.5 rounded-full bg-black/60 border border-[#ffd700]/30 text-[10px] font-mono text-[#ffd700] text-glow-gold uppercase tracking-widest font-black">
                ★ ĐÃ ĐỒNG BỘ DỮ LIỆU SIÊU SAO ★
              </span>
            </motion.div>
          )}
        </div>

        {/* 🎬 DYNAMIC FULL SCREEN EA SPORTS PACK OPENING OVERLAY */}
        {gameState === "pack-opening" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 w-screen h-screen z-50 overflow-hidden"
          >
            {/* Dark nebula auroras */}
            <div className="absolute inset-0 bg-[#040408] overflow-hidden pointer-events-none z-0">
              <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
              
              <div className="absolute -left-20 top-1/4 w-[600px] h-[600px] bg-[#7b2fff]/15 blur-[160px] rounded-full animate-pulse" />
              <div className="absolute -right-20 top-1/4 w-[600px] h-[600px] bg-[#ffd700]/10 blur-[160px] rounded-full animate-pulse" />
              
              <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#7b2fff]/5 via-transparent to-transparent" />

              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] rounded-full border border-fuchsia-400/5 bg-[repeating-conic-gradient(from_0deg,rgba(123,47,255,0.03)_0deg_15deg,transparent_15deg_30deg)] animate-spin pointer-events-none" 
                style={{ animationDuration: "40s" }}
              />

              <div className="absolute left-16 top-1/2 -translate-y-1/2 pointer-events-none z-10 opacity-30 flex flex-col gap-4 text-[#7b2fff] drop-shadow-[0_0_12px_#7b2fff] animate-pulse">
                <span className="text-4xl font-extrabold">&gt;&gt;&gt;</span>
              </div>
              <div className="absolute right-16 top-1/2 -translate-y-1/2 pointer-events-none z-10 opacity-30 flex flex-col gap-4 text-[#ffd700] drop-shadow-[0_0_12px_#ffd700] animate-pulse">
                <span className="text-4xl font-extrabold">&lt;&lt;&lt;</span>
              </div>
            </div>

            {/* Rising dust particles */}
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

            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 bg-white z-50 pointer-events-none"
            />

            {/* Shockwaves */}
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

            {/* Lightning strikes */}
            <motion.svg
              className="absolute top-0 left-0 w-full h-full pointer-events-none z-30 drop-shadow-[0_0_20px_rgba(123,47,255,0.85)]"
              viewBox="0 0 1000 800"
              fill="none"
              stroke="#7b2fff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={lightningStrikeAnimation}
            >
              <path d="M0,0 L180,150 L120,200 L320,380 L260,420 L490,240" />
            </motion.svg>

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
            </motion.svg>

            <div className="absolute top-8 inset-x-0 flex flex-col items-center pointer-events-none z-20">
              <span className="px-5 py-2 rounded-full bg-[#00f5ff]/10 border border-[#00f5ff]/35 text-[#00f5ff] text-glow-cyan font-display font-black text-[10px] uppercase tracking-widest animate-pulse shadow-[0_0_12px_rgba(0,245,255,0.2)]">
                ★★★ UNLOCKED: SQUAD SPECIALIST ★★★
              </span>
            </div>

            {/* Center Box Pedestal stage */}
            <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm flex items-center justify-center min-h-[380px] sm:min-h-[440px] z-20">
              <svg
                viewBox="0 0 100 100"
                className="absolute w-[310px] h-[310px] sm:w-[410px] sm:h-[410px] text-fuchsia-500/10 fill-current drop-shadow-[0_0_35px_rgba(123,47,255,0.3)] pointer-events-none z-0 translate-y-[-20px] animate-pulse"
              >
                <path d="M50,10 C53,10 56,7 56,4 C56,1 53,-2 50,-2 C47,-2 44,1 44,4 C44,7 47,10 50,10 Z M50,12 C46,12 43,15 42,19 L32,8 L24,10 L30,22 L38,24 L42,32 L40,65 L26,90 L33,94 L50,70 L67,94 L74,90 L60,65 L58,32 L62,24 L70,22 L76,10 L68,8 L58,19 C57,15 54,12 50,12 Z" />
              </svg>

              <div className="absolute bottom-[-15px] left-1/2 -translate-x-1/2 w-72 h-10 bg-gradient-to-r from-[#7b2fff]/20 to-[#00f5ff]/20 rounded-full border border-[#00f5ff]/30 shadow-[0_0_35px_rgba(0,245,255,0.45)] pointer-events-none z-0 transform scale-y-[0.3]">
                <div className="absolute inset-2 bg-[#05060b] rounded-full border border-[#7b2fff]/30" />
              </div>

              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: [0, 1.05, 0.95, 1], rotate: 0 }}
                transition={{ duration: 1.3, ease: "easeOut" }}
                className="relative z-10"
              >
                <div className="absolute -inset-6 bg-gradient-to-r from-[#7b2fff] via-[#00f5ff] to-[#ffd700] opacity-80 blur-3xl animate-pulse pointer-events-none" />
                
                {/* Neon flow shields around card */}
                <svg
                  className="absolute -inset-[11px] w-[calc(100%+22px)] h-[calc(100%+22px)] pointer-events-none z-20"
                  viewBox="0 0 340 500"
                >
                  <motion.path
                    d="M20,60 L170,10 L320,60 L320,440 L170,490 L20,440 Z"
                    fill="none"
                    stroke="#7b2fff"
                    strokeWidth="4.0"
                    strokeDasharray="90 140"
                    animate={{ strokeDashoffset: [0, -460] }}
                    transition={{ duration: 2.0, repeat: Infinity, ease: "linear" }}
                    className="drop-shadow-[0_0_15px_#7b2fff]"
                  />
                  <motion.path
                    d="M20,60 L170,10 L320,60 L320,440 L170,490 L20,440 Z"
                    fill="none"
                    stroke="#00f5ff"
                    strokeWidth="3.0"
                    strokeDasharray="60 170"
                    animate={{ strokeDashoffset: [230, -230] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                    className="drop-shadow-[0_0_12px_#00f5ff]"
                  />
                </svg>

                <div className="scale-[0.7] sm:scale-[0.88] md:scale-95 origin-center">
                  <PlayerCard />
                </div>
              </motion.div>
            </div>

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
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono tracking-widest mt-1.5 uppercase font-bold">
                  FULLSTACK & FRONTEND DEVELOPER • 99 OVR
                </p>
              </div>

              <button
                onClick={triggerFullTime}
                className="px-10 py-4 rounded-full bg-gradient-to-r from-[#7b2fff] via-[#00f5ff] to-[#ffd700] text-[#05060b] font-display font-extrabold text-xs uppercase tracking-widest hover:scale-105 hover:shadow-2xl hover:shadow-[#7b2fff]/45 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-white/20 shadow-lg btn-shimmer"
              >
                <span>TIẾP TỤC CHINH PHỤC</span>
                <FiArrowRight size={14} />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* 🎬 DYNAMIC FULL TIME CINEMATIC OVERLAY */}
        {gameState === "full-time" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.015)_1px,transparent_1px)] bg-[size:25px_25px] pointer-events-none" />

            <div className="space-y-6 max-w-md relative z-10">
              
              <motion.div
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 1.1, 0.95, 1], opacity: 1 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
                className="space-y-2"
              >
                <span className="px-4 py-1.5 rounded bg-[#ffd700]/10 border border-[#ffd700]/40 text-[#ffd700] text-glow-gold font-mono text-[10px] tracking-widest font-black uppercase">
                  ★★★ DECODING SUCCESSFUL ★★★
                </span>
                
                <h1 className="fc-title-slanted text-6xl sm:text-7xl font-black text-white text-glow-cyan tracking-widest leading-none">
                  FULL <span className="text-[#00f5ff]">TIME</span>
                </h1>
                
                <h3 className="text-xs sm:text-sm font-mono text-[#ffd700] text-glow-gold tracking-widest uppercase font-bold mt-2">
                  CHIẾN THẮNG & MỞ KHÓA HỒ SƠ!
                </h3>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="p-5 rounded-2xl bg-black/60 border border-white/5 space-y-3 shadow-xl"
              >
                <div className="flex justify-between text-[11px] font-mono text-slate-400 border-b border-white/5 pb-2">
                  <span>TRẬN ĐẤU</span>
                  <span>PENALTY DECIDER</span>
                </div>
                
                <div className="flex justify-around items-center py-2">
                  <div className="text-center">
                    <span className="block text-2xl font-black text-white font-display">TDC</span>
                    <span className="text-[10px] font-mono text-slate-500">HOME</span>
                  </div>
                  <div className="px-5 py-2 bg-gradient-to-r from-[#7b2fff] to-[#00f5ff] rounded-xl text-3xl font-display font-black text-white tracking-widest shadow-lg shadow-cyan-400/10">
                    1 - 0
                  </div>
                  <div className="text-center">
                    <span className="block text-2xl font-black text-slate-400 font-display">GUEST</span>
                    <span className="text-[10px] font-mono text-slate-500">AWAY</span>
                  </div>
                </div>

                <p className="text-slate-400 text-[10px] sm:text-xs leading-relaxed font-sans mt-2 pt-2 border-t border-white/5">
                  Dữ liệu kỹ năng và dự án đã được giải mã đầy đủ. Mức sẵn sàng tiếp nhận công việc: 100%!
                </p>
              </motion.div>

              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="pt-4"
              >
                <button
                  onClick={() => {
                    playBeepSound();
                    onGoalScored();
                  }}
                  className="px-10 py-4.5 rounded-full bg-gradient-to-r from-[#7b2fff] via-[#00f5ff] to-[#7b2fff] text-white font-display font-black text-xs uppercase tracking-widest hover:scale-105 hover:shadow-[0_0_30px_rgba(0,245,255,0.45)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-white/20 shadow-lg btn-shimmer w-full"
                >
                  <span>BƯỚC VÀO HỒ SƠ CHI TIẾT</span>
                  <FiArrowRight size={15} />
                </button>
              </motion.div>

            </div>
          </motion.div>
        )}

        {/* Cyber overlay telemetry grids */}
        {gameState !== "pack-opening" && gameState !== "full-time" && (
          <>
            <div className="absolute top-4 left-16 font-mono text-[9px] text-[#00f5ff]/40 z-20 pointer-events-none hidden sm:block">
              MATCH: PENALTY_SHOOTOUT_MODE<br />
              SYS.CAMERA.STATUS: ACTIVE<br />
              DILATION_TIME_SCALE: {gameState === "shooting" ? "DILATED" : "1.00"}
            </div>
            <div className="absolute top-16 right-4 font-mono text-[9px] text-[#00f5ff]/40 z-20 pointer-events-none text-right hidden sm:block">
              BATTERY_SPEED: 12.8M/S<br />
              TDC_COORDINATES: TDC_2026<br />
              GOALIE.AI.INTELLIGENCE: 60%
            </div>
          </>
        )}
      </div>
    </div>
  );
}
