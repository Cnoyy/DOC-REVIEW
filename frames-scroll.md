# Cinematic Scroll-Driven Canvas Animation Sequence
### A Production-Grade Developer Guide for React & Next.js

This document outlines the architecture, mathematics, and implementation details of the scroll-driven, hardware-accelerated canvas frame player developed for this project. Use this guide to replicate this high-end interactive storytelling flow in other projects.

---

## 1. Core Architectural Concept

Instead of capturing mouse wheels/swipes to artificially scroll the screen (scroll-jacking), this pattern uses **native browser scrolling**. It creates a tall "scroll track" container, locks the visual canvas in the viewport using CSS `sticky` properties, and maps the browser's scroll position directly to a preloaded list of image frames.

### Why this is superior:
1. **Natural Physics:** Retains the browser's native scrolling acceleration, inertia, and elastic bounce (crucial for trackpads and mobile touch screens).
2. **No Layout Shift:** By keeping elements in the DOM flow, the scrollbar behaves naturally without disappearing or flashing.
3. **Bidirectional Control:** Scrubbing forwards and backwards works natively as you scroll up and down.

---

## 2. Layout Structure & The Sticky Concept

The markup requires two key layers:
1. **The Scroll Track (Parent):** A relative container with a height set to multiple viewports (e.g., `h-[350vh]`). This sets the "scrollable room."
2. **The Sticky Frame Viewer (Child):** A container inside the track styled with `sticky top-0 h-screen w-full overflow-hidden`. It sticks to the screen while the parent track is being scrolled through, and then scrolls away naturally once the track is exhausted.

```
+-------------------------------------------------------+
|  Scroll Track (Parent: h-[350vh])                     |
|                                                       |
|  +-------------------------------------------------+  |
|  |  Sticky Frame Viewer (Child: sticky h-screen)   |  | <-- Viewport (Sticks for first 250vh of scroll)
|  |                                                 |  |
|  |  [ Canvas Rendering Engine ]                    |  |
|  |  [ Titles & Description Overlays ]              |  |
|  +-------------------------------------------------+  |
|                                                       |
|  (Scroll continue past 250vh)                         |
+-------------------------------------------------------+
|  Revealed Content Sections (Scrolls up normally)      |
+-------------------------------------------------------+
```

---

## 3. Mathematical Syncing Model

The playback speed is controlled by the height of the Scroll Track.
- **Viewport Height ($VH$):** `window.innerHeight`
- **Track Height:** $3.5 \times VH$ (`h-[350vh]`)
- **Scroll Range (Threshold $T$):** The distance the sticky element stays pinned.
  $$T = \text{Track Height} - VH = 2.5 \times VH$$
- **Scroll Progress ($P$):** A normalized float from `0.0` (start of track) to `1.0` (end of track).
  $$P = \min\left(1, \max\left(0, \frac{\text{window.scrollY}}{T}\right)\right)$$
- **Active Frame Index ($I$):** Calculated by multiplying scroll progress by total frames (e.g., 240).
  $$I = \lfloor P \times (N_{\text{total}} - 1) \rfloor + 1$$

---

## 4. Hardware-Accelerated Canvas Rendering

Rendering static frames on an HTML `<canvas>` is significantly more performant than updating the `src` attribute of an `<img>` tag, as it avoids continuous DOM reflows.

### High-DPI (Retina) Scaling formula:
To prevent images from looking blurry on high-resolution screens:
```typescript
const dpr = window.devicePixelRatio || 1;
canvas.width = window.innerWidth * dpr;
canvas.height = window.innerHeight * dpr;
ctx.scale(dpr, dpr);
```

### Frame Aspect-Ratio Fit (`object-cover` emulation):
To make the canvas image scale and crop correctly like `background-size: cover`:
```typescript
const imgRatio = img.width / img.height;
const canvasRatio = width / height;
let drawWidth = width;
let drawHeight = height;
let x = 0;
let y = 0;

if (canvasRatio > imgRatio) {
  drawHeight = width / imgRatio;
  y = (height - drawHeight) / 2;
} else {
  drawWidth = height * imgRatio;
  x = (width - drawWidth) / 2;
}

ctx.drawImage(img, x, y, drawWidth, drawHeight);
```

---

## 5. Complete Code Reference (React/TypeScript)

Below is a clean, self-contained template for implementing this system:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";

