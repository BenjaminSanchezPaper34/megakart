"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Navigation d'une rangée qui défile (cartes des courses) :
 *  - glisser à la souris (attraper / lâcher), avec un élan, puis calage sur la carte
 *    la plus proche ; un clic qui suit un glisser est annulé (pas d'ouverture de lien) ;
 *  - progression 0 → 1 et part visible, pour la barre sous la rangée.
 * Au doigt et au trackpad, le défilement natif (avec aimantation CSS) reste maître.
 */
export function useRowNav<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [pos, setPos] = useState({ progress: 0, visible: 1 });

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPos({ progress: max > 0 ? el.scrollLeft / max : 0, visible: Math.min(1, el.clientWidth / el.scrollWidth) });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    let startX = 0;
    let startLeft = 0;
    let lastX = 0;
    let lastT = 0;
    let speed = 0;
    let down = false;
    let dragged = false;

    const step = () => {
      const card = el.firstElementChild as HTMLElement | null;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 20;
      return card ? card.offsetWidth + gap : el.clientWidth;
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      down = true;
      dragged = false;
      startX = lastX = e.clientX;
      startLeft = el.scrollLeft;
      lastT = performance.now();
      speed = 0;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!dragged && Math.abs(dx) > 6) {
        dragged = true;
        el.setPointerCapture(e.pointerId);
        el.style.scrollSnapType = "none";
        el.style.cursor = "grabbing";
        el.style.userSelect = "none";
      }
      if (!dragged) return;
      const now = performance.now();
      speed = (e.clientX - lastX) / Math.max(1, now - lastT);
      lastX = e.clientX;
      lastT = now;
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      if (!dragged) return;
      el.style.cursor = "";
      el.style.userSelect = "";
      // Élan : la vitesse au lâcher pousse d'une carte de plus, puis calage sur une carte.
      const s = step();
      const projected = el.scrollLeft - speed * 260;
      const target = Math.max(0, Math.min(el.scrollWidth - el.clientWidth, Math.round(projected / s) * s));
      el.scrollTo({ left: target, behavior: "smooth" });
      window.setTimeout(() => (el.style.scrollSnapType = ""), 450);
    };
    const onClick = (e: MouseEvent) => {
      if (dragged) {
        e.preventDefault();
        e.stopPropagation();
        dragged = false;
      }
    };
    // Les images ne doivent pas partir en glisser-déposer natif.
    const onDragStart = (e: DragEvent) => e.preventDefault();

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClick, true);
    el.addEventListener("dragstart", onDragStart);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClick, true);
      el.removeEventListener("dragstart", onDragStart);
    };
  }, [measure]);

  return { ref, ...pos };
}
