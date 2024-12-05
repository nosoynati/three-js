class Resizer {
  constructor(camera, renderer, container) {
    renderer.setSize = container.innerWidth, container.innerHeight;
    renderer.setPixelRatio = container.devicePixelRatio 
    camera.aspect = container.innerWidth / container.innerHeight;
  
  }
}
export { Resizer };
