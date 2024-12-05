import { PerspectiveCamera } from "three";

function createCamera() {
  const camera = new PerspectiveCamera(75, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  camera.position.z = 5;

  return camera;
}
export { createCamera };
