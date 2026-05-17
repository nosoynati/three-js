import {
  IcosahedronGeometry, OctahedronGeometry, DodecahedronGeometry,
  TetrahedronGeometry, SphereGeometry, Mesh, MeshStandardMaterial, Color
} from 'three';

const COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#c77dff',
  '#ff9a3c', '#00d2ff', '#ff61a6', '#a8ff78', '#ffb347',
  '#b4f8c8', '#fbe7c6', '#a0c4ff', '#caffbf', '#ffadad',
];

const GEOM_FACTORIES = [
  (r) => new SphereGeometry(r, 12, 8),
  (r) => new IcosahedronGeometry(r, 0),
  (r) => new OctahedronGeometry(r, 0),
  (r) => new DodecahedronGeometry(r, 0),
  (r) => new TetrahedronGeometry(r, 0),
];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createMarbles(count = 25) {
  const marbles = [];

  for (let i = 0; i < count; i++) {
    const radius = rand(0.3, 1.0);
    const geometry = pick(GEOM_FACTORIES)(radius);

    const material = new MeshStandardMaterial({
      color: new Color(pick(COLORS)),
      metalness: rand(0.0, 0.5),
      roughness: rand(0.2, 0.8),
    });

    const marble = new Mesh(geometry, material);
    marble.position.set(rand(-15, 15), rand(-10, 10), rand(-8, 3));
    marble.rotation.set(
      rand(0, Math.PI * 2),
      rand(0, Math.PI * 2),
      rand(0, Math.PI * 2),
    );

    const rx = rand(-0.4, 0.4);
    const ry = rand(-0.4, 0.4);
    marble.tick = (delta) => {
      marble.rotation.x += rx * delta;
      marble.rotation.y += ry * delta;
    };

    marbles.push(marble);
  }

  return marbles;
}

export { createMarbles };
