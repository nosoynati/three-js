import { BoxGeometry, Mesh, MeshBasicMaterial, MathUtils, MeshStandardMaterial, TextureLoader } from 'three';
import { textureLoad } from 'three/tsl';

function createMaterial(color) {
  const textureLoader = new TextureLoader()
  const texture = textureLoader.load('/src/assets/textures/uv-test-bw.jpg')
  const material = new MeshStandardMaterial(color ? { color: color } : {map: texture});
  console.log(texture.source)
  return material
}
function createCube() {

  const geometry = new BoxGeometry(1.1,1.1,1.1);
  const geom2 = new BoxGeometry(1.15, 1.15, 1.15);
  const materialBase = createMaterial("purple");
  const material = createMaterial();
  const cube = new Mesh(geometry, material)
  const baseCube = new Mesh(geom2, materialBase)
  // radians
  const radiansPerSecond = MathUtils.degToRad(60)
  // rotación
  cube.position.set(2,0,2)
  cube.rotation.set(-0.2, -0.1, 0.8)

  baseCube.position.set(0,0,-1)
  baseCube.rotation.set(-0.25,-0.1,0.1)
  cube.tick = (delta) => {
    // cube.rotation.x += 0.03;
    // cube.rotation.z += 0.00;
    // cube.rotation.y += 0.01;
    cube.rotation.x += radiansPerSecond * delta
    cube.rotation.y += radiansPerSecond * delta
    cube.rotation.z += (radiansPerSecond * 2) * delta
  }
  baseCube.tick = (delta) => {
    baseCube.rotation.x -= 0.00;
    baseCube.rotation.z -= 0.00;
    baseCube.rotation.y -= radiansPerSecond * delta;
  }
  
  return {cube, baseCube}
} 
export { createCube };