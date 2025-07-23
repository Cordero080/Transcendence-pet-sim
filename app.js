console.log("⚡️⚡️⚡️⚡️ ¡ ENGAGED ! ⚡️⚡️⚡️⚡️");

// ⚠️ BALANCED EVOLUTION AND SURVIVAL SYSTEM ⚠️
// - Game over triggers when: hunger ≥ 10, fun ≤ 0, sleep ≥ 10
// - Evolution: Press all 3 buttons → wait 5 seconds → evolve
// - Stat decay: Base 7s, Fast 2s (gives time for evolution)
// - Balance: Manage stats while working toward evolution!

// *-------------------------METHODS ----------------*  \\
//   - Inside petClss (what pet can do)
//   - Only availabe after you do myPet= new Pet("name")

// +-------------------------+
// |       Pet Class         |   ← 🐾 Controls PET behavior and state
// +-------------------------+
// | - name                 |
// | - age                  |   ← Tracks stats
// | - hunger               |
// | - fun                  |
// | - sleep           |
// | - evolutionStage       |
// +-------------------------+
// | 🧠 Methods:              |
// |  • feed()              | ← Pet eats
// |  • dance()             | ← Pet has fun
// |  • sleep()             | ← Pet rests
// |  • render()            | ← Updates UI
// |  • createStatTimer()   | ← Starts stat decay
// |  • stopAllTimers()     | ← Stops stat decay
// |  • triggerGameOver()   | ← Ends the game
// |  • evolveToNextStage() | ← Evolves pet
// +-------------------------+
// *---------------------FUNCTIONS-----------------------* \\
//  Run indipendentally from Pet Class(outside petClass). Affect game logic or interface globally------- *
// +------------------------------+
// |     Global Functions         |   ← 🎮 Controls GAME
// +------------------------------+
// |  • startGame()              | ← Sets up new pet and timers
// |  • resetGame()              | ← Clears everything and restarts
// |  • updatePetVisual(stage)   | ← Changes how pet looks
// |  • updateTimers()           | ← Updates hunger/fun/sleep on screen
// |  • Event Listeners          | ← Detects clicks (feed, dance, sleep)
// |  • setInterval (age ticker) | ← Tracks cosmetic age
// +------------------------------+

/*-------------- Constants -------------*/

const gameSettings = {
  ageInterval: 15000,
  baseDecayRate: 7000,
  fastDecayRate: 3000,
};
const stageMap = {
  0: {
    stage: "blue",
    message: " I've evolved into Blue Form! So, this is life!",
  },
  1: {
    stage: "yellow",
    message: " Yellow form! The wise grow joy under their feet!",
  },
  2: { stage: "green", message: "Green form! Growing stronger!" },
  3: {
    stage: "red",
    message: " 🔥 Red form! FURY and POWER surge through me!",
  },
  4: {
    stage: "white",
    message: "⚪ I have transcended to White Form! Ready for the beyond...",
  },
};
const stageEmojis = {
  blue: "🔵",
  yellow: "🟡",
  green: "🟢",
  red: "🔴",
  white: "⚪",
};
const timerMap = {
  feed: "hunger",
  dance: "fun",
  sleep: "sleep",
};
const STAT_TYPES = ["hunger", "fun", "sleep"];

/*---------- Variables (state) ---------*/
let myPet;
let gameStarted = false;
let currentAnimationTimer = null;
let backgroundMusic;

// Evolution System Variables
let buttonTracker = {
  feed: false,
  dance: false,
  sleep: false,
};
let evolutionTimeout = null;

// Timer System Variables
let statTimers = {
  hunger: null,
  fun: null,
  sleep: null,
};
let slowedTimers = {
  hunger: false,
  fun: false,
  sleep: false,
};
let currentFastStat = null;

