import { Color, Scene } from 'three';

function createScene() {
  const scene = new Scene();
  scene.background = new Color('#0d0d1a');
  return scene;
}
export { createScene };