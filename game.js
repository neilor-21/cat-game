const cat = document.getElementById("cat");
const orb = document.getElementById("orb");
const scoreDisplay = document.getElementById("score");

let catX = 0;
let direction = 1;
let speed = 1.5;

let score = 0;

let nextDirectionChange = 0;

let currentFrame = 0;
let lastFrameTime = 0;

const frameWidth = 96;
const frameHeight = 96;

const framesPerAnimation = 8;


// ------------------------------------
// CAT ANIMATION
// ------------------------------------

function animateCat(timestamp) {

    if (timestamp - lastFrameTime > 100) {

        currentFrame =
            (currentFrame + 1) % framesPerAnimation;

        updateSprite();

        lastFrameTime = timestamp;
    }
}


// ------------------------------------
// DISPLAY CURRENT SPRITE FRAME
// ------------------------------------

function updateSprite() {

    const x = currentFrame * frameWidth;

    cat.style.backgroundPosition =
        `-${x}px 0px`;
}


// ------------------------------------
// CAT MOVEMENT
// ------------------------------------

function moveCat(timestamp) {

    if (timestamp > nextDirectionChange) {

        direction =
            Math.random() < 0.5 ? -1 : 1;

        speed =
            1 + Math.random() * 2;

        nextDirectionChange =
            timestamp + 1500 + Math.random() * 3000;
    }


    catX += direction * speed;


    const maxX =
        window.innerWidth - 96;


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

    animateCat(timestamp);

    requestAnimationFrame(moveCat);
}


// ------------------------------------
// COLLISION
// ------------------------------------

function checkCollision() {

    const catRect =
        cat.getBoundingClientRect();

    const orbRect =
        orb.getBoundingClientRect();


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
        Math.random() *
        (window.innerWidth - 50);


    const y =
        120 +
        Math.random() *
        (window.innerHeight - 200);


    orb.style.left = `${x}px`;
    orb.style.top = `${y}px`;
}


// ------------------------------------
// START
// ------------------------------------

moveOrb();

requestAnimationFrame(moveCat);
