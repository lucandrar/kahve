/**
 * Custom GLSL Shaders for AETHER Liquid Distortion & Condensation Ripples
 */

export const liquidDistortionShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uDistortionStrength: { value: 0.035 },
    uColorTint: { value: [1.0, 0.4, 0.1] },
    uAberration: { value: 0.008 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uProgress;
    uniform float uDistortionStrength;
    uniform vec3 uColorTint;
    uniform float uAberration;
    varying vec2 vUv;

    // Simplex-like 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;
      
      // Calculate fluid wave displacement
      float n1 = snoise(uv * 4.0 + vec2(uTime * 0.25, uTime * 0.15));
      float n2 = snoise(uv * 8.0 - vec2(uTime * 0.1, uTime * 0.3));
      vec2 displacement = vec2(n1, n2) * uDistortionStrength;

      // Chromatic aberration pass
      float r = texture2D(tDiffuse, uv + displacement + vec2(uAberration, 0.0)).r;
      float g = texture2D(tDiffuse, uv + displacement).g;
      float b = texture2D(tDiffuse, uv + displacement - vec2(uAberration, 0.0)).b;
      
      vec3 color = vec3(r, g, b);

      // Subtle dynamic caustics vignette
      float distFromCenter = distance(uv, vec2(0.5));
      float vignette = smoothstep(0.8, 0.2, distFromCenter);
      
      // Subtle color wash tint
      color += uColorTint * n1 * 0.04;

      gl_FragColor = vec4(color, 1.0);
    }
  `
};

export const condensationBumpShader = `
  float dropletGrid(vec2 uv, float scale, float density) {
    vec2 st = uv * scale;
    vec2 f = fract(st) - 0.5;
    vec2 id = floor(st);
    float rand = fract(sin(dot(id, vec2(12.9898, 78.233))) * 43758.5453);
    if (rand > density) return 0.0;
    float d = length(f);
    float size = 0.15 + rand * 0.25;
    return smoothstep(size, 0.0, d);
  }
`;
