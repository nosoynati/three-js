import { World } from './World/World'

function main() {
  const app = document.querySelector("#app")
  const world = new World(app)
  world.render()
}
export { main }