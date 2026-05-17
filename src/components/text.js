import { OrbitControls } from "three/examples/jsm/Addons.js";
import { FontLoader } from "three/examples/jsm/Addons.js";
import { Color, PerspectiveCamera, Scene } from "three";

let camera, scene, render;


function createText(){
  scene = new Scene;
  scene.background = new Color(0xf0f0f0);
  loader = new FontLoader();
  loader.load("Arial", function(font){
    const color = 0x006699;
    
  })
}