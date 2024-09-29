import { exec } from 'child_process'
import johnnyFive from 'johnny-five';
const { Board, Led, Pin } = johnnyFive;
import { Server } from 'socket.io'

const board = new Board({ port: '/dev/ttyUSB0', repl: false })
const io = new Server({ cors: '*' })

let isLedOn = false

board.on('ready', () => {
  exec(`npm run web`)

  const led = new Led(2)
  const buzzer = new Pin(3)

  io.on('connection', (socket) => {
    console.log(socket.id, 'connected!')

    socket.emit('update', isLedOn)
    
    socket.on('led', (isOn) => {
      if (isOn) {
        led.on()
        buzzerSound(buzzer)
      } else {
        led.off()
        buzzerSound(buzzer)
      }
      isLedOn = isOn
      socket.broadcast.emit('update', isOn)
    })
  })
  io.listen(3000)
})

function buzzerSound(buzzer) {
  buzzer.high()
  setTimeout(() => {
    buzzer.low()
  }, 1000)
}

