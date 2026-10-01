import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { nebulaBg } from '../assets/spaceAssets';

interface SpaceCanvasProps {
  scrollProgress?: number; // 0 to 1
  mousePos?: { x: number; y: number }; // -0.5 to 0.5
  isWarping?: boolean;
}

export const SpaceCanvas: React.FC<SpaceCanvasProps> = ({
  scrollProgress = 0,
  mousePos = { x: 0, y: 0 },
  isWarping = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  const scrollRef = useRef(scrollProgress);
  const mouseRef = useRef(mousePos);
  const warpingRef = useRef(isWarping);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    mouseRef.current = mousePos;
  }, [mousePos]);

  useEffect(() => {
    warpingRef.current = isWarping;
  }, [isWarping]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060814, 0.015);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 22);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglSupported(false);
    };

    const handleContextRestored = () => {
      setWebglSupported(true);
    };

    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x3b4260, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.5);
    keyLight.position.set(15, 12, 10);
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x06b6d4, 3, 50);
    cyanRimLight.position.set(-15, -5, -8);
    scene.add(cyanRimLight);

    // 5. Starfield Particles (Twinkling)
    const starCount = isMobile ? 800 : 2500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xa5f3fc), // soft cyan
      new THREE.Color(0xfbcfe8), // soft rose
      new THREE.Color(0xfef08a), // soft yellow
      new THREE.Color(0xc4b5fd), // soft violet
    ];

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 120;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 120;
      starPositions[i * 3] = x;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = z;

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.35 : 0.45,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 6. Slow Floating Squares (Geometric space dust)
    const squareCount = isMobile ? 6 : 14;
    const floatingSquares: THREE.LineSegments[] = [];
    const squareMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });

    for (let i = 0; i < squareCount; i++) {
      const sSize = Math.random() * 0.8 + 0.3;
      const sGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(sSize, sSize, 0.02));
      const squareMesh = new THREE.LineSegments(sGeom, squareMat);
      squareMesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      );
      squareMesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      scene.add(squareMesh);
      floatingSquares.push(squareMesh);
    }

    // 7. Occasional Shooting Star
    const shootingStarGeom = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-4, 2.5, -2),
    ]);
    const shootingStarMat = new THREE.LineBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0,
    });
    const shootingStar = new THREE.Line(shootingStarGeom, shootingStarMat);
    scene.add(shootingStar);

    let shootingActive = false;
    let shootingTime = 0;
    let nextShootingDelay = 3 + Math.random() * 4;

    // 8. 3D Planet with Rings
    const planetGroup = new THREE.Group();
    planetGroup.position.set(isMobile ? 8 : 11, 4.5, -16);
    planetGroup.scale.set(0.65, 0.65, 0.65);

    const planetCanvas = document.createElement('canvas');
    planetCanvas.width = 512;
    planetCanvas.height = 256;
    const ctx = planetCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#091e3a');
      grad.addColorStop(0.2, '#1e3a5f');
      grad.addColorStop(0.35, '#0d5c75');
      grad.addColorStop(0.5, '#188296');
      grad.addColorStop(0.65, '#0f4c5c');
      grad.addColorStop(0.85, '#1b263b');
      grad.addColorStop(1, '#0d1b2a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let i = 0; i < 18; i++) {
        const y = Math.random() * 256;
        const h = Math.random() * 8 + 2;
        ctx.fillRect(0, y, 512, h);
      }
    }

    const planetTexture = new THREE.CanvasTexture(planetCanvas);
    const planetGeometry = new THREE.SphereGeometry(3.5, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.65,
      metalness: 0.15,
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetGroup.add(planetMesh);

    // Atmospheric Outer Glow
    const glowGeometry = new THREE.SphereGeometry(3.68, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    planetGroup.add(glowMesh);

    // Rings
    const ringGeometry = new THREE.RingGeometry(4.3, 7.2, 48);
    ringGeometry.rotateX(Math.PI / 2.2);

    const ringCanvas = document.createElement('canvas');
    ringCanvas.width = 256;
    ringCanvas.height = 1;
    const ringCtx = ringCanvas.getContext('2d');
    if (ringCtx) {
      const ringGrad = ringCtx.createLinearGradient(0, 0, 256, 0);
      ringGrad.addColorStop(0, 'rgba(165, 243, 252, 0.1)');
      ringGrad.addColorStop(0.3, 'rgba(196, 181, 253, 0.45)');
      ringGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
      ringGrad.addColorStop(0.7, 'rgba(147, 197, 253, 0.35)');
      ringGrad.addColorStop(0.9, 'rgba(165, 243, 252, 0.15)');
      ringGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ringCtx.fillStyle = ringGrad;
      ringCtx.fillRect(0, 0, 256, 1);
    }

    const ringTexture = new THREE.CanvasTexture(ringCanvas);
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    planetGroup.add(ringMesh);

    planetGroup.rotation.z = THREE.MathUtils.degToRad(24);
    planetGroup.rotation.x = THREE.MathUtils.degToRad(12);
    scene.add(planetGroup);

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    // 9. Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const isWarp = warpingRef.current;
      const warpSpeed = isWarp ? 14 : 1;

      if (!prefersReducedMotion) {
        planetMesh.rotation.y += 0.003 * warpSpeed;
        ringMesh.rotation.z += 0.001 * warpSpeed;

        // Twinkling stars
        starMaterial.opacity = 0.75 + Math.sin(elapsed * 2.5) * 0.15;

        // Floating squares rotation and drift
        floatingSquares.forEach((sq, idx) => {
          sq.rotation.x += 0.005 * (idx % 2 === 0 ? 1 : -1);
          sq.rotation.y += 0.006 * (idx % 3 === 0 ? 1 : -1);
          sq.position.y += Math.sin(elapsed + idx) * 0.004;
        });

        // Shooting star logic
        if (!shootingActive) {
          nextShootingDelay -= delta;
          if (nextShootingDelay <= 0) {
            shootingActive = true;
            shootingTime = 0;
            nextShootingDelay = 4 + Math.random() * 5;
            shootingStar.position.set(
              Math.random() * 20 - 5,
              Math.random() * 10 + 5,
              Math.random() * 10 - 5
            );
          }
        } else {
          shootingTime += delta;
          shootingStar.position.x += 28 * delta;
          shootingStar.position.y -= 16 * delta;
          shootingStarMat.opacity = Math.max(0, 1 - shootingTime * 1.8);
          if (shootingTime > 0.6) {
            shootingActive = false;
            shootingStarMat.opacity = 0;
          }
        }
      }

      // Parallax mouse offsets
      const mouse = mouseRef.current;
      const targetCamX = mouse.x * 2.5;
      const targetCamY = mouse.y * -2.0;

      // Scroll camera flight storytelling
      const progress = scrollRef.current;
      const camStart = new THREE.Vector3(0, 0, 22);
      const camMid1 = new THREE.Vector3(2, -1, 14);
      const camMid2 = new THREE.Vector3(-1.5, -3, 6);
      const camEnd = new THREE.Vector3(0, -5, -2);
      const targetPos = new THREE.Vector3();

      if (progress < 0.33) {
        const t = progress / 0.33;
        targetPos.lerpVectors(camStart, camMid1, t);
      } else if (progress < 0.66) {
        const t = (progress - 0.33) / 0.33;
        targetPos.lerpVectors(camMid1, camMid2, t);
      } else {
        const t = (progress - 0.66) / 0.34;
        targetPos.lerpVectors(camMid2, camEnd, t);
      }

      camera.position.x += (targetPos.x + targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetPos.y + targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetPos.z - camera.position.z) * 0.05;

      // Star drifting or warp
      const positions = starGeometry.attributes.position.array as Float32Array;
      const speed = isWarp ? 3.5 : 0.03;
      for (let i = 0; i < starCount; i++) {
        let z = positions[i * 3 + 2];
        z += speed;
        if (z > 30) {
          z = -70;
        }
        positions[i * 3 + 2] = z;
      }
      starGeometry.attributes.position.needsUpdate = true;

      planetGroup.position.x = 6.5 + mouse.x * 1.5;
      planetGroup.position.y = 1.5 - mouse.y * 1.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      planetGeometry.dispose();
      planetMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-bg"
      aria-hidden="true"
    >
      {!webglSupported && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${nebulaBg})`,
          }}
        />
      )}
    </div>
  );
};