/*----- Cached Element References  -----*/
const gameOverOverlay = document.getElementById("gameOverOverlay");
const reasonElement = document.getElementById("gameOverReason");
const sonicImage = document.getElementById("sonicImage");
const petChat = document.querySelector(".infoBox_petChat");
const hungerTimer = document.getElementById("hungerTimer");
const funTimer = document.getElementById("funTimer");
const sleepTimer = document.getElementById("sleepTimer");
const overlayTexts = document.querySelectorAll(
  ".overlay-content h2, .overlay-content p"
);
const overlay = document.getElementById("pageOverlay");
const overlayStartBtn = document.getElementById("overlayStartButton");
const regularStartBtn = document.querySelector(
  ".startButtonContainer .StartButton"
);
const resetBtn = document.querySelector(".ResetButton");
const buttons = document.querySelectorAll(".Buttons");
const feedButton = buttons[0];
const danceButton = buttons[1];
const sleepButton = buttons[2];
const btn = document.getElementById("infoDropdownBtn");
const menu = document.getElementById("infoDropdownMenu");
const container = document.querySelector(".dropdown-container");
const colorfulGlitchDiv = document.getElementById("colorfulGlitchDiv");
const sonicContainer = document.querySelector(".sonic-container");
const feedIndicator = document.querySelector("#hungerTimer");
const danceIndicator = document.querySelector("#funTimer");
const sleepIndicator = document.querySelector("#sleepTimer");

// ────────────── PET CLASS ──────────────
class Pet {
  constructor(petName = "Coco") {
    this.name = petName;
    this.age = 0;
    this.hunger = 0;
    this.sleep = 0;
    this.fun = 10;
    this.stage = "egg";
    this.ageInterval = null;
    this.showingEvolutionMessage = false;
    this.evolutionLevel = 0;
    this.showingActionMessage = false;
  }

