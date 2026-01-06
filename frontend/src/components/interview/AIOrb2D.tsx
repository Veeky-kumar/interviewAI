'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// --- Types ---
interface AIOrbProps {
  state: 'idle' | 'listening' | 'speaking';
}

// --- Shader Material ---
// This handles the "Glow" and the "Audio Waveform" displacement on the GPU
const OrbShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#06b6d4') },
    uIntensity: { value: 0 }, // 0 = idle, 1 = speaking (high fluctuation)
  },
  vertexShader: `
    uniform float uTime;
    uniform float uIntensity;
    varying float vDistance;

    // --- Simplex Noise Function (Standard WebGL Noise) ---
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 = v - i + dot(i, C.xxx) ;
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; 
      vec3 x3 = x0 - D.yyy;      
      i = mod289(i);
      vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      float n_ = 0.142857142857; 
      vec3  ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z); 
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
    }
    // ---------------------------------------------------

    void main() {
      vec3 pos = position;
      
      // Calculate Noise for Spikes (The "Voice" effect)
      // Faster time scale = faster fluctuations
      float noiseVal = snoise(vec3(pos.x * 0.8, pos.y * 0.8, uTime * 0.8));
      
      // Expand particles outward based on noise and intensity
      float displacement = noiseVal * (uIntensity * 2.5); 
      vec3 finalPos = pos + (normalize(pos) * displacement);

      vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
      
      // Dynamic Point Size
      // Particles get larger when "speaking" (high intensity)
      float baseSize = 4.0;
      float sizeBoost = uIntensity * 15.0; 
      
      // Size attenuation (particles shrink further away)
      gl_PointSize = (baseSize + sizeBoost) * (20.0 / -mvPosition.z);
      
      gl_Position = projectionMatrix * mvPosition;
      
      vDistance = length(finalPos);
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    
    void main() {
      // Circular soft particle
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard; // Make it a circle
      
      // Glow Gradient (Bright center, soft edge)
      float glow = 1.0 - (dist * 2.0);
      glow = pow(glow, 2.0); // Sharpen the glow center
      
      // Alpha
      float alpha = glow * 0.9;
      
      gl_FragColor = vec4(uColor, alpha);
    }
  `
};

// --- 3D Scene Logic ---
const Orb = ({ state }: { state: AIOrbProps['state'] }) => {
  const meshRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  
  // Create Particles once
  const particleCount = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 4.5 + (Math.random() - 0.5) * 0.5; // Radius ~4.5 with slight fuzz
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((stateCtx) => {
    if (!meshRef.current || !shaderRef.current) return;
    const time = stateCtx.clock.getElapsedTime();

    // 1. Rotation: Idle is slow, Speaking is faster/more dynamic
    const rotationSpeed = state === 'speaking' ? 0.2 : 0.05;
    meshRef.current.rotation.y += rotationSpeed * 0.03;
    meshRef.current.rotation.z += rotationSpeed * 0.01;

    // 2. Simulate Audio / Speaking Intensity
    let targetIntensity = 0;
    
    if (state === 'speaking') {
      // Create a pseudo-waveform using sine waves at different frequencies
      // This mimics "talking" vibration without needing real audio input
      const wave = Math.sin(time * 12) * 0.5 + Math.sin(time * 20) * 0.3 + Math.sin(time * 5) * 0.2;
      targetIntensity = 0.4 + Math.max(0, wave) * 0.6; // Base intensity + wave
    } else if (state === 'listening') {
      // Gentle heartbeat pulse
      targetIntensity = 0.1 + Math.sin(time * 3) * 0.05; 
    } else {
      // Idle stillness
      targetIntensity = 0.0;
    }

    // 3. Update Uniforms (Lerp for smooth transitions)
    shaderRef.current.uniforms.uTime.value = time;
    
    shaderRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
      shaderRef.current.uniforms.uIntensity.value,
      targetIntensity,
      0.15 // Transition speed
    );

    // 4. Color Logic
    const targetColor = state === 'speaking' ? new THREE.Color('#22d3ee') // Bright Cyan (Tailwind cyan-400)
                      : state === 'listening' ? new THREE.Color('#a78bfa') // Purple (Tailwind violet-400)
                      : new THREE.Color('#06b6d4'); // Deep Teal (Tailwind cyan-600)
    
    shaderRef.current.uniforms.uColor.value.lerp(targetColor, 0.05);
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particleCount} 
          array={positions} 
          itemSize={3} 
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        attach="material"
        args={[OrbShaderMaterial]}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// --- Main Exported Component ---
const AIOrb3D = ({ state }: AIOrbProps) => {
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      
      {/* 3D Context */}
      <div className="absolute inset-0 z-0">
        <Canvas dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 14]} />
          {/* Ambient light for subtle depth if we add standard meshes later */}
          <ambientLight intensity={0.5} />
          <Orb state={state} />
        </Canvas>
      </div>

      {/* State Badge (UI Overlay) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 glass bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 z-10">
        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          state === 'speaking' ? 'bg-cyan-400 animate-pulse shadow-[0_0_12px_#22d3ee]' : 
          state === 'listening' ? 'bg-violet-400 animate-pulse' : 
          'bg-gray-500'
        }`} />
        <span className="text-sm text-gray-300 capitalize font-medium tracking-wide">
          {state}
        </span>
      </div>
    </div>
  );
};

export default AIOrb3D;