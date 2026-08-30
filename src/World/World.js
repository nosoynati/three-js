import {
  Raycaster, Vector2, Vector3, Plane,
  RingGeometry, MeshBasicMaterial, Mesh, Color, DoubleSide,
} from 'three';
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

// Color stops: very close → close → far → very far
const PROXIMITY_STOPS = [
  { dist: 0,  color: new Color('#4ade80') },  // green
  { dist: 15, color: new Color('#facc15') },  // yellow
  { dist: 35, color: new Color('#f97316') },  // orange
  { dist: 60, color: new Color('#ef4444') },  // red
];

function getProximityColor(dist) {
  if (dist <= PROXIMITY_STOPS[0].dist) return PROXIMITY_STOPS[0].color.clone();
  for (let i = 1; i < PROXIMITY_STOPS.length; i++) {
    const prev = PROXIMITY_STOPS[i - 1];
    const next = PROXIMITY_STOPS[i];
    if (dist <= next.dist) {
      const t = (dist - prev.dist) / (next.dist - prev.dist);
      return prev.color.clone().lerp(next.color, t);
    }
  }
  return PROXIMITY_STOPS[PROXIMITY_STOPS.length - 1].color.clone();
}

function spawnHalo(position, color) {
  const geometry = new RingGeometry(0.45, 0.62, 40);
  const material = new MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.9,
    side: DoubleSide,
    depthWrite: false,
  });
  const halo = new Mesh(geometry, material);
  halo.position.copy(position);

  let elapsed = 0;
  const duration = 1.1;

  halo.tick = (delta) => {
    elapsed += delta;
    const t = elapsed / duration;
    material.opacity = 0.9 * (1 - t);
    halo.scale.setScalar(1 + t * 2.5);
    halo.quaternion.copy(camera.quaternion);

    if (elapsed >= duration) {
      scene.remove(halo);
      const idx = loop.updatables.indexOf(halo);
      if (idx !== -1) loop.updatables.splice(idx, 1);
      geometry.dispose();
      material.dispose();
    }
  };

  scene.add(halo);
  loop.updatables.push(halo);
}

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
    const chosenPosition = chosenMarble.position; // live reference, updates if dragged

    const tooltip = document.createElement('div');
    tooltip.className = 'marble-tooltip';
    tooltip.textContent = 'you found me!';
    container.appendChild(tooltip);

    this._setupInteractions(renderer.domElement, marbles, chosenMarble, chosenPosition, tooltip);

    const resizer = new Resizer(camera, container, renderer);
    resizer.onResize = () => this.render();
  }

  _setupInteractions(canvas, marbles, chosenMarble, chosenPosition, tooltip) {
    const raycaster = new Raycaster();
    const mouse = new Vector2();
    const dragPlane = new Plane();
    const planeIntersect = new Vector3();
    const offset = new Vector3();
    const cameraDir = new Vector3();
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

      if (wasClick && draggedMarble) {
        if (draggedMarble === chosenMarble) {
          if (!tooltipVisible) {
            tooltipVisible = true;
            tooltip.classList.add('visible');
            updateTooltipPosition();
            startFocus();
          }
        } else {
          const dist = draggedMarble.position.distanceTo(chosenPosition);
          spawnHalo(draggedMarble.position.clone(), getProximityColor(dist));
        }
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
