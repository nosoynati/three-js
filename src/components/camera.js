import { PerspectiveCamera } from "three";

function createCamera() {
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 10);
  camera.position.z = 5;

  return camera;
}
export { createCamera };
