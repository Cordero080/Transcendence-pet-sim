// console.log("⚡️⚡️⚡️⚡️ ¡ ENGAGED ! ⚡️⚡️⚡️⚡️");

// /*
// what are we building? 
// - A simple pet simulator game.

// [User Stories]
// - The player can feed, play with and put the pet to sleep.
// - The player can name the pet when starting the game. 

// ❌[losing Conditions]
// - The pet can pass out fform hunger, tiredness, and boredom.

// ✨[Winning Condition]
// - The pet can age over time and eventually evolve into a new form.

// */

// // will have properties like:
// // -name
// // -hunger level
// // -tiredness level
// // -boredeom level

// // ----[Will have methods like:]
// // - feed()
// // - play()
// // - sleep()
// // - age()
// //  - evolve()
// // -hatching()

// //create an empty pet variable container to later hold the pet instance. We have t declare it outside the class so that we can access it globally in the game. ???

// //create an empty pet variable container to later hold the pet instance. We have t declare it outside the class so that we can access it globally in the game. ???

// let myPet; // emoty variable CONTAINER that will hold the pet instance. Declared outside the class to access golabally in game

// console.log("myPet is..", myPet);

// // ---GAME SETINGS---
// //change these settings to adjust age speed for demo
// const gameSettings = {
//   ageInterval: 1000,
// };

// // [Class definition for pet]---------------------------------
// class Pet {
//   // set up the default constructor values/properties
//   // a consteructor is like a starter DNA for our pet
//   // constructro will accdept a peramiter for the pets name which will be a string. If they don't provide a name, it will default to "UGGO"
//   constructor(petName = "DefaultPetnameUGGO") {
//     this.name = petName;
//     this.age = 0; //default age. Increases over time but if it reaches five pet evolves and you win.
//     this.hunger = 0; //hunger starts at 0, reaches 10 passes out from hunger
//     this.sleepiness = 0; // tiredness starts at zero, reaches 10 passes out
//     this.fun = 10; // once it reaches 0, pet passes out from boredom
//   } // END OF CONSTRUCTOR
//   // END OF PET CLASS

//   // create a methiod to hatch a new pet. In classes, methods are typed this way, and not "function: feed()"."

//   petAges() {
//     console.log(`Pet aging...`);
//     this.age = this.age + 1;
//     console.log(`Happy BDAY! 🎂, your pet is not ${this.age} years old!`);
//   }

//   hatching() {
//     // Hatch the pet (console log pet hatched) and set timer interval to begin aging process...
//     console.log("🥚A new pet is hatching!🥚");

//     // start aging timer
//     setInterval(() => {
//       this.petAges();
//     }, gameSettings.ageInterval);
//   }

//   passout() {
//     console.log(`💤${this.name} has passed out!💤`);
//   }
// }

// // WHERE WE USE THE CLASS -starting and resetting of game

// function startGame() {
//   console.log(
//     "⚡️⚡️⚡️⚡️⚡️ ¡Welcome to the Pet Simulator Game! ⚡️⚡️⚡️⚡️⚡️"
//   ); // greeting ,essage
//   myPet = new Pet("Coco"); // create pet
//   console.log(myPet); // console log pet

//   myPet.hatching(); //calling method
//   myPet.passout();
// }

// startGame(); //call function to log on console.

// //This constructed class is used when we're ready to create our pet like this
// // a new pet of the pet class. // name user gives pet.















console.log("⚡️⚡️⚡️⚡️ ¡ ENGAGED ! ⚡️⚡️⚡️⚡️");









// ────────────── GLOBAL VARIABLES ──────────────
let myPet;

const gameSettings = {
ageInterval: 1000, // Change this to adjust how fast the pet ages
};

// ────────────── PET CLASS ──────────────
class Pet {
constructor(petName = "DefaultPetnameUGGO") {
this.name = petName;
this.age = 0;
this.hunger = 0;
this.sleepiness = 0;
this.fun = 10;
}

petAges() {
console.log(`Pet aging...`);
this.age++;
console.log(`🎂 Happy BDAY! Your pet is now ${this.age} years old!`);
}

hatching() {
console.log("🥚A new pet is hatching!🥚");
setInterval(() => this.petAges(), gameSettings.ageInterval);
}

passout() {
console.log(`💤 ${this.name} has passed out! 💤`);
}
}

// ────────────── GAME FUNCTIONS ──────────────
function startGame() {
console.log("⚡️⚡️⚡️ Welcome to the Pet Simulator Game! ⚡️⚡️⚡️");
myPet = new Pet("Coco");
console.log("myPet is:", myPet);
myPet.hatching();
myPet.passout();
}

