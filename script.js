// script.js

let score = 0;
let isGameOver = false;
let bossSpawned = false;
const wbc = document.querySelector('#wbc');
const marker = document.querySelector('#game-marker');
const scoreText = document.querySelector('#score');
const gameOverScreen = document.querySelector('#game-over');

// Player Position tracking
let wbcPos = { x: 0, y: 0.5, z: 0 };
const moveSpeed = 0.3;

// Movement Controls (Touch)
document.getElementById('btn-up').addEventListener('touchstart', () => moveWBC(moveSpeed, 0));
document.getElementById('btn-down').addEventListener('touchstart', () => moveWBC(-moveSpeed, 0));
document.getElementById('btn-left').addEventListener('touchstart', () => moveWBC(0, -moveSpeed));
document.getElementById('btn-right').addEventListener('touchstart', () => moveWBC(0, moveSpeed));

// Movement Controls (Mouse/Laptop fallback)
document.getElementById('btn-up').addEventListener('mousedown', () => moveWBC(moveSpeed, 0));
document.getElementById('btn-down').addEventListener('mousedown', () => moveWBC(-moveSpeed, 0));
document.getElementById('btn-left').addEventListener('mousedown', () => moveWBC(0, -moveSpeed));
document.getElementById('btn-right').addEventListener('mousedown', () => moveWBC(0, moveSpeed));

function moveWBC(dx, dz) {
  if (isGameOver) return;
  wbcPos.x += dx;
  wbcPos.z += dz;
  wbc.setAttribute('position', `${wbcPos.x} ${wbcPos.y} ${wbcPos.z}`);
}

// Virus Spawner (Every 3 seconds)
setInterval(() => {
  if (isGameOver || bossSpawned) return;
  spawnVirus(false);
}, 3000);

// Spawn the Boss Virus after 15 seconds!
setTimeout(() => {
  if (!isGameOver) spawnVirus(true);
}, 15000);

function spawnVirus(isBoss) {
  bossSpawned = isBoss;
  const virus = document.createElement('a-entity');
  
  // Random starting point
  let startX = (Math.random() - 0.5) * 4;
  let startZ = (Math.random() - 0.5) * 4;
  let currentPos = { x: startX, y: 0.5, z: startZ };
  
  virus.setAttribute('position', `${currentPos.x} ${currentPos.y} ${currentPos.z}`);
  
  if (isBoss) {
    // The Boss Virus
    virus.setAttribute('geometry', 'primitive: octahedron; radius: 0.8;');
    virus.setAttribute('material', 'color: #000000; wireframe: true;');
  } else {
    // Standard Virus (Corona-style)
    virus.setAttribute('geometry', 'primitive: tetrakisHexahedron; radius: 0.18;');
    virus.setAttribute('material', 'color: #2ECC71;');
  }
  
  marker.appendChild(virus);

  // Physics Loop
  let virusInterval = setInterval(() => {
    if (isGameOver) {
      clearInterval(virusInterval);
      return;
    }

    let dx = wbcPos.x - currentPos.x;
    let dz = wbcPos.z - currentPos.z;
    let distance = Math.sqrt(dx*dx + dz*dz);
    
    let speed = isBoss ? 0.08 : 0.02;
    
    if (distance > 0) {
      currentPos.x += (dx / distance) * speed;
      currentPos.z += (dz / distance) * speed;
      virus.setAttribute('position', `${currentPos.x} ${currentPos.y} ${currentPos.z}`);
    }

    // Collision Detection
    if (isBoss && distance < 1.2) {
      isGameOver = true;
      gameOverScreen.style.display = 'block';
      wbc.setAttribute('color', '#FF0000');
      clearInterval(virusInterval);
    } else if (!isBoss && distance < 0.4) {
      score++;
      scoreText.innerText = score;
      marker.removeChild(virus);
      clearInterval(virusInterval);
    }

  }, 50);
}
