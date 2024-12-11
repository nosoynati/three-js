const setSize = (camera, container, renderer) => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();

  renderer.setSize = container.clientWidth, container.clientHeight;
  renderer.setPixelRatio = window.devicePixelRatio

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