  petAges() {
    console.log(`Pet aging...`);
    this.age++;
    console.log(`🎂 Happy BDAY! Your pet is now ${this.age} years old!`);
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

      if (
        petChat &&
        !this.showingEvolutionMessage &&
        !this.showingActionMessage
      ) {
        const stageEmoji = stageEmojis[this.stage] || "🔵";
        const stageText =
          this.stage.charAt(0).toUpperCase() + this.stage.slice(1);
        petChat.textContent = `Age: ${this.age} | ${stageEmoji} ${stageText} Form | ...\"Feed ME'`;
      }
    }, gameSettings.ageInterval);
  }
  startStatDecay() {
    console.log("🎯 Starting dynamic stat decay system");

    // Choose a random stat to decay faster
    this.chooseFastDecayStat();

    // Start individual timers for each stat
    this.startHungerTimer();
    this.startFunTimer();
    this.startsleepTimer();
  }
  //  Chooses a random stat to decay faster using Math.random()
  chooseFastDecayStat() {
    currentFastStat = STAT_TYPES[Math.floor(Math.random() * STAT_TYPES.length)];
    console.log(
      `⚡ ${currentFastStat.toUpperCase()} timer is now decaying 2x faster!`
    );

    // Update UI to show which timer is fast
    this.updateTimerIndicators();
  }

  startHungerTimer() {
    const rate =
      currentFastStat === "hunger"
        ? gameSettings.fastDecayRate
        : gameSettings.baseDecayRate;

    statTimers.hunger = this.createStatTimer("hunger", rate);
  }

  startFunTimer() {
    const rate =
      currentFastStat === "fun"
        ? gameSettings.fastDecayRate
        : gameSettings.baseDecayRate;

    statTimers.fun = this.createStatTimer("fun", rate);
  }

  startsleepTimer() {
    const rate =
      currentFastStat === "sleep"
        ? gameSettings.fastDecayRate
        : gameSettings.baseDecayRate;

    statTimers.sleep = this.createStatTimer("sleep", rate);
  }

  // Helper method to create a timer with specified rate
  createStatTimer(timerType, rate) {
    const timerActions = {
      hunger: () => {
        this.hunger = Math.min(10, this.hunger + 1);
        if (this.hunger >= 10) {
          console.log("💀 CRITICAL: Pet is starving!");
          this.triggerGameOver(
            "Your pet vanished into the void. You are not worthy!"
          );
          return;
        }
        this.updateTimerDisplay();
      },
      fun: () => {
        this.fun = Math.max(0, this.fun - 1);
        if (this.fun <= 0) {
          console.log("💀 CRITICAL: Pet is extremely bored!");
          this.triggerGameOver(
            "Your jaded pet vanished into oblivion. You are not worthy!"
          );
          return;
        }
        this.updateTimerDisplay();
      },
      sleep: () => {
        this.sleep = Math.min(10, this.sleep + 1);
        if (this.sleep >= 10) {
          console.log("💀 CRITICAL: Pet is exhausted!");
          this.triggerGameOver(
            "Your pets vitality was drained! Why are you like this? lmao"
          );
          return;
        }
        this.updateTimerDisplay();
      },
    };

    return setInterval(timerActions[timerType], rate);
  }

  // Slow down individual timer when button is clicked (50% slower = 2x the interval)
  slowDownIndividualTimer(timerType) {
    if (statTimers[timerType]) {
      clearInterval(statTimers[timerType]);

      // Get the current rate and make it 2x slower (50% slower)
      const currentRate =
        currentFastStat === timerType
          ? gameSettings.fastDecayRate
          : gameSettings.baseDecayRate;
      const slowedRate = currentRate * 2; // 2x slower (50% speed)

      console.log(
        `🐌 ${timerType} timer slowed down by 50% (${currentRate}ms → ${slowedRate}ms)`
      );

      // Mark this timer as slowed down
      slowedTimers[timerType] = true;

      // Restart the timer at the slower rate
      statTimers[timerType] = this.createStatTimer(timerType, slowedRate);
    }
  }

  // Restart all timers (called when all buttons have been pressed)
  restartAllTimers() {
    console.log("🔄 Restarting all timers with new random fast stat");
    this.stopStatTimers();

    // Reset slowed timer tracking
    slowedTimers.hunger = false;
    slowedTimers.fun = false;
    slowedTimers.sleep = false;

    this.chooseFastDecayStat();
    this.startHungerTimer();
    this.startFunTimer();
    this.startsleepTimer();
  }

  stopStatTimers() {
    Object.keys(statTimers).forEach((stat) => {
      if (statTimers[stat]) {
        clearInterval(statTimers[stat]);
        statTimers[stat] = null;
      }
    });
    console.log("⏹️ All stat timers stopped");
  }

  updateTimerDisplay() {
    updateTimers(); // Call the global timer update function
  }

  updateTimerIndicators() {
    // Add visual indicators for which timer is fast

    // Remove fast indicators from all
    [hungerTimer, funTimer, sleepTimer].forEach((timer) => {
      if (timer) {
        timer.classList.remove("fast-decay");
        // Remove existing fast indicators
        timer.textContent = timer.textContent.replace(" ⚡", "");
      }
    });

    // Add fast indicator to the current fast stat
    const fastTimer = document.getElementById(
      currentFastStat === "hunger"
        ? "hungerTimer"
        : currentFastStat === "fun"
        ? "funTimer"
        : "sleepTimer"
    );

    if (fastTimer) {
      fastTimer.classList.add("fast-decay");
    }
  }

  stopAlltimers() {
    if (this.ageInterval) {
      clearInterval(this.ageInterval);
      this.ageInterval = null;
    }

    // Stop stat decay timers
    this.stopStatTimers();
    console.log("All timers stopped");
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
    const currentEvolution = stageMap[this.evolutionLevel];

    if (!currentEvolution) {
      console.log("No evolution found for level:", this.evolutionLevel);
      return;
    }

    // Update stage and display evolution message
    this.stage = currentEvolution.stage;
    this.showingEvolutionMessage = true;

    if (petChat) {
      petChat.textContent = `✨ Evolving...`;

      // Show evolution message after a brief delay
      setTimeout(() => {
        if (petChat) {
          const emoji = stageEmojis[currentEvolution.stage] || "✨";
          petChat.textContent = `Level ${this.evolutionLevel + 1} | ${emoji} ${
            currentEvolution.stage.charAt(0).toUpperCase() +
            currentEvolution.stage.slice(1)
          } Form - ${currentEvolution.message}`;
        }

        // Clear the evolution message flag after displaying
        setTimeout(() => {
          this.showingEvolutionMessage = false;
        }, 5000);
      }, 1000);
    }

    // Apply visual changes
    updatePetVisual(currentEvolution.stage);

    console.log(
      `Evolution complete! New stage: ${currentEvolution.stage}, Level: ${this.evolutionLevel}`
    );

    // Special handling: If evolved to white stage, automatically start transcendence
    if (this.evolutionLevel === 4 && currentEvolution.stage === "white") {
      console.log("🌟 REACHED WHITE FORM - AUTO-TRANSCENDENCE IN 5 SECONDS!");

      // Stop all timers immediately upon reaching white form
      console.log("⏹️ Stopping all timers for white form transcendence...");
      this.stopAlltimers();

      // Start transcendence after a 5-second delay
      setTimeout(() => {
        if (petChat) {
          petChat.textContent =
            "⚪ I feel the pull of transcendence... it's time to ascend!";
        }

        // Start transcendence animation
        console.log("🚀 Auto-initiating transcendence from white form...");
        this.triggerTranscendence();
      }, 7000);
    }
  }

  triggerTranscendence() {
    console.log("🌟 TRANSCENDENCE INITIATED! 🌟");

    // Timers should already be stopped before calling this method
    // But ensure they're stopped just in case
    if (
      !this.ageInterval &&
      Object.values(statTimers).every((timer) => timer === null)
    ) {
      console.log("✅ Timers already stopped for transcendence");
    } else {
      console.log("⚠️ Stopping remaining timers...");
      this.stopAlltimers();
    }

    if (sonicImage && sonicContainer) {
      // Add transcendence animation class
      sonicImage.classList.add("transcending");
      sonicContainer.classList.add("transcending");

      // Create light trail effect
      this.createLightTrail();

      // After animation completes, show transcendence message
      setTimeout(() => {
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
      }, 6000);
    }
  }

  createLightTrail() {
    if (!sonicContainer) return;

    // Create multiple light trail particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div"); // this loop
      particle.className = "light-particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = i * 0.1 + "s"; //
      sonicContainer.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 5000); //
    }
  }

  // Game over functionality
  triggerGameOver(reason) {
    console.log("💀 GAME OVER:", reason);

    // Stop all timers
    this.stopAlltimers();

    // Clear any evolution timeout
    if (evolutionTimeout) {
      clearTimeout(evolutionTimeout);
      evolutionTimeout = null;
    }

    // Show game over overlay
    showGameOverOverlay(reason);
  }
} // End of Pet class

