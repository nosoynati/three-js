import { WebGLRenderer } from 'three'


function createRenderer() {
  const renderer = new WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.physicallyCorrectLights = true
  
  
  return renderer
}
export {createRenderer};