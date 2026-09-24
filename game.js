const cat = document.getElementById("cat");

let x = 0;
let speed = 2;

function moveCat() {
    x += speed;

    if (x > window.innerWidth) {
        x = -60;
    }

    cat.style.left = `${x}px`;

    requestAnimationFrame(moveCat);
}

moveCat();
