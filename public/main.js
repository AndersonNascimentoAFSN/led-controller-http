import { io } from "https://cdn.socket.io/4.7.5/socket.io.esm.min.js";
const socket = io("http://192.168.0.8:3000");

const toggle = document.querySelector('#toggle');

socket.on('update', (isOn) => {
    if (isOn) {
      toggle.dataset.toggle = true;
      toggle.src = './images/toggle-on.png';
    } else {
      toggle.dataset.toggle = false;
      toggle.src = './images/toggle-off.png';
    }
  })

toggle.addEventListener('click', (event) => {
  const isOn = JSON.parse(event.target.dataset.toggle)
  
  if (isOn) {
    socket.emit('led', false)
    toggle.dataset.toggle = false;
    toggle.src = './images/toggle-off.png';
  } else {
    socket.emit('led', true)
    toggle.dataset.toggle = true;
    toggle.src = './images/toggle-on.png';
  }
})
