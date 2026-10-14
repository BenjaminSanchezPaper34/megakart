"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * Contrôleur global : smooth scroll Lenis + animations déclaratives.
 *   data-reveal            → fade in + translateY au scroll
 *   data-stagger           → enfants révélés en cascade
 *   data-counter="1000"    → compteur animé (suffixe via data-suffix)
 *   data-hero-bg / data-hero-content → parallaxe + fade du hero
 * Respecte prefers-reduced-motion (aucune animation, contenu visible).
 */
export default function FX() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    if (!reduced) {
      lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1 });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis!.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    if (reduced) {
      // Contenu immédiatement visible, compteurs à leur valeur finale
      document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
        el.textContent = el.dataset.counter ?? "";
      });
      return () => {};
    }

    // iOS : la barre d'adresse qui se rétracte redimensionne la fenêtre ; sans ça,
    // ScrollTrigger recalcule tout en plein geste et le hero saute.
    ScrollTrigger.config({ ignoreMobileResize: true });
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    const ctx = gsap.context(() => {
      // Reveals simples
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          delay: parseFloat(el.dataset.reveal || "0"),
          scrollTrigger: { trigger: el, start: "top 86%", once: true },
        });
      });

      // Cascades
      document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((el) => {
        gsap.to(el.children, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 84%", once: true },
        });
      });

      // Compteurs
      document.querySelectorAll<HTMLElement>("[data-counter]").forEach((el) => {
        const target = parseFloat(el.dataset.counter || "0");
        const suffix = el.dataset.suffix || "";
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toLocaleString("fr-FR") + suffix;
          },
        });
      });

      // Hero : parallaxe fond + fade contenu
      const heroBg = document.querySelector<HTMLElement>("[data-hero-bg]");
      const heroContent = document.querySelector<HTMLElement>("[data-hero-content]");
      // Mobile : le hero est animé en CSS (animation-timeline, globals.css), calculé
      // par le compositeur au rythme du défilement natif. Le scrub GSAP, recalculé en
      // JavaScript à chaque évènement de scroll, restait saccadé sur iPhone (14/10).
      if (heroBg && !coarse) {
        gsap.to(heroBg, {
          yPercent: 18,
          // Au doigt, pas de zoom sur la vidéo : trop coûteux pendant le défilement natif.
          scale: coarse ? 1 : 1.08,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: heroBg.parentElement,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (heroContent && !coarse) {
        // Mobile : opacité + translation seulement. Le scale obligeait le navigateur
        // à recalculer le rendu du texte à chaque image → défilement saccadé (Benjamin, 14/10).
        heroContent.style.willChange = "transform, opacity";
        gsap.to(heroContent, {
          opacity: 0,
          yPercent: coarse ? -12 : -25,
          scale: coarse ? 1 : 0.96,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: heroContent.parentElement,
            start: "top top",
            end: "62% top",
            scrub: true,
          },
        });
      }
    });

    // Recalcul après chargement des images
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      if (lenis) {
        gsap.ticker.remove((time) => lenis!.raf(time * 1000));
        lenis.destroy();
      }
    };
  }, [pathname]);

  return null;
}
