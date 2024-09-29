let canvas = document.getElementById("scratch");
let context = canvas.getContext("2d");
let backgroundImage = document.getElementById("backgroundImage"); // Obtener la imagen

const init = () => {
  // Limpiar el canvas al cargar la página
  context.clearRect(0, 0, canvas.width, canvas.height); // Limpia todo el canvas
  
  // Asegúrate de que la imagen esté cargada antes de dibujarla
  backgroundImage.onload = () => {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Dibuja la imagen en el canvas
  };

  // Si la imagen ya estaba cargada antes de que onload se ejecutara
  if (backgroundImage.complete) {
    context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }
};

// Inicialmente, las posiciones del mouse son 0
let mouseX = 0;
let mouseY = 0;
let isDragged = false;

// Eventos para mouse y toque
let events = {
    mouse: {
        down: "mousedown",
        move: "mousemove",
        up: "mouseup",
    },
    touch: {
        down: "touchstart",
        move: "touchmove",
        up: "touchend",
    },
};

let deviceType = "";

// Detectar dispositivo de toque
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    } catch (e) {
        deviceType = "mouse";
        return false;
    }
};

// Obtener la posición exacta del mouse/touch
const getXY = (e) => {
    const rect = canvas.getBoundingClientRect(); // Obtener las coordenadas del canvas
    mouseX = (!isTouchDevice() ? e.clientX : e.touches[0].clientX) - rect.left;
    mouseY = (!isTouchDevice() ? e.clientY : e.touches[0].clientY) - rect.top;
};

isTouchDevice();
// Iniciar el borrado
canvas.addEventListener(events[deviceType].down, (event) => {
    event.preventDefault(); // Evitar el desplazamiento de la página
    isDragged = true;
    getXY(event);
    scratch(mouseX, mouseY);
});

// Movimiento del mouse o toque
canvas.addEventListener(events[deviceType].move, (event) => {
    event.preventDefault(); // Evitar el desplazamiento de la página
    if (isDragged) {
        getXY(event);
        scratch(mouseX, mouseY);
    }
});

// Detener el borrado
canvas.addEventListener(events[deviceType].up, () => {
    isDragged = false;
});

// Si el mouse sale del cuadrado
canvas.addEventListener("mouseleave", () => {
    isDragged = false;
});

const scratch = (x, y) => {
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(x, y, 20, 0, 2 * Math.PI);
    context.fill();
};

// Iniciar el proceso al cargar la página
window.onload = init();
