import { DirectionalLight } from "three";

function createLights(position) {

  const light = new DirectionalLight("#f3f3f3", 8)
  light.position.set(10, 5, 8)
  return light;
}
export { createLights }