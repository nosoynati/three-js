import { Color, Scene } from 'three';

function createScene() {
  const scene = new Scene();
  const color = {
    blue: "#110099",
    fuccia: "rebecapurple"
  }
  scene.background = new Color(color.blue)
  scene.backgroundBlurriness = 0.4

  return scene;
} 
export { createScene};