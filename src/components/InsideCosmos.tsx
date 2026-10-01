import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { nebulaBg } from '../assets/spaceAssets';

interface InsideCosmosProps {
  theme?: 'dark' | 'light-blue';
}

export const InsideCosmos: React.FC<InsideCosmosProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLightBlue, setIsLightBlue] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      const mode = document.documentElement.getAttribute('data-theme');
      setIsLightBlue(mode === 'light-blue');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 400;

    // Starfield stardust
    const starCount = isLightBlue ? 350 : 550;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const lightPalette = [
      new THREE.Color(0x0284C7), // sky blue
      new THREE.Color(0x38BDF8), // electric light blue
      new THREE.Color(0x60A5FA), // soft blue
      new THREE.Color(0x93C5FD), // pale ice blue
      new THREE.Color(0x818CF8), // subtle indigo
    ];

    const darkPalette = [
      new THREE.Color(0xF0F6FF), // soft white
      new THREE.Color(0x38BDF8), // electric light blue
      new THREE.Color(0x7DD3FC), // icy sky blue
      new THREE.Color(0x0284C7), // deep azure
      new THREE.Color(0x94A3B8), // muted slate
    ];

    const palette = isLightBlue ? lightPalette : darkPalette;

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 1600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 800;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: isLightBlue ? 2.2 : 1.8,
      vertexColors: true,
      transparent: true,
      opacity: isLightBlue ? 0.35 : 0.55,
    });

    const starPoints = new THREE.Points(geometry, material);
    scene.add(starPoints);

    let animationFrameId: number;
    let isHidden = document.hidden;

    const onVisibilityChange = () => {
      isHidden = document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (isHidden || prefersReducedMotion) return;

      starPoints.rotation.y += 0.00015;
      starPoints.rotation.x += 0.00008;

      renderer.render(scene, camera);
    };

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animate();
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isLightBlue]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Subtle nebula background */}
      <div 
        className={`absolute inset-0 bg-cover bg-center blur-[3px] scale-105 transition-opacity duration-500 ${
          isLightBlue ? 'opacity-[0.05]' : 'opacity-[0.14]'
        }`}
        style={{ backgroundImage: `url(${nebulaBg})` }}
      />
      {/* Light blue or dark ambient haze */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${
          isLightBlue 
            ? 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(186,230,253,0.45),rgba(240,247,255,0))]' 
            : 'bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(56,189,248,0.12),rgba(255,255,255,0))]'
        }`}
      />
      {/* Starfield canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
