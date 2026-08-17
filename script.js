const canvas = document.getElementById("canvas");
const context = canvas.getContext('2d');
const rubber = document.getElementById("rubber");

let initialX;
let initialY;

// Método que nos permite iniciar un nuevo trazo
// Para poder dibujar en diferentes partes del lienzo
function draw(cursorX, cursorY) {
  context.beginPath();
  // Comenzar el trazo
  context.moveTo(initialX, initialY);
  // Propiedades del pincel
  context.lineWidth = 5;
  // Color
  context.strokeStyle = "#000";
  // Terminaciones del pincel
  context.lineCap = "round";
  context.lineJoin = "round";
  // Mover el trazo
  context.lineTo(cursorX, cursorY);
  // Dibujar el trazo
  context.stroke();

  initialX = cursorX;
  initialY = cursorY;
}

function mouseClick(evt) {
  initialX = evt.offsetX;
  initialY = evt.offsetY;
  draw(initialX, initialY);

  canvas.addEventListener('mousemove', mouseMoving);
}

function mouseMoving(evt) {
  draw(evt.offsetX, evt.offsetY);
}

function mouseUp(evt) {
  canvas.removeEventListener("mousemove", mouseMoving);
}

function erase() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', mouseClick);
canvas.addEventListener('mouseup', mouseUp);
rubber.addEventListener('mousedown', erase);