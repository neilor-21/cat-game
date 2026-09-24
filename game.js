const cat = document.getElementById("cat");
const orb = document.getElementById("orb");
const scoreDisplay = document.getElementById("score");

let catX = 0;
let direction = 1;
let speed = 1.5;

let score = 0;

let nextDirectionChange = 0;
let pauseUntil = 0;


// ------------------------------------
// CAT MOVEMENT
// ------------------------------------

function moveCat(timestamp) {

    // Occasionally change direction
    if (timestamp > nextDirectionChange) {

        direction = Math.random() < 0.5 ? -1 : 1;

        // Slightly different speed each time
        speed = 1 + Math.random() * 2;

        // Choose when the next change happens
        nextDirectionChange =
            timestamp + 1500 + Math.random() * 3000;
    }


    // Occasionally pause
    if (timestamp > pauseUntil) {

        catX += direction * speed;

    }


    // Keep cat inside the screen
    const maxX = window.innerWidth - 60;

    if (catX <= 0) {

        catX = 0;
        direction = 1;

    }

    if (catX >= maxX) {

        catX = maxX;
        direction = -1;

    }


    cat.style.left = `${catX}px`;


    checkCollision();

    requestAnimationFrame(moveCat);
}


// ------------------------------------
// COLLISION
// ------------------------------------

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


// ------------------------------------
// MOVE XP ORB
// ------------------------------------

function moveOrb() {

    const x =
        Math.random() * (window.innerWidth - 50);

    const y =
        120 + Math.random() *
        (window.innerHeight - 200);

    orb.style.left = `${x}px`;
    orb.style.top = `${y}px`;

}


// ------------------------------------
// START GAME
// ------------------------------------

moveOrb();

requestAnimationFrame(moveCat);
