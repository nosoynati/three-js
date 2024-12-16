import { BoxGeometry, Mesh, MeshBasicMaterial, MathUtils, MeshStandardMaterial } from 'three';

function createCube() {

  const opc = {
    color: '#ab0d79'
  }
  const geometry = new BoxGeometry(1.1,1.1,1.1)
  const geom2 = new BoxGeometry(1.15, 1.15, 1.15)
  const materialBase = new MeshStandardMaterial({color: "red"})
  const material = new MeshStandardMaterial(opc);
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