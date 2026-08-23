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
    const marbles = createMarbles(400);

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
    const moveDir = new Vector3();

    let draggedMarble = null;
    let isRotating = false;
    let yaw = 0;
    let pitch = 0;

    const updateMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    canvas.addEventListener('mousedown', (e) => {
      updateMouse(e);
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(marbles);
      if (hits.length > 0) {
        draggedMarble = hits[0].object;
        camera.getWorldDirection(cameraDir);
        dragPlane.setFromNormalAndCoplanarPoint(cameraDir, draggedMarble.position);
        raycaster.ray.intersectPlane(dragPlane, planeIntersect);
        offset.copy(draggedMarble.position).sub(planeIntersect);
        canvas.style.cursor = 'grabbing';
      } else {
        isRotating = true;
        canvas.style.cursor = 'grabbing';
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      if (draggedMarble) {
        updateMouse(e);
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(dragPlane, planeIntersect);
        draggedMarble.position.copy(planeIntersect).add(offset);
      } else if (isRotating) {
        yaw -= e.movementX * 0.004;
        pitch -= e.movementY * 0.004;
        pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
        camera.rotation.set(pitch, yaw, 0, 'YXZ');
      } else {
        updateMouse(e);
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(marbles);
        canvas.style.cursor = hits.length > 0 ? 'grab' : 'default';
      }
    });

    canvas.addEventListener('mouseup', () => {
      draggedMarble = null;
      isRotating = false;
      canvas.style.cursor = 'default';
    });

    canvas.addEventListener('mouseleave', () => {
      draggedMarble = null;
      isRotating = false;
      canvas.style.cursor = 'default';
    });

    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      camera.getWorldDirection(moveDir);
      camera.position.addScaledVector(moveDir, -e.deltaY * 0.05);
    }, { passive: false });
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
