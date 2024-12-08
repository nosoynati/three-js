import { World } from './World/World'
import './style.css'

function main() {
  const app = document.querySelector("#app")
  const world = new World(app)
  world.render()
}
main()