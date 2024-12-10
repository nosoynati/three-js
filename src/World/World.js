import { createCamera } from "../components/camera";
import { createCube } from "../components/cube";
import { createScene } from "../components/scene";
import { createRenderer } from "../systems/renderer";
import { Resizer } from "../systems/Resizer";
import { createLights } from "../components/lights";

let camera;
let scene;
let renderer;

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    
    container.append(renderer.domElement);
    const cube = createCube().cube;
    const cube2 = createCube().baseCube;
    const light = createLights();
    scene.add(cube2);
    cube2.add(cube, light)
    const resizer = new Resizer(container, camera, renderer)
    resizer.onResize = () => {
      this.render()
    }
  }
  render() {
    renderer.render(scene, camera);
    
    
  }
}
export { World };
