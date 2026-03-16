import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import "./LandingPage.css";

// 3D Animated Sphere Component
const AnimatedSphere = () => {
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 100, 200]} scale={2.4}>
        <MeshDistortMaterial
          color="#8B5CF6"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0}
        />
      </Sphere>
    </Float>
  );
};

// 3D Torus Component
const AnimatedTorus = () => {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={1}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.4, 16, 100]} />
        <meshStandardMaterial
          color="#FF9800"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
};

// Custom Cursor Component
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorXSpring = useSpring(cursorX, { stiffness: 700, damping: 30 });
  const cursorYSpring = useSpring(cursorY, { stiffness: 700, damping: 30 });

  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleHover = (e) => {
      if (e.target.closest('button, a, [role="button"], .hoverable')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousemove', handleHover);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousemove', handleHover);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="cursor-dot"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isClicking ? 0.5 : 1,
        }}
      />
      <motion.div
        className="cursor-ring"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          scale: isHovering ? 1.5 : isClicking ? 0.8 : 1,
        }}
        animate={{
          borderColor: isHovering ? '#FF9800' : '#8B5CF6',
        }}
      />
    </>
  );
};

// Magnetic Button Component
const MagneticButton = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// Glitch Text Component
const GlitchText = ({ text }) => {
  return (
    <div className="glitch-wrapper">
      <span className="glitch" data-text={text}>{text}</span>
    </div>
  );
};

// Text Reveal Animation
const textVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: {
      delay: i * 0.03,
    },
  }),
};

const AnimatedText = ({ text, className }) => {
  return (
    <motion.span className={className}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          custom={index}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

// Main Landing Page Component
export default function LandingPage() {
  const [init, setInit] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const particlesOptions = {
    particles: {
      number: { value: 80, density: { enable: true, area: 800 } },
      color: { value: ["#8B5CF6", "#FF9800", "#06B6D4"] },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "bounce" },
      },
      links: {
        enable: true,
        distance: 150,
        color: "#8B5CF6",
        opacity: 0.2,
        width: 1,
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { quantity: 4 },
      },
    },
  };

  return (
    <div className="landing-page">
      <CustomCursor />
      
      {/* Animated Background Gradient */}
      <div 
        className="gradient-bg"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
        }}
      />
      
      {/* Particles Background */}
      {init && (
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="particles-bg"
        />
      )}

      {/* Animated Grid */}
      <div className="grid-bg"></div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="nav-logo hoverable"
          whileHover={{ scale: 1.05 }}
        >
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="gradient" x1="2" y1="2" x2="22" y2="22">
                  <stop stopColor="#8B5CF6"/>
                  <stop offset="1" stopColor="#FF9800"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">WebRTC<span className="highlight">Pro</span></span>
        </motion.div>

        <div className="nav-buttons">
          <motion.button
            className="btn-ghost hoverable"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join as Guest
          </motion.button>
          <motion.button
            className="btn-outline hoverable"
            whileHover={{ scale: 1.05, borderColor: '#FF9800' }}
            whileTap={{ scale: 0.95 }}
          >
            Register
          </motion.button>
          <MagneticButton className="btn-primary hoverable">
            Login
            <span className="btn-shine"></span>
          </MagneticButton>
        </div>

        <div className="mobile-menu hoverable">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <motion.div
            className="badge"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <span className="badge-dot"></span>
            <span>Now with AI-powered noise cancellation</span>
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="line">
              <AnimatedText text="Connect" className="gradient-text" />
            </span>
            <span className="line">with your loved ones</span>
            <span className="line">
              <GlitchText text="anywhere, anytime" />
            </span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Experience crystal-clear video calls with military-grade encryption.
            Connect with friends, family, or colleagues in stunning HD quality
            with latency as low as 50ms.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <MagneticButton className="btn-cta hoverable">
              <span>Start Free Call</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              <div className="btn-gradient"></div>
            </MagneticButton>
          </motion.div>

          <motion.div
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              { value: '10M+', label: 'Active Users' },
              { value: '99.9%', label: 'Uptime' },
              { value: '150+', label: 'Countries' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="stat-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="hero-visual">
          {/* 3D Canvas */}
          <div className="canvas-container">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} color="#FF9800" />
              <AnimatedSphere />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
          </div>

          {/* Floating Elements */}
          <motion.div
            className="floating-element element-1"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="glass-card">
              <div className="avatar-stack">
                <img src="https://i.pravatar.cc/40?img=1" alt="User 1" />
                <img src="https://i.pravatar.cc/40?img=2" alt="User 2" />
                <img src="https://i.pravatar.cc/40?img=3" alt="User 3" />
                <span className="more">+5</span>
              </div>
              <p>Live call in progress</p>
              <div className="pulse-ring"></div>
            </div>
          </motion.div>

          <motion.div
            className="floating-element element-2"
            animate={{
              y: [0, 15, 0],
              x: [0, -10, 0],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="glass-card stats-card">
              <div className="stat-icon">📊</div>
              <div>
                <span className="stat-number">2.5ms</span>
                <span className="stat-desc">Avg. Latency</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="floating-element element-3"
            animate={{
              y: [0, -25, 0],
              rotate: [0, -10, 10, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="glass-card quality-card">
              <span className="quality-badge">4K</span>
              <span>Ultra HD</span>
            </div>
          </motion.div>

          {/* 3D Torus */}
          <div className="torus-container">
            <Canvas camera={{ position: [0, 0, 4] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <AnimatedTorus />
            </Canvas>
          </div>
        </div>
      </main>
      {/* Animated Background Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
    </div>
  );
}