function resetGame() {
const colorfulGlitchDiv = document.getElementById("colorfulGlitchDiv");
const sonicImage = document.getElementById("sonicImage");
const sonicContainer = document.querySelector(".sonic-container");

if (colorfulGlitchDiv && sonicImage && sonicContainer) {
console.log("Resetting game to egg state...");
sonicImage.style.display = "none";
sonicImage.classList.remove("hatching", "born");
sonicContainer.classList.remove("hatching");
colorfulGlitchDiv.style.display = "flex";
colorfulGlitchDiv.classList.remove("hatching");
sonicImage.src = "resources/sonic.gif";
sonicImage.alt = "sonic rotating animation";
console.log("Game reset complete - egg is visible again!");
}
}

function showSonic() {
const colorfulGlitchDiv = document.getElementById("colorfulGlitchDiv");
const sonicImage = document.getElementById("sonicImage");
const sonicContainer = document.querySelector(".sonic-container");

if (colorfulGlitchDiv && sonicImage && sonicContainer) {
colorfulGlitchDiv.classList.add("hatching");

setTimeout(() => {
colorfulGlitchDiv.style.display = "none";
sonicImage.style.display = "block";
sonicImage.classList.add("hatching");
sonicContainer.classList.add("hatching");

setTimeout(() => {
sonicImage.classList.remove("hatching");
sonicImage.classList.add("born");
sonicContainer.classList.remove("hatching");
console.log("Sonic fully hatched and ready!");
}, 2000);
}, 1500);
}
}

// ────────────── EVENT LISTENERS ──────────────
document.addEventListener("DOMContentLoaded", () => {
setupDropdownMenu();
setupFeedAndDance();
setupOverlayAndReset();
setup3DTextHover();
startGame(); // Call to begin game logic
});

// Dropdown menu toggle
function setupDropdownMenu() {
const btn = document.getElementById("infoDropdownBtn");
const menu = document.getElementById("infoDropdownMenu");
const container = document.querySelector(".dropdown-container");

if (btn && menu && container) {
btn.addEventListener("click", (e) => {
e.preventDefault();
e.stopPropagation();
menu.style.display = menu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
if (!container.contains(e.target)) menu.style.display = "none";
});
}
}

// Feed & Dance Button Functionality
function setupFeedAndDance() {
const buttons = document.querySelectorAll(".Buttons");
const feedButton = buttons[0];
const danceButton = buttons[1];
const sonicImage = document.getElementById("sonicImage");

if (feedButton && sonicImage) {
feedButton.addEventListener("click", () => {
if (sonicImage.style.display !== "none") {
sonicImage.src = "resources/sonic-eats-5.gif";
sonicImage.alt = "sonic eating animation";
setTimeout(() => {
sonicImage.src = "resources/sonic.gif";
sonicImage.alt = "sonic rotating animation";
}, 6000);
}
});
}

if (danceButton && sonicImage) {
danceButton.addEventListener("click", () => {
if (sonicImage.style.display !== "none") {
sonicImage.src = "resources/sonic-dance2.gif";
sonicImage.alt = "sonic dancing animation";
setTimeout(() => {
sonicImage.src = "resources/sonic.gif";
sonicImage.alt = "sonic rotating animation";
}, 13000);
}
});
}
}

// Overlay Start, Reset, and Sonic Reveal
function setupOverlayAndReset() {
const overlay = document.getElementById("pageOverlay");
const overlayStartBtn = document.getElementById("overlayStartButton");
const regularStartBtn = document.querySelector(".startButtonContainer .StartButton");
const resetBtn = document.querySelector(".ResetButton");

overlayStartBtn?.addEventListener("click", () => {
overlay.classList.add("hidden");
setTimeout(() => overlay.style.display = "none", 500);
});

regularStartBtn?.addEventListener("click", () => {
showSonic();
});

resetBtn?.addEventListener("click", () => {
console.log("Reset clicked");
resetGame();
});
}

// Text hover tilt effect for intro screen
function setup3DTextHover() {
const overlayTexts = document.querySelectorAll(".overlay-content h2, .overlay-content p");

overlayTexts.forEach((el) => {
el.addEventListener("mouseenter", () => el.classList.add("text-hover"));

el.addEventListener("mousemove", (e) => {
const rect = el.getBoundingClientRect();
const rotateX = ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * -8;
const rotateY = ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 8;
const scale = el.tagName === "H2" ? 1.15 : 1.1;
const translateZ = el.tagName === "H2" ? 15 : 10;

el.style.transform = `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
});

el.addEventListener("mouseleave", () => {
el.style.transform = "scale(1) rotateX(0deg) rotateY(0deg) translateZ(0px)";
el.classList.remove("text-hover");
});
});
}