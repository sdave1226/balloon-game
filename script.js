const pump = document.getElementById("pump-image");
const balloonArea = document.getElementById("balloon-area");
const popSound = document.getElementById("pop-sound");
let currentBalloon = null;
let pumpCount = 0;
let score = 0;
let canPump = true;

pump.addEventListener("click", () => {
    if (!canPump) return;
    canPump = false;
    setTimeout(() => (canPump = true), 500);

    pump.classList.add("pressed");
    setTimeout(() => pump.classList.remove("pressed"), 100);

    // if (!currentBalloon) {
    //     currentBalloon = document.createElement("div");
    //     currentBalloon.classList.add("balloon");
    //     console.log("Balloon created"); // 👈 ADD THIS
    //     balloonArea.appendChild(currentBalloon);
    // }

    if (!currentBalloon) {
        currentBalloon = document.createElement("div");
        currentBalloon.classList.add("balloon");
    
        // 🔢 Random balloon image
        const randomIndex = Math.floor(Math.random() * 10) + 1; // 1–10
        currentBalloon.style.backgroundImage = `url('assets/balloon-${randomIndex}.png')`;
    
        // 🔤 Random letter
        const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
        const label = document.createElement("span");
        label.textContent = letter;
        label.style.position = "absolute";
        label.style.top = "50%";
        label.style.left = "50%";
        label.style.transform = "translate(-50%, -50%)";
        label.style.fontSize = "32px";
        label.style.fontWeight = "bold";
        label.style.color = "#fff"; // White letter
        label.style.pointerEvents = "none";
        currentBalloon.appendChild(label);
    
        currentBalloon.addEventListener("click", function () {
            blastBalloon(this);
        });
    
        balloonArea.appendChild(currentBalloon);
    }    
    

    pumpCount++;
    const scale = 1 + pumpCount * 0.2;
    currentBalloon.style.setProperty('--balloon-scale', scale);
    currentBalloon.style.transform = `scale(${scale})`;

    if (pumpCount >= 3) {
        flyBalloon(currentBalloon);
        currentBalloon = null;
        pumpCount = 0;
    }
});

// ✅ Add global click handler for any .balloon inside balloonArea
balloonArea.addEventListener("click", (event) => {
    const balloon = event.target.closest(".balloon");
    if (balloon) {
        console.log("Balloon clicked via event delegation");
        blastBalloon(balloon);
    }
});

function flyBalloon(balloon) {
    const scaleValue = parseFloat(balloon.style.transform.match(/scale\(([^)]+)\)/)?.[1]) || 1;
    balloon.style.setProperty('--balloon-scale', scaleValue);

    // Position the balloon absolutely near bottom-right
    balloon.style.bottom = `330px`;
    balloon.style.right = `275px`;
    balloon.style.left = "auto"; 
    balloon.style.top = "auto";

    balloon.style.animation = 'floatToTopLeftFullScreen 8s linear forwards';

    // Remove after animation completes
    setTimeout(() => {
        if (balloon?.parentElement) {
            balloon.remove();
        }
    }, 5000);
}



function blastBalloon(balloon) {
    if (!balloon || balloon.dataset.blasted === "true") return;
    balloon.dataset.blasted = "true";

    // Freeze transform to avoid animation affecting coordinates
    balloon.style.transition = "none";
    balloon.style.transform = "none";

    const rect = balloon.getBoundingClientRect();
    const areaRect = balloonArea.getBoundingClientRect();

    const x = rect.left - areaRect.left;
    const y = rect.top - areaRect.top;
    const width = rect.width;
    const height = rect.height;
    console.log("Creating blast at:", x, y);
    console.log("Appending to:", balloonArea);

    balloon.style.animation = "none";

    popSound.currentTime = 0;
    popSound.play();

    balloon.remove();

    const blast = document.createElement("div");
    blast.style.position = "absolute";
    blast.style.left = `${x}px`;
    blast.style.top = `${y}px`;
    blast.style.width = `${width}px`;
    blast.style.height = `${height}px`;
    blast.style.background = "url('assets/blast.png') no-repeat center";
    blast.style.backgroundSize = "contain";
    blast.style.pointerEvents = "none";
    blast.style.zIndex = 20;
    blast.classList.add("blast-animate");
    balloonArea.appendChild(blast);

    setTimeout(() => blast.remove(), 500);

    score++;
    document.getElementById("score").innerText = `Score: ${score}`;
}
