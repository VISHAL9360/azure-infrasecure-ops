"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCloudCanvas({ activeNode, onSelectNode }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090e, 0.04);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 4, 11);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00d2ff, 3, 25);
    pointLight.position.set(0, 6, 4);
    scene.add(pointLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 2, 25);
    purpleLight.position.set(-6, -2, -4);
    scene.add(purpleLight);

    // 3. Central Cloud Core Globe
    const globeGeo = new THREE.IcosahedronGeometry(2.2, 3);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x0078d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.2,
      metalness: 0.8,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(1.6, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x003366,
      transparent: true,
      opacity: 0.5,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerSphere);

    // 4. Orbiting Service Nodes
    const nodeDefs = [
      { id: "lb", name: "Azure Load Balancer", color: 0x00d2ff, pos: [0, 2.8, 0] },
      { id: "vmss1", name: "VMSS-Instance-01", color: 0x10b981, pos: [-3.2, 0.8, 1.5] },
      { id: "vmss2", name: "VMSS-Instance-02", color: 0x10b981, pos: [3.2, 0.8, 1.5] },
      { id: "vmss3", name: "VMSS-Instance-03", color: 0x10b981, pos: [0, -1.8, 3.2] },
      { id: "sentinel", name: "Microsoft Sentinel", color: 0xa855f7, pos: [-2.5, -2.2, -2.0] },
      { id: "storage", name: "Managed Storage", color: 0xf59e0b, pos: [2.8, -1.8, -1.8] },
    ];

    const nodeMeshes = [];
    const connectionLines = [];

    nodeDefs.forEach((def) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(...def.pos);

      // Node Sphere
      const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: def.color,
        emissiveIntensity: 0.6,
        roughness: 0.3,
      });
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeGroup.add(mesh);

      // Outer Halo Ring
      const ringGeo = new THREE.RingGeometry(0.48, 0.54, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: def.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      nodeGroup.add(ring);

      nodeGroup.userData = def;
      scene.add(nodeGroup);
      nodeMeshes.push({ group: nodeGroup, ring, def });

      // Connection Line to Central Core
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(...def.pos)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: def.color,
        transparent: true,
        opacity: 0.25,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      connectionLines.push(line);
    });

    // 5. Surrounding Stardust Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const r = 5 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x00d2ff,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 6. Mouse Interaction & Tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
    };
    container.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 7. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate globe and particles
      globe.rotation.y = elapsed * 0.15;
      globe.rotation.x = Math.sin(elapsed * 0.1) * 0.1;
      particleSystem.rotation.y = elapsed * 0.05;

      // Animate nodes pulsation & ring rotation
      nodeMeshes.forEach(({ group, ring }, idx) => {
        ring.rotation.z = elapsed * (1 + idx * 0.2);
        group.position.y += Math.sin(elapsed * 2 + idx) * 0.003;
      });

      // Smooth camera drag
      targetX += (mouseX * 2.5 - targetX) * 0.05;
      targetY += (mouseY * 1.5 - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = 4 + targetY;
      camera.lookAt(0, 0.2, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={containerRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(7, 9, 14, 0.75)",
          backdropFilter: "blur(8px)",
          padding: "6px 14px",
          borderRadius: "9999px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: "0.75rem",
          color: "#94a3b8",
        }}
      >
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00d2ff", boxShadow: "0 0 8px #00d2ff" }}></span>
        <span>Interactive 3D Azure Mesh • Drag to Orbit</span>
      </div>
    </div>
  );
}
