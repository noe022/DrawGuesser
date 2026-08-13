const canvas = document.getElementById("canvas");
const contex = canvas.getContext('2d');

let initialX;
let initialY;

// Método que nos permite iniciar un nuevo trazo
// Para poder dibujar en diferentes partes del lienzo
function draw(cursorX, cursorY) {
  contex.beginPath();
  // Comenzar el trazo
  contex.moveTo(initialX, initialY);
  // Propiedades del pincel
  contex.lineWidth = 5;
  // Color
  contex.strokeStyle = "#000";
  // Terminaciones del pincel
  contex.lineCap = "round";
  contex.lineJoin = "round";
  // Mover el trazo
  contex.lineTo(cursorX, cursorY);
  // Dibujar el trazo
  contex.stroke();

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

canvas.addEventListener('mousedown', mouseClick);
canvas.addEventListener('mouseup', mouseUp);


// Implement rubber