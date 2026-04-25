<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const el = ref<HTMLDivElement | null>(null);

let r: THREE.WebGLRenderer | null = null;
let af = 0;
let m: THREE.AnimationMixer | null = null;
let cat: THREE.Object3D | null = null;
let y0 = -0.2;
let ct: OrbitControls | null = null;
const c = new THREE.Clock();

const init = () => {
  if (!el.value) return;

  const s = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  cam.position.set(0, 1.1, 5.2);

  r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  r.outputColorSpace = THREE.SRGBColorSpace;
  el.value.appendChild(r.domElement);
  ct = new OrbitControls(cam, r.domElement);
  ct.enableDamping = true;
  ct.dampingFactor = 0.06;
  ct.enablePan = false;
  ct.enableRotate = true;
  ct.enableZoom = true;
  ct.minDistance = 2.6;
  ct.maxDistance = 9;
  ct.target.set(0, 0.4, 0);

  const hemi = new THREE.HemisphereLight(0xfff1fe, 0x5b44a6, 1.3);
  const key = new THREE.DirectionalLight(0xfffaf0, 1.6);
  const rim = new THREE.PointLight(0xc6f9ff, 1.2, 12);
  key.position.set(2, 3, 2);
  rim.position.set(-2, 1.5, -1.2);
  s.add(hemi, key, rim);

  const auraGeo = new THREE.RingGeometry(1.1, 1.7, 64);
  const auraMat = new THREE.MeshBasicMaterial({
    color: 0xff90d5,
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide
  });
  const aura = new THREE.Mesh(auraGeo, auraMat);
  aura.rotation.x = -Math.PI / 2;
  aura.position.y = -0.55;
  s.add(aura);

  const floorGeo = new THREE.CircleGeometry(1.05, 64);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.18
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.52;
  s.add(floor);

  const l = new GLTFLoader();
  l.load('/cat.glb', (g) => {
    cat = g.scene;
    const b = new THREE.Box3().setFromObject(cat);
    const size = b.getSize(new THREE.Vector3());
    const center = b.getCenter(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 2.1;
    const k = targetSize / maxSize;
    cat.scale.setScalar(k);
    cat.position.set(-center.x * k, -center.y * k, -center.z * k);
    y0 = cat.position.y;
    const halfFov = THREE.MathUtils.degToRad(cam.fov * 0.5);
    const dist = (targetSize * 0.65) / Math.tan(halfFov);
    cam.position.set(0, targetSize * 0.32, dist + 1.2);
    ct?.target.set(0, targetSize * 0.22, 0);
    ct?.update();
    s.add(cat);
    if (g.animations.length) {
      m = new THREE.AnimationMixer(cat);
      g.animations.forEach((a) => m?.clipAction(a).play());
    }
  });

  const rs = () => {
    if (!r || !el.value) return;
    const w = el.value.clientWidth;
    const h = el.value.clientHeight;
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
    r.setSize(w, h, false);
  };

  const loop = () => {
    const t = c.getElapsedTime();
    const d = c.getDelta();
    if (m) m.update(d);
    if (cat) {
      cat.rotation.y = Math.sin(t * 0.75) * 0.26;
      cat.position.y = y0 + Math.sin(t * 1.8) * 0.05;
    }
    aura.rotation.z = t * 0.25;
    ct?.update();
    r?.render(s, cam);
    af = requestAnimationFrame(loop);
  };

  window.addEventListener('resize', rs);
  rs();
  loop();

  onUnmounted(() => {
    window.removeEventListener('resize', rs);
    cancelAnimationFrame(af);
    ct?.dispose();
    ct = null;
    s.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      o.geometry.dispose();
      if (Array.isArray(o.material)) o.material.forEach((x) => x.dispose());
      else o.material.dispose();
    });
    r?.dispose();
    r?.domElement.remove();
  });
};

onMounted(init);
</script>

<template>
  <div ref="el" class="anime-scene"></div>
</template>

<style scoped>
.anime-scene {
  width: 100%;
  min-height: 280px;
  height: 100%;
}
</style>
