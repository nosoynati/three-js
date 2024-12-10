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
<<<<<<< HEAD
    scene.add(cube, light, cube2)

    const resizer = new Resizer(camera, container, renderer)
=======
    scene.add(cube2);
    cube2.add(cube, light)
    const resizer = new Resizer(container, camera, renderer)
>>>>>>> cfdf0e62907121448686b7982cab0aebfc7d7b50
    resizer.onResize = () => {
      this.render()
    }
  }
  render() {
<<<<<<< HEAD
    renderer.render(scene, camera)
 
  } 
  
=======
    renderer.render(scene, camera);
    
    
  }
>>>>>>> cfdf0e62907121448686b7982cab0aebfc7d7b50
}
export { World };
