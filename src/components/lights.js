import { DirectionalLight, MathUtils } from "three";

function createLights(delta) {
  const radiansPerSecond = MathUtils.degToRad(60)

  const light = new DirectionalLight("#f3f3f3", 8)
  light.position.set(10, 5, 8)
  light.rotation.set(0,0,0)
  light.tick = (delta) => {
    light.rotation.x += radiansPerSecond * delta
    light.rotation.y += radiansPerSecond * delta
    light.rotation.z += (radiansPerSecond * 2) * delta
  }
  return light;
}
export { createLights }