console.log("⚡️⚡️⚡️⚡️ ¡ ENGAGED ! ⚡️⚡️⚡️⚡️");

// ⚠️ TEMPORARY EVOLUTION TESTING MODE ⚠️
// - Stat decay is disabled
// - Game over logic is disabled
// - Aging is set to 1 second per age for rapid evolution testing
// - Pet will evolve through all color stages without interruption

// ────────────── GLOBAL VARIABLES ──────────────
let myPet;
let gameStarted = false; // Track if the game has been started
let backgroundMusic; // Background music audio element

// Button tracking for evolution system
let buttonTracker = {
  feed: false,
  dance: false,
  sleep: false,
};

const evolutionStages = [
  {
    stage: "blue",
    age: 0,
    class: "blue-form",
    message: " I've evolved into Blue Form! So, this is life!",
  },
  {
    stage: "yellow",
    age: 5,
    class: "yellow-form",
    message:
      " I'm Yellow now! I've learned that the foolish seek joy in the distance, and the wise grow it under their feet!",
  },
  {
    stage: "green",
    age: 10,
    class: "green-form",
    message: " I've evolved to green! This is DIFFERENT!",
  },
  {
    stage: "red",
    age: 15,
    class: "red-form",
    message: " I've become Red!",
  },
  {
    stage: "white",
    age: 20,
    class: "white-form",
    message: "⚪ I have transcended!",
  },
];

const gameSettings = {
  ageInterval: 10000, // TEMPORARY: Fast aging for rapid evolution testing (1 second per age)
};

// ────────────── PET CLASS ──────────────
class Pet {
  constructor(petName = "Coco") {
    this.name = petName;
    this.age = 0;
    this.hunger = 0;
    this.sleepiness = 0;
    this.fun = 10;
    this.stage = "egg";
    this.ageInterval = null;
    this.decayInterval = null;
    this.showingEvolutionMessage = false; // Flag to track evolution messages
    this.evolutionLevel = 0; // Track current evolution level (0-4 for blue,yellow,green,red,white)
    this.showingActionMessage = false; // Flag to track feeding/dancing/sleeping messages
  }

  petAges() {
    console.log(`Pet aging...`);
    this.age++;
    console.log(`🎂 Happy BDAY! Your pet is now ${this.age} years old!`);

    // TEMPORARY: Commenting out age-based evolution - now using button-based evolution
    /*
    // Check for age-based game over
    if (this.age >= 25) {
      this.gameOver("age");
      return;
    }

    // Data-driven evolution check
    const nextStage = evolutionStages.find((stage) => this.age === stage.age);
    if (nextStage) {
      this.evolve();
    }
    */
  }

  hatching() {
    console.log("🥚A new pet is hatching!🥚");
    this.stage = "blue"; // Set initial stage to blue when hatching

    // Update chat to show blue form
    const petChat = document.querySelector(".infoBox_petChat");
    if (petChat) {
      petChat.textContent = `Age: ${this.age} | 🔵 Blue Form | ...\"Feed ME'`;
    }

    this.startAging();
  }

