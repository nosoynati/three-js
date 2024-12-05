import { WebGLRenderer } from 'three'

function createRenderer() {
  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio)
  return renderer
}
export {createRenderer};