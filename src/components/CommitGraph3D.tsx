import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface Commit3DNode {
  hash: string;
  msg: string;
  branch: string;
  color?: string;
  isHead?: boolean;
}

interface CommitGraph3DProps {
  commits: Commit3DNode[];
  currentBranch: string;
  className?: string;
  hasConflict?: boolean;
}

export const CommitGraph3D: React.FC<CommitGraph3DProps> = ({
  commits,
  currentBranch,
  className = '',
  hasConflict = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const commitsRef = useRef(commits);
  const conflictRef = useRef(hasConflict);

  useEffect(() => {
    commitsRef.current = commits;
  }, [commits]);

  useEffect(() => {
    conflictRef.current = hasConflict;
  }, [hasConflict]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 200;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 8);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 3, 20);
    pointLight.position.set(0, 4, 5);
    scene.add(pointLight);

    // 5. Dynamic Node Group
    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    let nodeMeshes: THREE.Mesh[] = [];
    let lineMeshes: THREE.Line[] = [];

    const rebuildGraph = () => {
      // Clear old meshes
      nodeMeshes.forEach(m => graphGroup.remove(m));
      lineMeshes.forEach(l => graphGroup.remove(l));
      nodeMeshes = [];
      lineMeshes = [];

      const currentList = commitsRef.current;
      const count = currentList.length;
      if (count === 0) return;

      const spacing = 2.0;
      const startX = -((count - 1) * spacing) / 2;
      const positions: THREE.Vector3[] = [];

      currentList.forEach((c, idx) => {
        const isHead = idx === count - 1;
        const isBranch = c.branch !== 'main';
        const posX = startX + idx * spacing;
        const posY = isBranch ? 0.7 : 0;
        const posZ = isBranch ? 0.4 : 0;
        const pos = new THREE.Vector3(posX, posY, posZ);
        positions.push(pos);

        // Commit sphere geometry
        const geom = new THREE.SphereGeometry(isHead ? 0.42 : 0.32, 24, 24);
        const mat = new THREE.MeshStandardMaterial({
          color: conflictRef.current && isHead
            ? 0xFF6B81 // danger
            : isHead
            ? 0x38BDF8 // signature light blue
            : isBranch
            ? 0x7DD3FC // icy cyan-blue
            : 0x1E3A8A, // deep navy-blue node
          metalness: 0.7,
          roughness: 0.3,
          emissive: isHead ? 0x075985 : 0x000000,
          emissiveIntensity: 0.5,
        });

        const sphere = new THREE.Mesh(geom, mat);
        sphere.position.copy(pos);
        // Animate pop-in scale
        sphere.scale.set(0.1, 0.1, 0.1);
        graphGroup.add(sphere);
        nodeMeshes.push(sphere);

        // Orbital halo for HEAD commit
        if (isHead) {
          const haloGeom = new THREE.RingGeometry(0.55, 0.65, 32);
          const haloMat = new THREE.MeshBasicMaterial({
            color: 0x38BDF8,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.85,
          });
          const halo = new THREE.Mesh(haloGeom, haloMat);
          halo.position.copy(pos);
          halo.rotation.x = Math.PI / 2.5;
          graphGroup.add(halo);
          nodeMeshes.push(halo);
        }
      });

      // Connecting lines between consecutive nodes
      for (let i = 0; i < positions.length - 1; i++) {
        const lineGeom = new THREE.BufferGeometry().setFromPoints([positions[i], positions[i + 1]]);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x38BDF8,
          linewidth: 2,
          transparent: true,
          opacity: 0.8,
        });
        const line = new THREE.Line(lineGeom, lineMat);
        graphGroup.add(line);
        lineMeshes.push(line);
      }
    };

    rebuildGraph();

    // 6. Resize listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 200;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle float oscillation in 3D
      graphGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.12;
      graphGroup.rotation.x = Math.cos(elapsed * 0.6) * 0.08;

      // Smooth pop-in scale for node spheres
      nodeMeshes.forEach(mesh => {
        if (mesh.scale.x < 1.0) {
          mesh.scale.x += (1.0 - mesh.scale.x) * 0.15;
          mesh.scale.y += (1.0 - mesh.scale.y) * 0.15;
          mesh.scale.z += (1.0 - mesh.scale.z) * 0.15;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [commits.length, hasConflict, currentBranch]);

  return (
    <div className={`relative rounded-[12px] bg-[#07080F] border border-border overflow-hidden ${className}`}>
      {/* HUD Overlay Bar */}
      <div className="absolute top-2.5 inset-x-3.5 flex items-center justify-between text-xs font-mono z-10 pointer-events-none">
        <div className="flex items-center gap-2 text-cyan font-bold bg-surface/90 px-2.5 py-1 rounded-[6px] border border-border">
          <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
          <span>3D LIVE COMMIT TOPOLOGY</span>
        </div>
        <span className="text-text-muted bg-surface/90 px-2.5 py-1 rounded-[6px] border border-border">
          Active: <strong className="text-text">{currentBranch}</strong>
        </span>
      </div>

      <div ref={mountRef} className="w-full h-44 sm:h-52 cursor-grab active:cursor-grabbing" />

      {/* 2D Node Badges below 3D viewport for readability */}
      <div className="flex items-center gap-2 overflow-x-auto px-3.5 py-2.5 border-t border-border bg-surface font-mono text-xs scrollbar-thin">
        {commits.map((c, i) => (
          <div
            key={c.hash}
            className={`px-2.5 py-1 rounded-[8px] border text-left shrink-0 transition-all ${
              i === commits.length - 1
                ? 'bg-surface-2 border-accent text-accent'
                : 'bg-surface-2 border-border text-text-muted'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span className={`w-2 h-2 rounded-full ${i === commits.length - 1 ? 'bg-accent' : 'bg-border'}`} />
              <span>{c.hash}</span>
            </div>
            <div className="text-xs text-text-muted truncate max-w-[130px] font-sans mt-0.5">
              {c.msg}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
