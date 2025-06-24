import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * GUI
 */
const gui = new GUI();
gui._closeFolders = true;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAOTexture = textureLoader.load("/textures/door/ambienOcclusion.jpg");
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");

const firstGradientTexture = textureLoader.load("/textures/gradients/5.jpg");
const matCapTexture = textureLoader.load("/textures/matcaps/3.png");
matCapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Object
 */
// MeshBasicMaterial
// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color(0x00ff00);
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;

// // MeshNormalMaterial
// const material = new THREE.MeshNormalMaterial();
// // material.flatShading = true;
// material.side = THREE.DoubleSide;

// MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial();
// material.side = THREE.DoubleSide;
// material.matcap = matCapTexture;

// MeshDepthMaterial
// const material = new THREE.MeshDepthMaterial();

// MeshLambertMaterial
// const material = new THREE.MeshLambertMaterial();

// MeshPhonMaterial
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

// // MeshToonmaterial
// const material = new THREE.MeshToonMaterial();
// firstGradientTexture.minFilter = THREE.NearestFilter;
// firstGradientTexture.magFilter = THREE.NearestFilter;
// firstGradientTexture.generateMipmaps = false;
// material.gradientMap = firstGradientTexture;

// MeshStandardMaterial
const material = new THREE.MeshStandardMaterial();
material.side = THREE.DoubleSide;
material.metalness = 0.7;
gui.add(material, "metalness", 0, 1);
material.roughness = 0.2;
gui.add(material, "roughness", 0, 1);

material.map = doorColorTexture;
material.aoMap = doorAOTexture;
// material.aoMapIntensity = 1;

const sphereMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
);
sphereMesh.position.x = -2;

const planeMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);

const torusMesh = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.2, 32, 32),
  material
);
torusMesh.position.x = 2;

scene.add(sphereMesh, planeMesh, torusMesh);

/**
 * Lights
 */
const pointLight = new THREE.PointLight(0xffffff, 30);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

/**
 * Environment Map
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
  console.log(environmentMap);
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  sphereMesh.rotation.y = 0.1 * elapsedTime;
  planeMesh.rotation.y = 0.1 * elapsedTime;
  torusMesh.rotation.y = 0.1 * elapsedTime;

  sphereMesh.rotation.x = -0.15 * elapsedTime;
  planeMesh.rotation.x = -0.15 * elapsedTime;
  torusMesh.rotation.x = -0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