const TOTAL_FRAMES = 240; // Total images in your sequence
const FRAME_PREFIX = "/images/ezgif-frame-"; // Prefix of image path

export default function ScrollCanvasPlayer() {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animationCompleteRef = useRef(false);

  // Sync ref to avoid stale closures in window event listeners
  useEffect(() => {
    animationCompleteRef.current = animationComplete;
  }, [animationComplete]);

  // 1. Asynchronous Image Preloader
  useEffect(() => {
    let active = true;
    
    // Preload all frames
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      // Format number to 3-digit padded (e.g., 001, 002... 240)
      const frameNum = String(i).padStart(3, "0");
      img.src = `${FRAME_PREFIX}${frameNum}.png`;
      img.onload = () => {
        if (!active) return;
        imagesRef.current[i] = img;
        setLoadedCount(prev => prev + 1);
        if (i === 1) renderFrame(1); // Render first frame immediately
      };
    }

    return () => { active = false; };
  }, []);

  // 2. Cover Aspect Fit Canvas Drawer
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = imagesRef.current[index];
    
    if (!ctx || !img) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    // Scale canvas buffer size for High-DPI screens
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    // Center Crop / Object Cover Fit
    const imgRatio = img.width / img.height;
    const canvasRatio = width / height;
    let drawWidth = width;
    let drawHeight = height;
    let x = 0;
    let y = 0;

    if (canvasRatio > imgRatio) {
      drawHeight = width / imgRatio;
      y = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgRatio;
      x = (width - drawWidth) / 2;
    }

    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  };

  // 3. React on frame index or preloader changes
  useEffect(() => {
    renderFrame(currentFrame);
  }, [currentFrame, loadedCount]);

  // 4. Handle Window Resize
  useEffect(() => {
    const handleResize = () => renderFrame(currentFrame);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentFrame]);

  // 5. Scroll Event Listener & Synced Scrubbing
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Calculate threshold (scroll track minus viewport height = 2.5 * window.innerHeight)
      const threshold = window.innerHeight * 2.5;

      if (!animationCompleteRef.current) {
        const progress = Math.min(1, Math.max(0, scrollY / threshold));
        setCurrentFrame(Math.floor(progress * (TOTAL_FRAMES - 1)) + 1);

        if (progress >= 0.99) {
          setAnimationComplete(true);
        }
      } else {
        // Scrolling back up: re-lock if scrollY enters back into the scrub threshold
        if (scrollY < threshold - 20) {
          setAnimationComplete(false);
          const progress = Math.min(1, Math.max(0, scrollY / threshold));
          setCurrentFrame(Math.floor(progress * (TOTAL_FRAMES - 1)) + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 6. Navigation Link Handler (Bypass Sequence)
  const navigateToSection = (targetId: string) => {
    setAnimationComplete(true);
    setCurrentFrame(TOTAL_FRAMES);

    // Jump scrollbar past the scrubbing range instantly
    window.scrollTo(0, window.innerHeight * 2.5);

    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      
      {/* 2.5x Viewport Scroll Track parent */}
      <section ref={trackRef} className="relative h-[350vh] bg-black">
        
        {/* Sticky Viewport Frame container */}
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full object-cover" />
          
          {/* Overlay Texts (Fades in relative to frame progress) */}
          <div className="absolute inset-0 flex flex-col justify-center items-start p-12 bg-gradient-to-t from-black/50 to-transparent">
            <h1 className="text-5xl font-black">
              Current Frame: {currentFrame}
            </h1>
            <p className="text-slate-400 mt-2">
              Scroll Progress: {Math.round((currentFrame / TOTAL_FRAMES) * 100)}%
            </p>
          </div>
        </div>
      </section>

      {/* Subsequent Content (Slides up seamlessly after frame 240 is reached) */}
      <div 
        className={`transition-all duration-700 ease-out ${
          animationComplete 
            ? "opacity-100 translate-y-0" 
            : "opacity-30 translate-y-8 pointer-events-none"
        }`}
      >
        <section id="features" className="min-h-screen bg-zinc-900 flex items-center justify-center">
          <h2 className="text-4xl font-bold">Awesome Features</h2>
        </section>
        <section id="details" className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <h2 className="text-4xl font-bold">Detailed Technical Specs</h2>
        </section>
      </div>
    </div>
  );
}
```
