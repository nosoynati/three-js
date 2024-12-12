const setSize = (camera, container, renderer) => {
  let ratio = window.devicePixelRatio
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio = window.devicePixelRatio
  renderer.setSize = container.clientWidth, container.clientHeight;
 


}
class Resizer {
  constructor(camera, container, renderer) {
    setSize(camera, container, renderer)
    window.addEventListener('resize', () => {
      setSize(camera, container, renderer);
      this.onResize();
    })
  }
  onResize() { }
}
export { Resizer };
