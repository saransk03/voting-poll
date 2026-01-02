// src/Components/DigitalGlobeBackground.jsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DigitalGlobeBackground = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const frameIdRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // ============ SCENE SETUP ============
    const scene = new THREE.Scene();
    // Deep space fog
    scene.fog = new THREE.FogExp2(0x030305, 0.002);

    // ============ CAMERA ============
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 4;
    camera.position.y = 0.5;

    // ============ RENDERER ============
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // ============ GROUP TO HOLD GLOBE ELEMENTS ============
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // ============ 1. DIGITAL GLOBE (Points) ============
    const geometry = new THREE.IcosahedronGeometry(2, 4); // Increased detail for globe look

    const pointsMat = new THREE.PointsMaterial({
      size: 0.02,
      color: 0x6366f1, // Indigo
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const pointsMesh = new THREE.Points(geometry, pointsMat);
    globeGroup.add(pointsMesh);

    // ============ 2. CONNECTING LINES (Network Wireframe) ============
    const wireGeo = new THREE.IcosahedronGeometry(2.01, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireMesh);

    // ============ 3. FLOATING DATA PACKETS (Orbiting Particles) ============
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 400;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      // Random spread around the globe (spherical coordinates)
      const r = 2.5 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);     // x
      posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta); // y
      posArray[i * 3 + 2] = r * Math.cos(phi);                   // z
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: 0xa78bfa, // Light Violet
      transparent: true,
      opacity: 0.4,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    globeGroup.add(particlesMesh);

    // ============ INTERACTION VARIABLES ============
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // ============ EVENT HANDLERS ============

    // Mouse Move Handler
    const handleMouseMove = (event) => {
      mouseX = event.clientX - windowHalfX;
      mouseY = event.clientY - windowHalfY;
    };

    // Touch Move Handler (Mobile Support)
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

      targetX = mouseX * 0.0005;
      targetY = mouseY * 0.0005;

      // Rotate Globe constantly
      globeGroup.rotation.y += 0.001;

      // Add "breathing" effect to points
      pointsMat.size = 0.02 + Math.sin(elapsedTime * 2) * 0.005;

      // Mouse Interaction Easing
      globeGroup.rotation.y += 0.05 * (targetX - globeGroup.rotation.y);
      globeGroup.rotation.x += 0.05 * (targetY - globeGroup.rotation.x);

      // Rotate particle ring separately
      particlesMesh.rotation.y = -elapsedTime * 0.05;
      particlesMesh.rotation.z = elapsedTime * 0.02;

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

      // Cancel animation frame
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      // Remove canvas from DOM
      if (container && rendererRef.current?.domElement) {
        container.removeChild(rendererRef.current.domElement);
      }

      // Dispose Three.js resources
      geometry.dispose();
      pointsMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-60"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.6,
      }}
    />
  );
};

export default DigitalGlobeBackground;