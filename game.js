const cat = document.getElementById("cat");
const orb = document.getElementById("orb");
const scoreDisplay = document.getElementById("score");

// ------------------------------------
// CAT MOVEMENT
// ------------------------------------

let catX = 0;
let direction = 1;
let speed = 1.5;

// ------------------------------------
// GAME
// ------------------------------------

let score = 0;

// ------------------------------------
// CAT STATE
// ------------------------------------

let catState = "walking";

let stateStartedAt = performance.now();

const states = {
    walking: {
        row: 0,
        duration: null,
        frameSpeed: 100
    },

    idle: {
        row: 1,
        duration: 2000,
        frameSpeed: 180
    },

    sitting: {
        row: 2,
        duration: 3000,
        frameSpeed: 250
    },

    licking: {
        row: 3,
        duration: 2500,
        frameSpeed: 180
    }
};

// ------------------------------------
// SPRITE
// ------------------------------------

const frameWidth = 96;
const frameHeight = 96;

const framesPerAnimation = 8;

let currentFrame = 0;
let lastFrameTime = 0;


// ------------------------------------
// CHANGE STATE
// ------------------------------------

function changeState(newState) {

    catState = newState;

    stateStartedAt = performance.now();

    currentFrame = 0;

    updateSprite();
}


// ------------------------------------
// UPDATE SPRITE
// ------------------------------------

function updateSprite() {

    const state = states[catState];

    const x = currentFrame * frameWidth;
    const y = state.row * frameHeight;

    cat.style.backgroundPosition =
        `-${x}px -${y}px`;
}


// ------------------------------------
// ANIMATION
// ------------------------------------

function animateCat(timestamp) {

    const state = states[catState];

    if (
        timestamp - lastFrameTime >
        state.frameSpeed
    ) {

        currentFrame =
            (currentFrame + 1) %
            framesPerAnimation;

        updateSprite();

        lastFrameTime = timestamp;
    }
}


// ------------------------------------
// STATE BEHAVIOR
// ------------------------------------

function updateState(timestamp) {

    const state = states[catState];

    if (
        state.duration !== null &&
        timestamp - stateStartedAt >= state.duration
    ) {

        if (catState === "idle") {

            changeState("sitting");

        } else if (catState === "sitting") {

            changeState("licking");

        } else if (catState === "licking") {

            changeState("walking");

        }
    }
}


// ------------------------------------
// MOVEMENT
// ------------------------------------

let nextDirectionChange = 0;

function moveCat(timestamp) {

    updateState(timestamp);

    if (catState === "walking") {

        if (timestamp > nextDirectionChange) {

            direction =
                Math.random() < 0.5 ? -1 : 1;

            speed =
                1 + Math.random() * 2;

            nextDirectionChange =
                timestamp +
                1500 +
                Math.random() * 3000;
        }

        catX += direction * speed;
    }


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

changeState("walking");

requestAnimationFrame(moveCat);
