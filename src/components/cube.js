import { BoxGeometry, Mesh, MeshBasicMaterial, MeshStandardMaterial } from 'three';
const geom = {
  x: "",
  y: "",
  z: ""
}
function createCube(geom) {

  const opc = {
    color: '#ab0d79'
  }
  const geometry = new BoxGeometry(1,1,1)
  const geom2 = new BoxGeometry(1.5, 1.5, 1.5)
  const materialBase = new MeshBasicMaterial({color: "red"})
  const material = new MeshStandardMaterial(opc);
  const cube = new Mesh(geometry, material)
  const baseCube = new Mesh(geom2, materialBase)
  // rotación
  cube.position.set(2,0,0)
  cube.rotation.set(-0.2, -0.1, 0.8)
  baseCube.position.set(-1,-0.5,1)
  baseCube.rotation.set(-0.25, -0.1, 0.5)

  return {cube, baseCube}
} 
export { createCube };