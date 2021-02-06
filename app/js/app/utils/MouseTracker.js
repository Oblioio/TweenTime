const mouse = {
  x: 0,
  y: 0
};

let tracking = false;

function onMove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

function startTracking() {
  if (tracking) return;
  tracking = true;
  window.addEventListener('mousemove', onMove);
}

function stopTracking() {
  tracking = false;
  window.removeEventListener('mousemove', onMove);
}

export default {
  mouse,
  startTracking,
  stopTracking
};