// ────────────── EVOLUTION & BUTTON TRACKING SYSTEM ──────────────
// this function tracks button presses for evolution. If all buttons are pressed, it triggers evolution
function markButtonPressed(buttonType) {
  if (buttonTracker.hasOwnProperty(buttonType) && myPet) {
    buttonTracker[buttonType] = true;

    console.log(
      `${buttonType} button pressed - tracking updated:`,
      buttonTracker
    );

    myPet.slowDownIndividualTimer(timerMap[buttonType]);

    updateEvolutionIndicators();

    // Check if evolution should be triggered FIRST
    checkButtonEvolution();

    // Then handle timer restart if all buttons have been pressed
    if (buttonTracker.feed && buttonTracker.dance && buttonTracker.sleep) {
      console.log(
        "🔄 All buttons pressed! Restarting all timers with new fast stat..."
      );
      // Restart all timers with new random fast stat
      myPet.restartAllTimers();
    }
  }
}

function checkButtonEvolution() {
  console.log("🔍 Checking button evolution. Current state:", buttonTracker);

  // Check if all three buttons have been pressed
  if (buttonTracker.feed && buttonTracker.dance && buttonTracker.sleep) {
    console.log(
      "🌟 All buttons pressed! Evolution will trigger in 5 seconds..."
    );

    // Clear any existing evolution timeout
    if (evolutionTimeout) {
      console.log("⚠️ Clearing existing evolution timeout");
      clearTimeout(evolutionTimeout);
    }

    // Set evolution to occur 5 seconds after the last button press
    evolutionTimeout = setTimeout(() => {
      console.log("🌟 5 seconds elapsed - triggering evolution!");

      // Normal evolution for all stages (white form will auto-transcend from evolveToNextStage)
      console.log(
        `🌟 Normal evolution - current level: ${myPet?.evolutionLevel}`
      );
      if (myPet) {
        myPet.evolveToNextStage();
      }

      // Reset button tracker for next evolution cycle
      resetButtonTracker();
      evolutionTimeout = null;
    }, 5000); // 5 seconds delay. this contr

    console.log("⏰ Evolution timeout set for 5 seconds");
  } else {
    console.log("❌ Not all buttons pressed yet:", buttonTracker);
  }
}

