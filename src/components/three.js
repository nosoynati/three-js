import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";


function threeApp() {

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("skyblue"); // Color azul cielo

  const cameraSettings = {
    fov: 65,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 100
  };
  const { fov, aspect, near, far} = cameraSettings

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0,0,10)
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio)
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  const loader = new GLTFLoader();

  // Añadir figuras
  function createCube(x, y, z, color) {
    const geometry = new THREE.BoxGeometry(); // Geometría de cubo
    const material = new THREE.MeshBasicMaterial({ color }); // Material
    const cube = new THREE.Mesh(geometry, material); // Mesh

    cube.position.set(x, y, z); // Posición
    return cube;
  }

  function createSphere(x, y, z, color) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32); // Geometría de esfera
    const material = new THREE.MeshBasicMaterial({ color }); // Material
    const sphere = new THREE.Mesh(geometry, material); // Mesh
    sphere.position.set(x, y, z); // Posición
    return sphere;
  }

  // Crear y añadir objetos a la escena
  const cube1 = createCube(2, 1, -2, 0x01f1d1); // Cubo rojo
  const cube2 = createCube(-2, 1, -2, 0xc3c3d4); // Cubo verde
  const sphere1 = createSphere(0, -1, -2, 0xff11cc); // Esfera azul

  scene.add(cube1);
  scene.add(cube2);
  scene.add(sphere1);



  // Cámara y animación
  camera.position.z = 5;

  function animate() {
    renderer.render(scene, camera);
    // Rotación de objetos
    cube1.rotation.x += 0.01;
    cube1.rotation.y += 0.01;

    cube2.rotation.x += 0.01;
    cube2.rotation.y += 0.01;
    sphere1.add(cube2)
    sphere1.add(cube1)
    sphere1.rotation.y += 0.01;
    sphere1.rotation.y += 0.01;
    // sphere1.rotateZ(0.04)
  }
  renderer.setAnimationLoop(animate);
}
export default threeApp;