  startAging() {
    this.ageInterval = setInterval(() => {
      this.petAges();

      // Only update chat if we're not currently showing an evolution message or action message
      const petChat = document.querySelector(".infoBox_petChat");
      if (
        petChat &&
        !this.showingEvolutionMessage &&
        !this.showingActionMessage
      ) {
        const stageEmojis = {
          egg: "🥚",
          blue: "🔵",
          yellow: "🟡",
          green: "🟢",
          red: "🔴",
          white: "⚪",
        };
        const stageEmoji = stageEmojis[this.stage] || "🔵";
        const stageText =
          this.stage.charAt(0).toUpperCase() + this.stage.slice(1);
        petChat.textContent = `Age: ${this.age} | ${stageEmoji} ${stageText} Form | ...\"Feed ME'`;
      }
    }, gameSettings.ageInterval);
  }
  startStatDecay() {
    // TEMPORARY: Commenting out stat decay for rapid evolution testing
    /*
    this.decayInterval = setInterval(() => {
      this.hunger = Math.min(10, this.hunger + 1);
      this.sleepiness = Math.min(10, this.sleepiness + 1);
      this.fun = Math.max(0, this.fun - 1);

      console.log(
        `Decay: Hunger ${this.hunger}, Sleepiness ${this.sleepiness}, Fun ${this.fun}`
      );

      // Apply visual effects when close to death
      const sonicImage = document.getElementById("sonicImage");
      if (sonicImage) {
        if (this.hunger >= 10 && this.sleepiness >= 10 && this.fun <= 2) {
          // Very close to death - apply grey effect
          sonicImage.style.filter = "grayscale(100%) brightness(0.5)";
          sonicImage.style.opacity = "0.7";
        } else {
          // Reset to normal appearance
          sonicImage.style.filter = "";
          sonicImage.style.opacity = "1";
        }
      }

      // Game over only when ALL stats are at their worst: hunger 10, sleepiness 10, fun 0
      if (this.hunger >= 10 && this.sleepiness >= 10 && this.fun <= 0) {
        this.gameOver("stats");
        return;
      }

      render(); // update text
    }, gameSettings.ageInterval); // Same speed as aging timer
    */
  }

  passout() {
    console.log(`💤 ${this.name} has passed out! 💤`);
    // TEMPORARY: Commenting out game over for rapid evolution testing
    // this.gameOver("stats");
  }

  gameOver(reason) {
    console.log(`🎮 GAME OVER! Reason: ${reason}`);

    // Stop all timers
    this.stopAlltimers();

    // Update the UI based on game over reason
    const petChat = document.querySelector(".infoBox_petChat");
    const sonicImage = document.getElementById("sonicImage");

    if (reason === "age") {
      if (petChat) {
        petChat.textContent = `💀 Game Over! ${this.name} lived to age ${this.age} and passed away naturally.`;
      }
      console.log(`${this.name} died of old age at ${this.age} years old.`);
    } else if (reason === "stats") {
      if (petChat) {
        petChat.textContent = `💀 Game Over! ${this.name} died from neglect. Take better care next time!`;
      }
      console.log(
        `${this.name} died from poor care (hunger: ${this.hunger}, sleep: ${this.sleepiness}, fun: ${this.fun}).`
      );
    }

    // Optional: Add death visual effect
    if (sonicImage) {
      sonicImage.style.filter = "grayscale(100%) brightness(0.5)";
      sonicImage.style.opacity = "0.7";
    }

    // Optional: Show game over screen after delay
    setTimeout(() => {
      if (confirm("Game Over! Would you like to play again?")) {
        resetGame();
      }
    }, 5000); // this gives time for the player to read the message
  }

  stopAlltimers() {
    if (this.ageInterval) {
      clearInterval(this.ageInterval);
      this.ageInterval = null;
    }
    if (this.decayInterval) {
      clearInterval(this.decayInterval);
      this.decayInterval = null;
    }
    console.log("All timers stopped");
  }