function resetButtonTracker() {
  buttonTracker = {
    feed: false,
    dance: false,
    sleep: false,
  };

  // Clear any pending evolution timeout
  if (evolutionTimeout) {
    clearTimeout(evolutionTimeout);
    evolutionTimeout = null;
  }

  updateEvolutionIndicators();
  console.log("Button tracker reset for next evolution cycle");
}

function updateEvolutionIndicators() {
  // Update visual indicators under each button

  // Add indicators to show which buttons have been pressed
  if (feedIndicator) {
    const indicator = buttonTracker.feed ? " ✓" : " ⭕";
    if (
      !feedIndicator.textContent.includes("✓") &&
      !feedIndicator.textContent.includes("⭕")
    ) {
      feedIndicator.textContent += indicator;
    } else {
      feedIndicator.textContent = feedIndicator.textContent.replace(
        / [✓⭕]/,
        indicator
      );
    }
  }

  if (danceIndicator) {
    const indicator = buttonTracker.dance ? " ✓" : " ⭕";
    if (
      !danceIndicator.textContent.includes("✓") &&
      !danceIndicator.textContent.includes("⭕")
    ) {
      danceIndicator.textContent += indicator;
    } else {
      danceIndicator.textContent = danceIndicator.textContent.replace(
        / [✓⭕]/,
        indicator
      );
    }
  }

  if (sleepIndicator) {
    const indicator = buttonTracker.sleep ? " ✓" : " ⭕";
    if (
      !sleepIndicator.textContent.includes("✓") &&
      !sleepIndicator.textContent.includes("⭕")
    ) {
      sleepIndicator.textContent += indicator;
    } else {
      sleepIndicator.textContent = sleepIndicator.textContent.replace(
        / [✓⭕]/,
        indicator
      );
    }
  }
}

// ────────────── UI & BUTTON STATE MANAGEMENT ──────────────
function updateButtonStates() {
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

// ────────────── CORE GAME LOGIC ──────────────
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

  // Hide game over overlay if it's shown
  hideGameOverOverlay();

  // Reset game state
  gameStarted = false; // Disable action buttons
  updateButtonStates(); // Update visual state of buttons

  // Stop any existing pet timers
  if (myPet) {
    myPet.stopAlltimers();
  }

  // Clear any active animation timers
  if (currentAnimationTimer) {
    clearTimeout(currentAnimationTimer);
    currentAnimationTimer = null;
  }

  // Reset button tracking
  resetButtonTracker();

  // Reset timer system
  currentFastStat = null;
  slowedTimers.hunger = false;
  slowedTimers.fun = false;
  slowedTimers.sleep = false;
  Object.keys(statTimers).forEach((stat) => {
    if (statTimers[stat]) {
      clearInterval(statTimers[stat]);
      statTimers[stat] = null;
    }
  });

  // Hide sonic and show egg again

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

  if (sonicContainer) {
    sonicContainer.classList.remove("transcending");
  }

  // Reset all timer displays

  if (petChat) {
    petChat.textContent = "...Feed ME";
  }

  if (hungerTimer) {
    hungerTimer.textContent = "Hunger: 0";
    hungerTimer.classList.remove("low", "medium", "high", "fast-decay");
    hungerTimer.classList.add("high"); // Low hunger is good (green)
  }
  if (funTimer) {
    funTimer.textContent = "Fun: 10";
    funTimer.classList.remove("low", "medium", "high", "fast-decay");
    funTimer.classList.add("high"); // High fun is good (green)
  }
  if (sleepTimer) {
    sleepTimer.textContent = "Sleep: 0";
    sleepTimer.classList.remove("low", "medium", "high", "fast-decay");
    sleepTimer.classList.add("high"); // Low sleep is good (green)
  }

  // Create new pet instance (ready to hatch again)
  myPet = new Pet("Sonic");

  console.log(
    "Game reset complete - egg is visible again! Click START to hatch."
  );
}

