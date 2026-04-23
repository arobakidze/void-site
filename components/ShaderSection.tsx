"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Simplex noise (Ashima) + swirling nebula
const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                  + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++){
      v += a * snoise(p);
      p *= 2.02;
      a *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 p = uv * 3.0 - 1.5;
    p.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.08;

    // swirl
    float swirl = fbm(p * 0.8 + vec2(t, -t * 0.6));
    vec2 q = vec2(
      fbm(p + vec2(swirl, -swirl) + t),
      fbm(p + vec2(-swirl*0.7, swirl*1.3) - t)
    );
    float n = fbm(p + q * 1.8 + t * 0.5);

    // color mix
    vec3 violet = vec3(0.545, 0.361, 0.965);
    vec3 cyan   = vec3(0.133, 0.827, 0.933);
    vec3 rose   = vec3(0.984, 0.443, 0.522);
    vec3 deep   = vec3(0.02, 0.02, 0.035);

    vec3 col = mix(deep, violet, smoothstep(-0.2, 0.6, n));
    col = mix(col, cyan, smoothstep(0.1, 0.9, q.x));
    col += rose * smoothstep(0.6, 1.0, n) * 0.45;

    // stars
    float s = smoothstep(0.996, 1.0, snoise(uv * 400.0 + t*50.0));
    col += vec3(s) * 1.2;

    // vignette
    float vig = smoothstep(1.3, 0.25, length(uv - 0.5) * 1.2);
    col *= vig;

    // halftone scanline subtle
    float scan = 0.96 + 0.04 * sin(uv.y * uResolution.y * 2.0);
    col *= scan;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function NebulaPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height);
  }, [size, uniforms]);

  useFrame((_, dt) => {
    if (mat.current) {
      mat.current.uniforms.uTime.value += dt;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function ShaderSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    (async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!textRef.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          textRef.current,
          {
            clipPath: "inset(0 100% 0 0)",
            WebkitClipPath: "inset(0 100% 0 0)",
          },
          {
            clipPath: "inset(0 0% 0 0)",
            WebkitClipPath: "inset(0 0% 0 0)",
            duration: 1.6,
            ease: "power4.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
            },
          }
        );
      }, sectionRef);
    })();

    return () => ctx?.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-void-bg"
    >
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        dpr={[1, 1.25]}
      >
        <NebulaPlane />
      </Canvas>

      <div className="absolute inset-0 flex items-center justify-center px-6">
        <h2
          ref={textRef}
          className="font-display text-center text-[12vw] font-semibold leading-[0.9] tracking-[-0.04em] text-white md:text-[8vw]"
          style={{
            textShadow:
              "0 0 40px rgba(139,92,246,0.4), 0 0 80px rgba(34,211,238,0.2)",
          }}
        >
          BEYOND THE
          <br />
          OBSERVABLE
        </h2>
      </div>

      {/* Halftone overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(0,0,0,0.6) 1px, transparent 1px)",
          backgroundSize: "5px 5px",
          mixBlendMode: "multiply",
        }}
      />
    </section>
  );
}