  evolve() {
    console.log(`🌟 ${this.name} is evolving! 🌟`);
    const petChat = document.querySelector(".infoBox_petChat");

    // Find the evolution stage for current age
    const currentEvolution = evolutionStages.find(
      (stage) => this.age === stage.age
    );

    if (!currentEvolution) {
      console.log("No evolution found for age:", this.age);
      return;
    }

    // Update stage and display evolution message
    this.stage = currentEvolution.stage;
    this.showingEvolutionMessage = true; // Set flag to prevent overwriting

    if (petChat) {
      petChat.textContent = `Age: ${this.age} | ✨ I'm evolving!`;

      // Show evolution message after a brief delay
      setTimeout(() => {
        if (petChat) {
          const stageEmojis = {
            blue: "🔵",
            yellow: "🟡",
            green: "🟢",
            red: "🔴",
            white: "⚪",
          };
          const emoji = stageEmojis[currentEvolution.stage] || "✨";
          petChat.textContent = `Age: ${this.age} | ${emoji} ${
            currentEvolution.stage.charAt(0).toUpperCase() +
            currentEvolution.stage.slice(1)
          } Form - ${currentEvolution.message}`;
        }

        // Note: showingEvolutionMessage flag will be cleared by the next evolution
        // This way the message persists until the next evolution occurs
      }, 1000);
    }

    // Apply visual changes
    updatePetVisual(currentEvolution.stage);

    // Special handling for final evolution (transcendence)
    if (currentEvolution.stage === "white") {
      setTimeout(() => {
        this.triggerTranscendence();
      }, 2000);
    }
  }

  // NEW: Button-based evolution method
  evolveToNextStage() {
    console.log(
      `🌟 ${this.name} is evolving to next stage! Current level: ${this.evolutionLevel} 🌟`
    );

    // Don't evolve beyond white stage
    if (this.evolutionLevel >= 4) {
      console.log("Already at maximum evolution level");
      return;
    }

    this.evolutionLevel++;

    // Map evolution levels to stages
    const stageMap = {
      0: {
        stage: "blue",
        message: " I've evolved into Blue Form! So, this is life!",
      },
      1: {
        stage: "yellow",
        message:
          " The foolish seek joy in the distance, and the wise grow it under their feet!",
      },
      2: { stage: "green", message: " I'm now Green! Growing stronger!" },
      3: {
        stage: "red",
        message: " I've become Red! Power surges through me!",
      },
      4: {
        stage: "white",
        message: "⚪ I have transcended to White Form! Ready for the beyond...",
      },
    };

    const currentEvolution = stageMap[this.evolutionLevel];

    if (!currentEvolution) {
      console.log("No evolution found for level:", this.evolutionLevel);
      return;
    }

    // Update stage and display evolution message
    this.stage = currentEvolution.stage;
    this.showingEvolutionMessage = true;

    const petChat = document.querySelector(".infoBox_petChat");
    if (petChat) {
      petChat.textContent = `✨ Evolving...`;

      // Show evolution message after a brief delay
      setTimeout(() => {
        if (petChat) {
          const stageEmojis = {
            blue: "🔵",
            yellow: "🟡",
            green: "🟢",
            red: "🔴",
            white: "⚪",
          };
          const emoji = stageEmojis[currentEvolution.stage] || "✨";
          petChat.textContent = `Level ${this.evolutionLevel + 1} | ${emoji} ${
            currentEvolution.stage.charAt(0).toUpperCase() +
            currentEvolution.stage.slice(1)
          } Form - ${currentEvolution.message}`;
        }

        // Clear the evolution message flag after displaying
        setTimeout(() => {
          this.showingEvolutionMessage = false;
        }, 3000);
      }, 1000);
    }

    // Apply visual changes
    updatePetVisual(currentEvolution.stage);

    console.log(
      `Evolution complete! New stage: ${currentEvolution.stage}, Level: ${this.evolutionLevel}`
    );
  }

  triggerTranscendence() {
    console.log("🌟 TRANSCENDENCE INITIATED! 🌟");

    // Stop all timers when transcendence begins
    this.stopAlltimers();

    const sonicImage = document.getElementById("sonicImage");
    const sonicContainer = document.querySelector(".sonic-container");

    if (sonicImage && sonicContainer) {
      // Add transcendence animation class
      sonicImage.classList.add("transcending");
      sonicContainer.classList.add("transcending");

      // Create light trail effect
      this.createLightTrail();

      // After animation completes, show transcendence message
      setTimeout(() => {
        const petChat = document.querySelector(".infoBox_petChat");
        if (petChat) {
          petChat.textContent = `✨ ${this.name} has transcended beyond this realm! ✨`;
        }

        // Optional: Reset or end game after transcendence
        setTimeout(() => {
          if (
            confirm(
              "🌟 Sonic has transcended! Would you like to start a new journey?"
            )
          ) {
            resetGame();
          }
        }, 3000);
      }, 4000);
    }
  }