function showSonic() {
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
});

// ────────────── ANIMATION HELPER ──────────────
function playAnimation(animationSrc, duration, messageText) {
  if (!sonicImage || sonicImage.style.display === "none") return;

  // Clear any existing animation timer to allow interruption
  if (currentAnimationTimer) {
    clearTimeout(currentAnimationTimer);
    currentAnimationTimer = null;
  }

  // Set action message flag and display message
  if (myPet) {
    myPet.showingActionMessage = true;
    if (!myPet.showingEvolutionMessage && petChat) {
      petChat.textContent = messageText;
    }
  }

  // Start the animation
  sonicImage.src = animationSrc;

  // Set timer to return to normal state after animation completes
  currentAnimationTimer = setTimeout(() => {
    sonicImage.src = "resources/sonic.gif";
    if (myPet) {
      myPet.showingActionMessage = false; // Clear action message flag
    }
    render(); // Update status after animation
    currentAnimationTimer = null; // Clear the timer reference
  }, duration);
}

// Dropdown menu toggle
function setupDropdownMenu() {
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
  if (feedButton && sonicImage) {
    feedButton.addEventListener("click", () => {
      if (!myPet || !gameStarted) {
        console.log("Game not started yet! Click START to begin.");
        return;
      }

      myPet.hunger = Math.max(0, myPet.hunger - 2); // decrease hunger

      console.log("Hunger level:", myPet.hunger);

      // Mark button as pressed (this will automatically check for evolution)
      markButtonPressed("feed");

      updateTimers(); // Update timers immediately

      // Play feeding animation with proper interruption handling
      playAnimation(
        "resources/sonic-eats-5.gif",
        3500, // this
        "🍽️ Yum! THANKS! I'm not a fan of being HANGRY!"
      );
    });
  }

  if (danceButton && sonicImage) {
    danceButton.addEventListener("click", () => {
      if (!myPet || !gameStarted) {
        console.log("Game not started yet! Click START to begin.");
        return;
      }

      myPet.fun = Math.min(10, myPet.fun + 2);
      console.log("Fun level:", myPet.fun);

      // Mark button as pressed (this will automatically check for evolution)
      markButtonPressed("dance");

      updateTimers(); // Update timers immediately

      // Play dancing animation with proper interruption handling
      playAnimation(
        "resources/sonic-dance2.gif",
        10000,
        "Aww, yeah! Let's get BUSY! Watch me bust these interglactic MOVES!"
      );
    });
  }

  if (sleepButton && sonicImage) {
    sleepButton.addEventListener("click", () => {
      if (!myPet || !gameStarted) {
        console.log("Game not started yet! Click START to begin.");
        return;
      }

      myPet.sleep = Math.max(0, myPet.sleep - 2); // decrease sleep

      console.log("sleep level:", myPet.sleep);

      // Mark button as pressed (this will automatically check for evolution)
      markButtonPressed("sleep");

      // Play sleeping animation with proper interruption handling
      playAnimation(
        "resources/sonic-sleeps.gif",
        6000,
        " Zzzz... That nap helped!"
      );

      updateTimers(); // Update timers immediately
      render(); // Update status immediately
    });
  }
}

