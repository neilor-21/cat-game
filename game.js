const cat = document.getElementById("cat");
const orb = document.getElementById("orb");
const scoreDisplay = document.getElementById("score");

let catX = 0;
let speed = 2;

let score = 0;

function moveCat() {

    catX += speed;

    // Wrap around the screen
    if (catX > window.innerWidth + 60) {
        catX = -60;
    }

    cat.style.left = `${catX}px`;

    checkCollision();

    requestAnimationFrame(moveCat);
}

function checkCollision() {

    const catRect = cat.getBoundingClientRect();
    const orbRect = orb.getBoundingClientRect();

    const touching =
        catRect.left < orbRect.right &&
        catRect.right > orbRect.left &&
        catRect.top < orbRect.bottom &&
        catRect.bottom > orbRect.top;

    if (touching) {

        score++;

        scoreDisplay.textContent = score;

        moveOrb();
    }
}

function moveOrb() {

    const x = Math.random() * (window.innerWidth - 50);
    const y = 120 + Math.random() * (window.innerHeight - 200);

    orb.style.left = `${x}px`;
    orb.style.top = `${y}px`;
}

moveOrb();
moveCat();