  createLightTrail() {
    const sonicContainer = document.querySelector(".sonic-container");
    if (!sonicContainer) return;

    // Create multiple light trail particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "light-particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = i * 0.1 + "s";
      sonicContainer.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 5000);
    }
  }
} // End of Pet class

// ────────────── BUTTON TRACKING FUNCTIONS ──────────────
function markButtonPressed(buttonType) {
  if (buttonTracker.hasOwnProperty(buttonType)) {
    buttonTracker[buttonType] = true;
    console.log(
      `${buttonType} button pressed - tracking updated:`,
      buttonTracker
    );
    updateEvolutionIndicators();
  }
}

function checkButtonEvolution() {
  // Check if all three buttons have been pressed
  if (buttonTracker.feed && buttonTracker.dance && buttonTracker.sleep) {
    console.log("🌟 All buttons pressed! Evolution triggered!");

    // Special handling for white stage (transcendence)
    if (myPet && myPet.evolutionLevel === 4) {
      const petChat = document.querySelector(".infoBox_petChat");
      if (petChat) {
        petChat.textContent =
          "⚪ Transcendence imminent... preparing for the beyond...";
      }

      // 5-second delay before transcendence
      setTimeout(() => {
        myPet.triggerTranscendence();
      }, 5000);
    } else {
      // Normal evolution
      if (myPet) {
        myPet.evolveToNextStage();
      }
    }

    // Reset button tracker for next evolution cycle
    resetButtonTracker();
  }
}

function resetButtonTracker() {
  buttonTracker = {
    feed: false,
    dance: false,
    sleep: false,
  };
  updateEvolutionIndicators();
  console.log("Button tracker reset for next evolution cycle");
}

function updateEvolutionIndicators() {
  // Update visual indicators under each button
  const feedIndicator = document.querySelector("#hungerTimer");
  const danceIndicator = document.querySelector("#funTimer");
  const sleepIndicator = document.querySelector("#sleepTimer");

  // Add indicators to show which buttons have been pressed
  if (feedIndicator) {
    const indicator = buttonTracker.feed ? " ✅" : " ⭕";
    if (
      !feedIndicator.textContent.includes("✅") &&
      !feedIndicator.textContent.includes("⭕")
    ) {
      feedIndicator.textContent += indicator;
    } else {
      feedIndicator.textContent = feedIndicator.textContent.replace(
        / [✅⭕]/,
        indicator
      );
    }
  }

  if (danceIndicator) {
    const indicator = buttonTracker.dance ? " ✅" : " ⭕";
    if (
      !danceIndicator.textContent.includes("✅") &&
      !danceIndicator.textContent.includes("⭕")
    ) {
      danceIndicator.textContent += indicator;
    } else {
      danceIndicator.textContent = danceIndicator.textContent.replace(
        / [✅⭕]/,
        indicator
      );
    }
  }

  if (sleepIndicator) {
    const indicator = buttonTracker.sleep ? " ✅" : " ⭕";
    if (
      !sleepIndicator.textContent.includes("✅") &&
      !sleepIndicator.textContent.includes("⭕")
    ) {
      sleepIndicator.textContent += indicator;
    } else {
      sleepIndicator.textContent = sleepIndicator.textContent.replace(
        / [✅⭕]/,
        indicator
      );
    }
  }
}

