import { Clock } from "three";

// clock.delta mide el tiempo transcurrido desde el último refresh
const clock = new Clock();

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.updatables = []
  }
  start(){
    this.renderer.setAnimationLoop(()=> {
      this.tick();
      this.renderer.render(this.scene, this.camera)
    });
  }
  stop(){
    this.renderer.setAnimationLoop(null)
  }
  tick(){
    const delta = clock.getDelta()
    // console.log(`tiempo transcurrido en ms: ${delta * 1000}`)
    for(let objs of this.updatables){
      objs.tick(delta);
    }
  }
}
export { Loop };