import { Clock } from "three";

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
    for(let objs of this.updatables){
      objs.tick();
    }
  }
}
export { Loop };