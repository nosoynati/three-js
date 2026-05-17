import { DirectionalLight, AmbientLight, MathUtils } from "three";

function createLights() {
  const ambient = new AmbientLight('#ffffff', 1.5);

  const directional = new DirectionalLight("#ffffff", 4);
  directional.position.set(10, 10, 10);

  const radiansPerSecond = MathUtils.degToRad(30);
  directional.tick = (delta) => {
    directional.rotation.y += radiansPerSecond * delta;
  };

  return { ambient, directional };
}
export { createLights };