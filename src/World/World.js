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

    const chosenMarble = marbles[Math.floor(Math.random() * marbles.length)];

    const tooltip = document.createElement('div');
    tooltip.className = 'marble-tooltip';
    tooltip.textContent = 'you found me!';
    container.appendChild(tooltip);

    this._setupInteractions(renderer.domElement, marbles, chosenMarble, tooltip);

    const resizer = new Resizer(camera, container, renderer);
    resizer.onResize = () => this.render();
  }

  _setupInteractions(canvas, marbles, chosenMarble, tooltip) {
    const raycaster = new Raycaster();
    const mouse = new Vector2();
    const dragPlane = new Plane();
    const planeIntersect = new Vector3();
    const offset = new Vector3();
    const cameraDir = new Vector3();
    const moveDir = new Vector3();
    const projectedPos = new Vector3();

    let draggedMarble = null;
    let isRotating = false;
    let yaw = 0;
    let pitch = 0;
    let mouseDownX = 0;
    let mouseDownY = 0;
    let tooltipVisible = false;

    const focus = {
      active: false,
      targetPos: new Vector3(),
      targetYaw: 0,
      targetPitch: 0,
    };

    const updateTooltipPosition = () => {
      projectedPos.copy(chosenMarble.position).project(camera);
      const x = (projectedPos.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-projectedPos.y * 0.5 + 0.5) * window.innerHeight;
      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    };

    const startFocus = () => {
      const FOCUS_DIST = 4;
      const dir = new Vector3()
        .subVectors(chosenMarble.position, camera.position)
        .normalize();
      focus.targetPos
        .copy(chosenMarble.position)
        .addScaledVector(dir, -FOCUS_DIST);
      focus.targetYaw = Math.atan2(-dir.x, -dir.z);
      focus.targetPitch = Math.atan2(
        dir.y,
        Math.sqrt(dir.x * dir.x + dir.z * dir.z)
      );
      focus.active = true;
    };

    loop.updatables.push({
      tick: (delta) => {
        if (focus.active) {
          const t = Math.min(1, delta * 2.5);
          camera.position.lerp(focus.targetPos, t);
          yaw += (focus.targetYaw - yaw) * t;
          pitch += (focus.targetPitch - pitch) * t;
          camera.rotation.set(pitch, yaw, 0, 'YXZ');

          if (
            camera.position.distanceTo(focus.targetPos) < 0.05 &&
            Math.abs(focus.targetYaw - yaw) < 0.005
          ) {
            focus.active = false;
            camera.position.copy(focus.targetPos);
            yaw = focus.targetYaw;
            pitch = focus.targetPitch;
            camera.rotation.set(pitch, yaw, 0, 'YXZ');
          }
        }

        if (tooltipVisible) {
          updateTooltipPosition();
        }
      },
    });

    const updateMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    canvas.addEventListener('mousedown', (e) => {
      mouseDownX = e.clientX;
      mouseDownY = e.clientY;
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

    canvas.addEventListener('mouseup', (e) => {
      const dx = e.clientX - mouseDownX;
      const dy = e.clientY - mouseDownY;
      const wasClick = Math.sqrt(dx * dx + dy * dy) < 5;

      if (wasClick && draggedMarble === chosenMarble && !tooltipVisible) {
        tooltipVisible = true;
        tooltip.classList.add('visible');
        updateTooltipPosition();
        startFocus();
      }

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