// ────────────── BUTTON STATE MANAGEMENT ──────────────
function updateButtonStates() {
  const buttons = document.querySelectorAll(".Buttons");
  const feedButton = buttons[0];
  const danceButton = buttons[1];
  const sleepButton = buttons[2];

  if (gameStarted) {
    // Enable buttons visually
    feedButton?.classList.remove("disabled");
    danceButton?.classList.remove("disabled");
    sleepButton?.classList.remove("disabled");
    console.log("Action buttons enabled - game has started!");
  } else {
    // Disable buttons visually
    feedButton?.classList.add("disabled");
    danceButton?.classList.add("disabled");
    sleepButton?.classList.add("disabled");
    console.log("Action buttons disabled - game not started yet.");
  }
}

// ────────────── GAME FUNCTIONS ──────────────
function startGame() {
  console.log("🎮 Starting new game...");
  myPet = new Pet("Sonic");
  console.log("Pet created:", myPet);

  // Initialize evolution indicators
  resetButtonTracker();

  // Note: buttons remain disabled until hatching completes
  updateButtonStates();
}

function resetGame() {
  console.log("🔄 Resetting game...");

  // Reset game state
  gameStarted = false; // Disable action buttons
  updateButtonStates(); // Update visual state of buttons

  // Stop any existing pet timers
  if (myPet) {
    myPet.stopAlltimers();
  }

  // Reset button tracking
  resetButtonTracker();

  // Hide sonic and show egg again
  const sonicImage = document.getElementById("sonicImage");
  const colorfulGlitchDiv = document.getElementById("colorfulGlitchDiv");

  if (sonicImage) {
    sonicImage.style.display = "none";
    sonicImage.src = "resources/sonic.gif";
    // Remove all evolution classes
    sonicImage.classList.remove(
      "blue-form",
      "yellow-form",
      "green-form",
      "red-form",
      "white-form",
      "hatching",
      "born",
      "transcending"
    );
  }

  if (colorfulGlitchDiv) {
    colorfulGlitchDiv.style.display = "flex";
    colorfulGlitchDiv.classList.remove("hatching");
  }

  // Remove transcending classes from container
  const sonicContainer = document.querySelector(".sonic-container");
  if (sonicContainer) {
    sonicContainer.classList.remove("transcending");
  }

  // Reset all timer displays
  const hungerTimer = document.getElementById("hungerTimer");
  const funTimer = document.getElementById("funTimer");
  const sleepTimer = document.getElementById("sleepTimer");
  const petChat = document.querySelector(".infoBox_petChat");

  if (petChat) {
    petChat.textContent = "...\"Feed ME'";
  }

  if (hungerTimer) {
    hungerTimer.textContent = "Hunger: 0";
    hungerTimer.classList.remove("low", "medium", "high");
    hungerTimer.classList.add("high"); // Low hunger is good (green)
  }
  if (funTimer) {
    funTimer.textContent = "Fun: 10";
    funTimer.classList.remove("low", "medium", "high");
    funTimer.classList.add("high"); // High fun is good (green)
  }
  if (sleepTimer) {
    sleepTimer.textContent = "Sleep: 0";
    sleepTimer.classList.remove("low", "medium", "high");
    sleepTimer.classList.add("high"); // Low sleepiness is good (green)
  }

  // Create new pet instance (ready to hatch again)
  myPet = new Pet("Sonic");

  console.log(
    "Game reset complete - egg is visible again! Click START to hatch."
  );
}

function showSonic() {
  const colorfulGlitchDiv = document.getElementById("colorfulGlitchDiv");
  const sonicImage = document.getElementById("sonicImage");
  const sonicContainer = document.querySelector(".sonic-container");

  if (colorfulGlitchDiv && sonicImage && sonicContainer && myPet) {
    console.log("🥚 Hatching sequence starting...");

    // Start the hatching animation
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

        // NOW start the pet's lifecycle
        console.log("Sonic hatched! Starting pet lifecycle...");
        gameStarted = true; // Enable action buttons
        updateButtonStates(); // Update visual state of buttons
        myPet.hatching();
        myPet.startStatDecay();
        updateTimers(); // Initialize timers

        // Apply initial blue color after image is fully ready
        setTimeout(() => {
          console.log("🔵 Applying initial blue color...");
          updatePetVisual("blue");
        }, 300);

        console.log("Sonic fully hatched and ready!");
        console.log("Current stats:", myPet);
      }, 2000);
    }, 1500);
  } else if (!myPet) {
    console.log(
      "No pet created yet! Click the overlay START GAME button first."
    );
  }
}

