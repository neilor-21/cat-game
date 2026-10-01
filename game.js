const cat = document.getElementById("cat");
const orb = document.getElementById("orb");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");


// ------------------------------------
// CAT MOVEMENT
// ------------------------------------

let catX = 0;
let direction = 1;

let speed = 1.5;
let targetSpeed = 1.5;


// ------------------------------------
// XP SYSTEM
// ------------------------------------

let score = 0;
let level = 1;

const XP_PER_ORB = 10;
const XP_PER_LEVEL = 100;

let collectingOrb = false;


// ------------------------------------
// ADD XP
// ------------------------------------

function addXP(amount) {

    score += amount;

    // Calculate level
    const newLevel =
        Math.floor(score / XP_PER_LEVEL) + 1;


    // Check for level up
    if (newLevel > level) {

        level = newLevel;

        console.log(
            `LEVEL UP! You are now Level ${level}`
        );

    } else {

        level = newLevel;
    }


    // Update HUD
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
}


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

    approaching: {
        row: 0,
        duration: null,
        frameSpeed: 80
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


    // ------------------------------------
    // WALKING
    // ------------------------------------

    if (catState === "walking") {

        if (Math.random() < 0.002) {

            changeState("idle");
        }

        return;
    }


    // ------------------------------------
    // APPROACHING
    // ------------------------------------

    if (catState === "approaching") {

        // Movement is handled by moveCat()

        return;
    }


    // ------------------------------------
    // IDLE
    // ------------------------------------

    if (
        catState === "idle" &&
        timestamp - stateStartedAt >= state.duration
    ) {

        const randomChoice = Math.random();

        if (randomChoice < 0.45) {

            changeState("walking");

        } else {

            changeState("sitting");
        }

        return;
    }


    // ------------------------------------
    // SITTING
    // ------------------------------------

    if (
        catState === "sitting" &&
        timestamp - stateStartedAt >= state.duration
    ) {

        const randomChoice = Math.random();

        if (randomChoice < 0.5) {

            changeState("walking");

        } else {

            changeState("licking");
        }

        return;
    }


    // ------------------------------------
    // LICKING
    // ------------------------------------

    if (
        catState === "licking" &&
        timestamp - stateStartedAt >= state.duration
    ) {

        changeState("walking");
    }
}


// ------------------------------------
// RANDOM DIRECTION CHANGE
// ------------------------------------

let nextDirectionChange = 0;


// ------------------------------------
// CAT MOVEMENT LOOP
// ------------------------------------

function moveCat(timestamp) {

    updateState(timestamp);


    // ------------------------------------
    // WALKING / APPROACHING
    // ------------------------------------

    if (
        catState === "walking" ||
        catState === "approaching"
    ) {

        const catRect =
            cat.getBoundingClientRect();

        const orbRect =
            orb.getBoundingClientRect();


        const catCenter =
            catRect.left +
            catRect.width / 2;

        const orbCenter =
            orbRect.left +
            orbRect.width / 2;


        const distance =
            Math.abs(orbCenter - catCenter);


        // ------------------------------------
        // NOTICE XP
        // ------------------------------------

        if (
            catState === "walking" &&
            distance < 250
        ) {

            changeState("approaching");
        }


        // ------------------------------------
        // APPROACH XP
        // ------------------------------------

        if (catState === "approaching") {

            if (orbCenter > catCenter) {

                direction = 1;

            } else {

                direction = -1;
            }


            // Move toward orb smoothly
            targetSpeed = 2.2;


            // Once very close, slow down
            if (distance < 20) {

                targetSpeed = 1.5;
            }
        }


        // ------------------------------------
        // NORMAL WANDERING
        // ------------------------------------

        if (catState === "walking") {

            targetSpeed = 1.5;


            if (
                timestamp > nextDirectionChange &&
                distance >= 250
            ) {

                direction =
                    Math.random() < 0.5
                        ? -1
                        : 1;


                targetSpeed =
                    1 + Math.random() * 2;


                nextDirectionChange =
                    timestamp +
                    1500 +
                    Math.random() * 3000;
            }
        }


        // ------------------------------------
        // SMOOTH ACCELERATION
        // ------------------------------------

        speed +=
            (targetSpeed - speed) * 0.05;


        catX +=
            direction * speed;
    }


    // ------------------------------------
    // SCREEN BOUNDARIES
    // ------------------------------------

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


    // ------------------------------------
    // APPLY POSITION
    // ------------------------------------

    cat.style.left =
        `${catX}px`;


    // ------------------------------------
    // FACE MOVEMENT DIRECTION
    // ------------------------------------

    if (direction === 1) {

        cat.style.transform =
            "scaleX(1)";

    } else {

        cat.style.transform =
            "scaleX(-1)";
    }


    // ------------------------------------
    // CHECK XP COLLISION
    // ------------------------------------

    checkCollision();


    // ------------------------------------
    // UPDATE ANIMATION
    // ------------------------------------

    animateCat(timestamp);


    // ------------------------------------
    // NEXT FRAME
    // ------------------------------------

    requestAnimationFrame(moveCat);
}


// ------------------------------------
// COLLISION
// ------------------------------------

function checkCollision() {

    // Prevent repeated collection
    if (collectingOrb) {

        return;
    }


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

        addXP(XP_PER_ORB);

        collectOrb();
    }
}


// ------------------------------------
// COLLECT XP ORB
// ------------------------------------

function collectOrb() {

    collectingOrb = true;


    // Collection animation
    orb.style.transform =
        "scale(1.8)";

    orb.style.opacity =
        "0";


    setTimeout(() => {

        moveOrb();


        orb.style.transform =
            "scale(1)";

        orb.style.opacity =
            "1";


        collectingOrb = false;


        // Return to normal wandering
        changeState("walking");

    }, 200);
}


// ------------------------------------
// MOVE XP ORB
// ------------------------------------

function moveOrb() {

    // Random horizontal position
    const x =
        Math.random() *
        (window.innerWidth - 50);


    // Keep orb near cat's walking level
    const y =
        window.innerHeight - 120;


    orb.style.left =
        `${x}px`;

    orb.style.top =
        `${y}px`;
}


// ------------------------------------
// START GAME
// ------------------------------------

moveOrb();

changeState("walking");

requestAnimationFrame(moveCat);
