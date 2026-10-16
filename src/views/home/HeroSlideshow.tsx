"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pause, PlayArrow } from "@mui/icons-material";
import { HERO_SLIDES } from "../../data/homepage";
import styles from "./HeroSlideshow.module.css";

const INTERVAL = 6000;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/**
 * The campaign photographs crossfade every six seconds, each linking to its category.
 * Rotation pauses on hover or focus and has a pause button (WCAG 2.2.2); it never starts
 * when the visitor prefers reduced motion.
 */
export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
  const running = !paused && !holding && !reducedMotion;

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(
      () => setCurrent((index) => (index + 1) % HERO_SLIDES.length),
      INTERVAL,
    );
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <div
      className={styles.slides}
      aria-roledescription="carousel"
      aria-label="Campaign"
      onMouseEnter={() => setHolding(true)}
      onMouseLeave={() => setHolding(false)}
      onFocus={() => setHolding(true)}
      onBlur={() => setHolding(false)}
    >
      {HERO_SLIDES.map((slide, index) => (
        <figure
          key={slide.image}
          className={`${styles.slide} ${index === current ? styles.on : ""}`}
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${HERO_SLIDES.length}`}
          aria-hidden={index !== current}
        >
          <Image
            src={`/images/campaign/${slide.image}.webp`}
            alt={slide.alt}
            fill
            sizes="(max-width: 1023px) 100vw, 67vw"
            quality={85}
            priority={index === 0}
            style={{ objectPosition: slide.focus }}
          />
          <figcaption className={styles.caption}>
            <span className="text-label text-muted">{slide.label}</span>
            <Link href={slide.cta.href} tabIndex={index === current ? 0 : -1}>
              {slide.cta.label} →
            </Link>
          </figcaption>
        </figure>
      ))}
      {!reducedMotion && (
        <button
          type="button"
          className={styles.pause}
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Play the campaign slideshow" : "Pause the campaign slideshow"}
        >
          {paused ? <PlayArrow aria-hidden="true" /> : <Pause aria-hidden="true" />}
        </button>
      )}
    </div>
  );
}