// ────────────── EVENT LISTENERS ──────────────
document.addEventListener("DOMContentLoaded", () => {
  setupDropdownMenu();
  setupFeedAndDance();
  setupOverlayAndReset();
  setup3DTextHover();
  setupBackgroundMusic(); // Initialize background music
  updateButtonStates(); // Initialize buttons as disabled
  //startGame(); // Call to begin game logic
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
  const sleepButton = buttons[2];
  const petChat = document.querySelector(".infoBox_petChat");
  const sonicImage = document.getElementById("sonicImage");

  if (feedButton && sonicImage) {
    feedButton.addEventListener("click", () => {
      if (!myPet || !gameStarted) {
        console.log("Game not started yet! Click START to begin.");
        return;
      }

      myPet.hunger = Math.max(0, myPet.hunger - 2); // decrease hunger

      // Set action message flag and display feeding message
      myPet.showingActionMessage = true;
      if (!myPet.showingEvolutionMessage) {
        petChat.textContent = "🍽️ Yum! THANKS! I'm not a fan of being HANGRY!";
      }

      console.log("Hunger level:", myPet.hunger);

      // Mark button as pressed and check for evolution
      markButtonPressed("feed");
      checkButtonEvolution();

      updateTimers(); // Update timers immediately

      if (sonicImage.style.display !== "none") {
        sonicImage.src = "resources/sonic-eats-5.gif";
        setTimeout(() => {
          sonicImage.src = "resources/sonic.gif";
          myPet.showingActionMessage = false; // Clear action message flag
          render(); // Update status after animation
        }, 8000); // Increased to 8 seconds to let eating animation complete fully
      }
    });
  }

  if (danceButton && sonicImage) {
    danceButton.addEventListener("click", () => {
      if (!myPet || !gameStarted) {
        console.log("Game not started yet! Click START to begin.");
        return;
      }

      myPet.fun = Math.min(10, myPet.fun + 2); // increase fun

      // Set action message flag and display dancing message
      myPet.showingActionMessage = true;
      if (!myPet.showingEvolutionMessage) {
        petChat.textContent =
          "Aww, yeah! Let's get BUSY! Watch me bust these interglactic MOVES!";
      }

      console.log("Fun level:", myPet.fun);

      // Mark button as pressed and check for evolution
      markButtonPressed("dance");
      checkButtonEvolution();

      updateTimers(); // Update timers immediately

      if (sonicImage.style.display !== "none") {
        sonicImage.src = "resources/sonic-dance2.gif";
        setTimeout(() => {
          sonicImage.src = "resources/sonic.gif";
          myPet.showingActionMessage = false; // Clear action message flag
          render(); // Update status after animation
        }, 26000); // Doubled to 26 seconds to let dance animation run twice completely
      }
    });
  }

  if (sleepButton && sonicImage) {
    sleepButton.addEventListener("click", () => {
      if (!myPet || !gameStarted) {
        console.log("Game not started yet! Click START to begin.");
        return;
      }

      myPet.sleepiness = Math.max(0, myPet.sleepiness - 2); // decrease sleepiness

      // Set action message flag and display sleeping message
      myPet.showingActionMessage = true;
      if (!myPet.showingEvolutionMessage) {
        petChat.textContent = "😴 Zzzz... That nap helped!";
      }

      console.log("Sleepiness level:", myPet.sleepiness);

      // Mark button as pressed and check for evolution
      markButtonPressed("sleep");
      checkButtonEvolution();

      // Display sleeping animation
      if (sonicImage.style.display !== "none") {
        sonicImage.src = "resources/sonic-sleeps.gif";

        // Return to normal after sleeping animation completes fully
        setTimeout(() => {
          sonicImage.src = "resources/sonic.gif";
          myPet.showingActionMessage = false; // Clear action message flag
          render(); // Update status after animation
        }, 6000); // Increased to 6 seconds to let sleeping animation complete fully
      }

      updateTimers(); // Update timers immediately
      render(); // Update status immediately
    });
  }
}

// Overlay Start, Reset, and Sonic Reveal
function setupOverlayAndReset() {
  const overlay = document.getElementById("pageOverlay");
  const overlayStartBtn = document.getElementById("overlayStartButton");
  const regularStartBtn = document.querySelector(
    ".startButtonContainer .StartButton"
  );
  const resetBtn = document.querySelector(".ResetButton");

  // ✅ Overlay START button: hides overlay and creates pet
  overlayStartBtn?.addEventListener("click", () => {
    console.log("Overlay start button clicked");
    overlay.classList.add("hidden");

    // Wait for the transition to complete before hiding
    setTimeout(() => {
      overlay.style.display = "none";
      console.log("Overlay hidden, creating pet...");
      startGame(); // This just creates the pet, doesn't start hatching
    }, 600); // Wait a bit longer than the 500ms transition
  });

  // START button (main game button): starts the game and hatches pet
  regularStartBtn?.addEventListener("click", () => {
    console.log("Regular start button clicked - starting game!");

    // Only start if we haven't already started
    if (!myPet) {
      startGame();
    }

    // Show the hatching sequence
    showSonic();
  });

  // RESET button
  resetBtn?.addEventListener("click", () => {
    console.log("Reset clicked");
    resetGame();
  });
}

// Text hover tilt effect for intro screen
function setup3DTextHover() {
  const overlayTexts = document.querySelectorAll(
    ".overlay-content h2, .overlay-content p"
  );

  overlayTexts.forEach((el) => {
    el.addEventListener("mouseenter", () => el.classList.add("text-hover"));

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const rotateX =
        ((e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * -8;
      const rotateY =
        ((e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 8;
      const scale = el.tagName === "H2" ? 1.15 : 1.1;
      const translateZ = el.tagName === "H2" ? 15 : 10;

      el.style.transform = `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform =
        "scale(1) rotateX(0deg) rotateY(0deg) translateZ(0px)";
      el.classList.remove("text-hover");
    });
  });
}

// Update timer displays with current pet stats
function updateTimers() {
  if (!myPet) return;

  const hungerTimer = document.getElementById("hungerTimer");
  const funTimer = document.getElementById("funTimer");
  const sleepTimer = document.getElementById("sleepTimer");

  if (hungerTimer) {
    hungerTimer.textContent = `Hunger: ${myPet.hunger}`;
    // Color code based on hunger level (high hunger is bad)
    hungerTimer.classList.remove("low", "medium", "high");
    if (myPet.hunger >= 8) {
      hungerTimer.classList.add("low"); // Red for high hunger (bad)
    } else if (myPet.hunger >= 5) {
      hungerTimer.classList.add("medium"); // Yellow for medium hunger
    } else {
      hungerTimer.classList.add("high"); // Green for low hunger (good)
    }
  }

  if (funTimer) {
    funTimer.textContent = `Fun: ${myPet.fun}`;
    // Color code based on fun level (low fun is bad)
    funTimer.classList.remove("low", "medium", "high");
    if (myPet.fun <= 2) {
      funTimer.classList.add("low"); // Red for low fun (bad)
    } else if (myPet.fun <= 5) {
      funTimer.classList.add("medium"); // Yellow for medium fun
    } else {
      funTimer.classList.add("high"); // Green for high fun (good)
    }
  }

  if (sleepTimer) {
    sleepTimer.textContent = `Sleep: ${myPet.sleepiness}`;
    // Color code based on sleepiness level (high sleepiness is bad)
    sleepTimer.classList.remove("low", "medium", "high");
    if (myPet.sleepiness >= 8) {
      sleepTimer.classList.add("low"); // Red for high sleepiness (bad)
    } else if (myPet.sleepiness >= 5) {
      sleepTimer.classList.add("medium"); // Yellow for medium sleepiness
    } else {
      sleepTimer.classList.add("high"); // Green for low sleepiness (good)
    }
  }

  // Update evolution indicators too
  updateEvolutionIndicators();
}

function render() {
  const petChat = document.querySelector(".infoBox_petChat");

  if (!myPet || !petChat) return;

  // Update timer displays
  updateTimers();

  // Only update chat if not showing evolution message or action message
  if (!myPet.showingEvolutionMessage && !myPet.showingActionMessage) {
    if (myPet.hunger >= 8) {
      petChat.textContent = "😩 I'm starving!";
    } else if (myPet.sleepiness >= 8) {
      petChat.textContent = "🥱 So sleepy...";
    } else if (myPet.fun <= 2) {
      petChat.textContent = "😐 I'm bored...";
    } else {
      petChat.textContent = "😺 HEY! I'm so stoked to see you!";
    }
  }
}

function updatePetVisual(stage) {
  console.log(`🎨 Evolution: ${stage} form`);

  // Wait a moment to ensure the image is fully loaded and visible
  setTimeout(() => {
    const sonicImage = document.getElementById("sonicImage");

    if (!sonicImage) {
      console.log("❌ No sonicImage found!");
      return;
    }

    // Ensure the image is visible
    if (sonicImage.style.display === "none") {
      sonicImage.style.display = "block";
    }

    // Remove all previous evolution hue classes
    sonicImage.classList.remove(
      "blue-form",
      "yellow-form",
      "green-form",
      "red-form",
      "white-form"
    );

    // Add the current stage class for hue effect
    switch (stage) {
      case "blue":
        sonicImage.classList.add("blue-form");
        break;
      case "yellow":
        sonicImage.classList.add("yellow-form");
        break;
      case "green":
        sonicImage.classList.add("green-form");
        break;
      case "red":
        sonicImage.classList.add("red-form");
        break;
      case "white":
        sonicImage.classList.add("white-form");
        break;
    }

    // Force a repaint to ensure the style is applied
    sonicImage.offsetHeight; // Trigger reflow
  }, 100);
}

// Background music setup and controls
function setupBackgroundMusic() {
  backgroundMusic = document.getElementById("backgroundMusic");

  if (backgroundMusic) {
    // Set volume to a comfortable level
    backgroundMusic.volume = 0.3;

    // Try to play music when page loads
    // Note: Most browsers require user interaction before playing audio
    const playPromise = backgroundMusic.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("🎵 Background music started playing");
        })
        .catch((error) => {
          console.log("🎵 Autoplay prevented by browser:", error);
          console.log("🎵 Music will start when user interacts with the page");

          // Add event listener to start music on first user interaction
          const startMusicOnInteraction = () => {
            backgroundMusic
              .play()
              .then(() => {
                console.log(
                  "🎵 Background music started after user interaction"
                );
              })
              .catch((err) => {
                console.log("🎵 Failed to start music:", err);
              });

            // Remove the event listener after first use
            document.removeEventListener("click", startMusicOnInteraction);
            document.removeEventListener("keydown", startMusicOnInteraction);
          };

          // Listen for any user interaction
          document.addEventListener("click", startMusicOnInteraction, {
            once: true,
          });
          document.addEventListener("keydown", startMusicOnInteraction, {
            once: true,
          });
        });
    }
  } else {
    console.log("🎵 Background music element not found");
  }
}
