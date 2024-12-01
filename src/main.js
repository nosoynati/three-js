import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'
import threeApp from './components/three.js'

threeApp()
document.querySelector('#app').innerHTML = `
  <div>
    <h1>Acá</h1>
  </div>
`