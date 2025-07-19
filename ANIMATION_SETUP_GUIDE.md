# 🎮 Animation Setup Guide - Transcendence Pet Simulator

This guide covers how to add, modify, and manage animations in the Transcendence Pet Simulator game.

## 📋 Table of Contents

1. [Animation System Overview](#animation-system-overview)
2. [Adding New Pet Animations](#adding-new-pet-animations)
3. [Button Action Animations](#button-action-animations)
4. [Evolution & Transcendence Effects](#evolution--transcendence-effects)
5. [Background & UI Animations](#background--ui-animations)
6. [CSS Animation Classes](#css-animation-classes)
7. [Troubleshooting](#troubleshooting)

---

## 🎭 Animation System Overview

The game uses a combination of:

- **GIF animations** for pet actions (feeding, dancing, sleeping)
- **CSS keyframe animations** for UI effects and transitions
- **JavaScript timing controls** for animation sequencing
- **Class-based state management** for visual effects

### Core Animation Components

1. **playAnimation() function** - Handles pet action animations
2. **CSS classes** - Define visual effects and transitions
3. **Timer management** - Controls animation duration and sequencing
4. **State flags** - Prevent animation conflicts

---

## 🐾 Adding New Pet Animations

### Step 1: Add the GIF File

```bash
# Place your GIF in the resources folder
/resources/sonic-newaction.gif
```

### Step 2: Create Button Handler

```javascript
// In setupFeedAndDance() function
const newActionButton = document.getElementById("newActionButton");

if (newActionButton && sonicImage) {
  newActionButton.addEventListener("click", () => {
    if (!myPet || !gameStarted) {
      console.log("Game not started yet! Click START to begin.");
      return;
    }

    // Update pet stats (example)
    myPet.happiness = Math.min(10, myPet.happiness + 3);

    // Mark button as pressed for evolution tracking
    markButtonPressed("newaction");

    updateTimers(); // Update timers immediately

    // Play animation with proper interruption handling
    playAnimation(
      "resources/sonic-newaction.gif",
      5000, // Duration in milliseconds
      "🎉 New action message here!"
    );
  });
}
```

### Step 3: Add Button Tracking (Optional)

```javascript
// In global buttonTracker object
let buttonTracker = {
  feed: false,
  dance: false,
  sleep: false,
  newaction: false, // Add new action
};

// Update evolution indicators function
function updateEvolutionIndicators() {
  // Add indicator for new button
  const newActionIndicator = document.querySelector("#newActionTimer");
  if (newActionIndicator) {
    const indicator = buttonTracker.newaction ? " ✅" : " ⭕";
    // ... indicator logic
  }
}
```

---

## 🎬 Button Action Animations

### Current Action Animations

| Action | GIF File           | Duration | Effect             |
| ------ | ------------------ | -------- | ------------------ |
| Feed   | `sonic-eats-5.gif` | 8000ms   | Reduces hunger     |
| Dance  | `sonic-dance2.gif` | 10000ms  | Increases fun      |
| Sleep  | `sonic-sleeps.gif` | 6000ms   | Reduces sleepiness |

### Dynamic Timer System

After each evolution, one random stat timer becomes **2x faster**, creating strategic pressure:

- **Base decay rate**: 1 point every 5 seconds
- **Fast decay rate**: 1 point every 2.5 seconds
- **Critical threshold**: Stats ≥ 8 trigger danger state
- **Strategy**: Players must identify and prioritize the fastest-decaying stat

#### Timer Speed Indicators

- 🐌 **Normal speed** - Green/Yellow indicators
- ⚡ **Fast speed** - Red indicators with warning icons

### Animation Flow

1. **Button Click** → Stat Update → Mark Button → Play Animation
2. **Animation Plays** → Message Displays → Timer Starts
3. **Animation Ends** → Return to `sonic.gif` → Clear Message → Update UI

### Adding Custom Animation Effects

For special effects during animations (like fade-out):

```javascript
// In playAnimation() function
function playAnimation(animationSrc, duration, messageText) {
  // ... existing code ...

  // Check for special animation types
  const isSpecialAnimation = animationSrc.includes("special-effect");

  if (isSpecialAnimation) {
    // Add special timing logic here
    const effectStartTime = duration - 2000; // Start effect 2 seconds before end

    setTimeout(() => {
      // Apply special effect
      sonicImage.classList.add("special-effect-class");

      setTimeout(() => {
        // Clean up effect
        sonicImage.classList.remove("special-effect-class");
        // ... restore normal state
      }, 2000);
    }, effectStartTime);
  }
}
```

---

## ⚡ Evolution & Transcendence Effects

### Evolution Stages

Each evolution stage has its own visual treatment:

```css
/* Evolution color filters */
.blue-form {
  filter: hue-rotate(240deg) brightness(1.1);
}
.yellow-form {
  filter: hue-rotate(60deg) brightness(1.2);
}
.green-form {
  filter: hue-rotate(120deg) brightness(1.1);
}
.red-form {
  filter: hue-rotate(0deg) brightness(1.3);
}
.white-form {
  filter: brightness(1.5) contrast(1.2);
}
```

### Pre-Evolution Effect

The glitch effect before evolution:

```css
.pre-evolution-glitch {
  animation: glitchEffect 1s ease-in-out;
}

@keyframes glitchEffect {
  0%,
  100% {
    transform: translate(0);
    filter: hue-rotate(0deg);
  }
  20% {
    transform: translate(-2px, 2px);
    filter: hue-rotate(90deg);
  }
  40% {
    transform: translate(-2px, -2px);
    filter: hue-rotate(180deg);
  }
  60% {
    transform: translate(2px, 2px);
    filter: hue-rotate(270deg);
  }
  80% {
    transform: translate(2px, -2px);
    filter: hue-rotate(360deg);
  }
}
```

### Transcendence Animation

The final transcendence effect includes:

1. **Rising motion** - Pet moves upward
2. **Glowing effect** - Bright pulsing light
3. **Light particles** - Scattered light trail particles
4. **Screen flash** - Brief white overlay

```css
.transcending {
  animation: transcendRise 4s ease-out forwards, transcendGlow 4s ease-in-out
      infinite;
}

@keyframes transcendRise {
  0% {
    transform: translateY(0) scale(1);
  }
  100% {
    transform: translateY(-100px) scale(1.2);
  }
}

@keyframes transcendGlow {
  0%,
  100% {
    filter: brightness(1) drop-shadow(0 0 10px #fff);
  }
  50% {
    filter: brightness(2) drop-shadow(0 0 30px #fff);
  }
}
```

---

## 🎨 Background & UI Animations

### Page Load Animation

```css
body {
  opacity: 0;
  animation: pageLoadFadeIn 1.5s ease-in forwards;
}

@keyframes pageLoadFadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Button Hover Effects

```css
.Buttons:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 255, 0, 0.3);
  transition: all 0.3s ease;
}
```

### Hatching Animation

```css
.hatching {
  animation: fastSpin 0.5s linear infinite, pulse 0.3s ease-in-out infinite
      alternate;
}

@keyframes fastSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
}
```

---

## 📝 CSS Animation Classes Reference

### State Classes

| Class           | Purpose               | Duration  |
| --------------- | --------------------- | --------- |
| `.hatching`     | Pet hatching effect   | 0.5s loop |
| `.born`         | Post-hatch state      | Permanent |
| `.transcending` | Final transcendence   | 4s        |
| `.disabled`     | Disabled button state | Instant   |

### Evolution Classes

| Class          | Effect              |
| -------------- | ------------------- |
| `.blue-form`   | Blue color filter   |
| `.yellow-form` | Yellow color filter |
| `.green-form`  | Green color filter  |
| `.red-form`    | Red color filter    |
| `.white-form`  | Bright white filter |

### Animation Classes

| Class                   | Purpose                 | Duration |
| ----------------------- | ----------------------- | -------- |
| `.text-hover`           | 3D text tilt effect     | 0.3s     |
| `.pre-evolution-glitch` | Pre-evolution glitch    | 1s       |
| `.light-particle`       | Transcendence particles | 5s       |

---

## 🛠️ Troubleshooting

### Common Issues

#### Animation Not Playing

```javascript
// Check if element exists
const sonicImage = document.getElementById("sonicImage");
if (!sonicImage) {
  console.log("❌ sonicImage element not found!");
  return;
}

// Check if image is visible
if (sonicImage.style.display === "none") {
  console.log("❌ sonicImage is hidden!");
  sonicImage.style.display = "block";
}
```

#### Animation Interruption Issues

```javascript
// Always clear existing timers
if (currentAnimationTimer) {
  clearTimeout(currentAnimationTimer);
  currentAnimationTimer = null;
  console.log("🔄 Cleared previous animation timer");
}
```

#### CSS Class Conflicts

```javascript
// Force remove conflicting classes
sonicImage.classList.remove("fade-out", "fade-in", "glitch");
sonicImage.offsetHeight; // Force reflow
sonicImage.classList.add("new-animation-class");
```

#### GIF Not Loading

```javascript
// Preload GIFs for smoother playback
function preloadAnimations() {
  const animations = [
    "resources/sonic-eats-5.gif",
    "resources/sonic-dance2.gif",
    "resources/sonic-sleeps.gif",
  ];

  animations.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}
```

### Performance Tips

1. **Optimize GIF files** - Keep file sizes under 1MB
2. **Use CSS transforms** instead of changing layout properties
3. **Batch DOM updates** to prevent layout thrashing
4. **Clean up animations** - Remove unused classes and timers
5. **Test on different devices** - Mobile performance varies

### Debug Mode

Add this to help debug animations:

```javascript
// Add to playAnimation function for debugging
console.log(`🎬 Playing animation: ${animationSrc}`);
console.log(`⏱️ Duration: ${duration}ms`);
console.log(`💬 Message: ${messageText}`);

// Log when animation completes
setTimeout(() => {
  console.log(`✅ Animation completed: ${animationSrc}`);
}, duration);
```

---

## 📚 Additional Resources

- [CSS Animation Performance](https://developers.google.com/web/fundamentals/design-and-ux/animations)
- [JavaScript Timer Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)
- [GIF Optimization Tools](https://ezgif.com/)

---

_Last updated: July 18, 2025_
