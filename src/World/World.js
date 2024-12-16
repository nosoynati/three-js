import { createCamera } from "../components/camera";
import { createCube } from "../components/cube";
import { createScene } from "../components/scene";
import { createRenderer } from "../systems/renderer";
import { Resizer } from "../systems/Resizer";
import { createLights } from "../components/lights";
import { Loop } from "../systems/Loop";

let camera;
let scene;
let renderer;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    const cube = createCube().cube;
    const cube2 = createCube().baseCube;
    const light = createLights();
    loop.updatables.push(cube, cube2)

    scene.add(cube2, light)
    cube2.add(cube)

    const resizer = new Resizer(camera, container, renderer)
    // resizer.onResize = () => {
    //   this.render()
    // }
  }
  render() {
    renderer.render(scene, camera);
  }
  start(){
    loop.start()
  }
  stop(){
    loop.stop()
  }
}
export { World };
