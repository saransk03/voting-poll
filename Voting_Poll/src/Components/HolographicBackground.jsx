// src/Components/HolographicBackground.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HolographicBackground = () => {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rendererRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // ============ SCENE SETUP ============
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    // ============ CAMERA ============
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // ============ RENDERER ============
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // ============ OBJECTS ============

    // 1. The Core Sphere (Holographic Seed)
    const geometry = new THREE.IcosahedronGeometry(1.5, 2);
    const material = new THREE.MeshBasicMaterial({
      color: 0x10b981, // Tailwind Emerald 500
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // 2. Inner Glowing Core
    const coreGeo = new THREE.IcosahedronGeometry(0.8, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // 3. Particles (Floating Spores)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15; // Spread
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x10b981,
      transparent: true,
      opacity: 0.6,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // ============ INTERACTION VARIABLES ============
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // ============ EVENT HANDLERS ============

    // Mouse Move - document level-ல listen பண்றோம்
    const handleMouseMove = (event) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

    // Touch Move - Mobile support
    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        mouseX = event.touches[0].clientX - windowHalfX;
        mouseY = event.touches[0].clientY - windowHalfY;
      }
    };

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Add Event Listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('resize', handleResize);

    // ============ ANIMATION LOOP ============
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;

      // Rotate Sphere
      sphere.rotation.y += 0.002;
      sphere.rotation.x += 0.001;

      // Gentle float/pulse for sphere
      sphere.position.y = Math.sin(elapsedTime * 0.5) * 0.2;

      // Rotate Core opposite way
      core.rotation.y -= 0.004;
      core.rotation.z += 0.002;

      // Mouse Interaction Easing - இதுதான் cursor follow effect
      sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
      sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);

      // Animate Particles
      particlesMesh.rotation.y = -elapsedTime * 0.05;
      if (mouseY !== 0) {
        particlesMesh.rotation.x = mouseY * 0.0001;
      }

      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // ============ CLEANUP ============
    return () => {
      // Remove event listeners
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);

      // Cancel animation
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      // Remove canvas from DOM
      if (container && rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }

      // Dispose Three.js resources
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="canvas-container"
      className="fixed inset-0 z-0 pointer-events-none opacity-80"
    />
  );
};

export default HolographicBackground;