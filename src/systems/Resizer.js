class Resizer {
  constructor(camera, container, renderer) {
    // Set initial size
    this.setSize(camera, container, renderer);

    window.addEventListener('resize', () => {
      this.setSize(camera, container, renderer);
      this.onResize();
    });
  }

  setSize(camera, container, renderer) {
    const width = container.clientWidth;
    const height = container.clientHeight;

    const canvas = renderer.domElement;
    const needResize = canvas.width !== width || canvas.height !== height;

    if (needResize) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
    }

    return needResize;
  }

  onResize() {
  }
}

export { Resizer };
