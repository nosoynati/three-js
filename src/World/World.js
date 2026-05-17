import { Raycaster, Vector2, Vector3, Plane } from 'three';
import { createCamera } from "../components/camera";
import { createMarbles } from "../components/marbles";
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

    const { ambient, directional } = createLights();
    const marbles = createMarbles(125);

    loop.updatables.push(directional, ...marbles);
    scene.add(ambient, directional, ...marbles);

    this._setupInteractions(renderer.domElement, marbles);

    const resizer = new Resizer(camera, container, renderer);
    resizer.onResize = () => this.render();
  }

  _setupInteractions(canvas, marbles) {
    const raycaster = new Raycaster();
    const mouse = new Vector2();
    const dragPlane = new Plane();
    const planeIntersect = new Vector3();
    const offset = new Vector3();
    const cameraDir = new Vector3();
    let draggedObject = null;

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      camera.position.z = Math.max(2, Math.min(30, camera.position.z + e.deltaY * 0.02));
    }, { passive: false });

    const updateMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    canvas.addEventListener('mousedown', (e) => {
      updateMouse(e);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(marbles);
      if (hits.length > 0) {
        draggedObject = hits[0].object;
        camera.getWorldDirection(cameraDir);
        dragPlane.setFromNormalAndCoplanarPoint(cameraDir, draggedObject.position);
        raycaster.ray.intersectPlane(dragPlane, planeIntersect);
        offset.copy(draggedObject.position).sub(planeIntersect);
        canvas.style.cursor = 'grabbing';
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      updateMouse(e);
      raycaster.setFromCamera(mouse, camera);
      if (draggedObject) {
        raycaster.ray.intersectPlane(dragPlane, planeIntersect);
        draggedObject.position.copy(planeIntersect).add(offset);
      } else {
        const hits = raycaster.intersectObjects(marbles);
        canvas.style.cursor = hits.length > 0 ? 'grab' : 'default';
      }
    });

    canvas.addEventListener('mouseup', () => {
      draggedObject = null;
      canvas.style.cursor = 'default';
    });
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