// Overlay Start, Reset, and Sonic Reveal
function setupOverlayAndReset() {
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

// ────────────── DISPLAY & RENDER FUNCTIONS ──────────────

// Update timer displays with current pet stats
function updateTimers() {
  if (!myPet) return;

  const statConfigs = [
    {
      name: "hunger",
      value: myPet.hunger,
      timerEl: hungerTimer,
      highIsBad: true,
    },
    {
      name: "fun",
      value: myPet.fun,
      timerEl: funTimer,
      highIsBad: false,
    },
    {
      name: "sleep",
      value: myPet.sleep,
      timerEl: sleepTimer,
      highIsBad: true,
    },
  ];
  // Loop through each stat config to update the display. if the timer element is not found, it skips that stat
  statConfigs.forEach(({ name, value, timerEl, highIsBad }) => {
    if (!timerEl) return;

    // Update base text
    timerEl.textContent = `${capitalize(name)}: ${value}`;

    // Show fast decay indicator
    if (currentFastStat === name) {
      timerEl.textContent += " ⚡️";
      timerEl.classList.add("fast-decay");
    } else {
      timerEl.classList.remove("fast-decay");
    }

    // Color coding. this removes all previous classes before adding new ones
    timerEl.classList.remove("low", "medium", "high");

    if (highIsBad) {
      if (value >= 8) {
        timerEl.classList.add("low"); // red
      } else if (value >= 5) {
        timerEl.classList.add("medium"); // yellow
      } else {
        timerEl.classList.add("high"); // green
      }
    } else {
      if (value <= 2) {
        timerEl.classList.add("low"); // red
      } else if (value <= 5) {
        timerEl.classList.add("medium"); // yellow
      } else {
        timerEl.classList.add("high"); // green
      }
    }
  });

  updateEvolutionIndicators();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function render() {
  if (!myPet || !petChat) return;

  // Update timer displays
  updateTimers();

  // Only update chat if not showing evolution message or action message
  if (!myPet.showingEvolutionMessage && !myPet.showingActionMessage) {
    if (myPet.hunger >= 8) {
      petChat.textContent = "😩 I'm starving!";
    } else if (myPet.sleep >= 8) {
      petChat.textContent = "🥱 I'm shot...";
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
  }, 100); // thi
}

// ────────────── UTILITY & HELPER FUNCTIONS ──────────────

// Background music setup and controls
function setupBackgroundMusic() {
  backgroundMusic = document.getElementById("backgroundMusic");

  if (backgroundMusic) {
    // Set volume to a comfortable level
    backgroundMusic.volume = 0.6;

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

// ────────────── GAME OVER SYSTEM ──────────────

function showGameOverOverlay(reason) {
  if (gameOverOverlay && reasonElement) {
    reasonElement.textContent = reason;
    gameOverOverlay.style.display = "flex";

    // Add pulse animation
    gameOverOverlay.classList.add("pulse");

    console.log("💀 Game Over overlay displayed");
  }
}

function hideGameOverOverlay() {
  if (gameOverOverlay) {
    gameOverOverlay.style.display = "none";
    gameOverOverlay.classList.remove("pulse");
  }
}

function restartGame() {
  console.log("🔄 Restarting game from game over...");

  // Hide game over overlay
  hideGameOverOverlay();

  // Reset the game completely
  resetGame();

  // Start a new game
  startGame();
}
/*----------- Event Listeners ----------*/

// Setup helper functions first
// <-- must come first
setup3DTextHover();
setupBackgroundMusic();

// Required explicit listeners for assignment grading:
regularStartBtn?.addEventListener("click", startGame);
resetBtn?.addEventListener("click", resetGame);

// ==================================
// 📌 METHOD vs FUNCTION REFERENCE #2
// ==================================

// 🧠 METHODS (Inside the Pet class)
// These are tied to the pet object. Call with myPet.methodName()

// constructor(name)        --> Initializes pet’s name, age, stats, evolution stage
// feed()                   --> Lowers hunger, boosts fun, updates UI
// dance()                  --> Boosts fun, increases sleep, updates UI
// sleep()                  --> Lowers sleep, increases hunger, updates UI
// render()                 --> Updates stats on screen
// createStatTimer()        --> Starts a stat decay timer using setInterval
// stopAllTimers()          --> Stops hunger/fun/sleep decay
// triggerGameOver(reason)  --> Ends the game and displays failure reason
// evolve()                 --> Increments age and calls update visuals
// evolveToNextStage()      --> Evolves pet to next form and updates message/image

// 🌐 FUNCTIONS (Outside the class)
// These handle game flow and UI sync

// updateTimers()           --> Syncs DOM to current pet stats
// updatePetVisual(stage)   --> Updates pet appearance based on current stage
// startGame()              --> Creates new pet and initializes game
// resetGame()              --> Clears current game state and restarts
// setInterval(() => myPet.evolve(), 15000)
//                          --> Cosmetic age timer (15 sec) for display only
