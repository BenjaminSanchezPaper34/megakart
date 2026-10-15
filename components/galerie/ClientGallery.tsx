"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Gallery } from "@/lib/gallery-shared";
import { assetUrl, formatBytes } from "@/lib/gallery-shared";

type Props = { gallery: Gallery };

/**
 * Galerie photo client : grille masonry + lightbox + téléchargement.
 *
 * Téléchargement individuel : lien direct vers l'original (même origine →
 * octets intacts, aucune recompression). « Tout télécharger » : JSZip en
 * mode STORE (archivage sans compression → bytes identiques aux originaux).
 */
export default function ClientGallery({ gallery }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [zipping, setZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  // Carrousel lightbox : translation du rail en % (−100 = photo centrée)
  const [tx, setTx] = useState(-100);
  const [withTrans, setWithTrans] = useState(false);
  const [snapMs, setSnapMs] = useState(300); // durée du snap (adaptée au flick)
  const dragRef = useRef<{
    x: number;
    y: number;
    dir: null | "h" | "v";
    active: boolean;
    lastX: number;
    lastT: number;
    vx: number; // vélocité horizontale (px/ms)
  }>({ x: 0, y: 0, dir: null, active: false, lastX: 0, lastT: 0, vx: 0 });
  const animatingRef = useRef(false);

  const photos = gallery.photos;

  /* ─── Téléchargement d'un original (octets intacts) ───
   * Les URLs Blob sont cross-origin → l'attribut `download` est ignoré
   * par le navigateur. On récupère donc les octets via fetch puis on force
   * la sauvegarde via un object URL (même origine). Bytes identiques. */
  const downloadOriginal = useCallback(
    async (index: number) => {
      const p = photos[index];
      const url = assetUrl(gallery.slug, p.original);
      setSavingIndex(index);
      try {
        const res = await fetch(url);
        const blob = await res.blob();
        const file = new File([blob], p.downloadName, {
          type: blob.type || "image/heic",
        });

        // Mobile (iOS/Android) : feuille de partage native → « Enregistrer
        // l'image » envoie l'ORIGINAL dans la pellicule, en qualité HDR.
        // (un téléchargement web classique irait dans Fichiers, pas Photos)
        const nav = navigator as Navigator & {
          canShare?: (data?: { files: File[] }) => boolean;
        };
        if (nav.canShare && nav.canShare({ files: [file] })) {
          try {
            await nav.share({ files: [file] });
            return;
          } catch (err) {
            // Annulation utilisateur → on ne fait rien
            if (err instanceof Error && err.name === "AbortError") return;
            // sinon on retombe sur le téléchargement fichier ci-dessous
          }
        }

        // Desktop / navigateurs sans partage : téléchargement fichier
        const objUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objUrl;
        a.download = p.downloadName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(objUrl);
      } catch (e) {
        console.error(e);
        window.open(url, "_blank");
      } finally {
        setSavingIndex(null);
      }
    },
    [photos, gallery.slug]
  );

  /* ─── Téléchargement ZIP (sans compression) ─── */
  async function downloadAll() {
    if (zipping) return;
    setZipping(true);
    setZipProgress(0);
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      // Les films sont exclus du ZIP (lecture seule, trop lourds) :
      // seules les images partent au téléchargement groupé.
      const downloadable = photos.filter((p) => p.type !== "video");
      for (let i = 0; i < downloadable.length; i++) {
        const p = downloadable[i];
        const res = await fetch(assetUrl(gallery.slug, p.original));
        const buf = await res.arrayBuffer();
        // STORE = aucune compression → octets identiques à l'original
        zip.file(p.downloadName, buf, { compression: "STORE" });
        setZipProgress(i + 1);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${gallery.client} - ${gallery.title}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la préparation du ZIP. Réessayez.");
    } finally {
      setZipping(false);
      setZipProgress(0);
    }
  }

  /* ─── Navigation lightbox (carrousel animé) ─── */
  const close = useCallback(() => setLightbox(null), []);

  // Lance le glissement animé vers la photo suivante / précédente.
  const goNext = useCallback(() => {
    if (animatingRef.current || photos.length < 2) return;
    animatingRef.current = true;
    setSnapMs(300);
    setWithTrans(true);
    setTx(-200); // rail glisse d'un cran vers la gauche
  }, [photos.length]);

  const goPrev = useCallback(() => {
    if (animatingRef.current || photos.length < 2) return;
    animatingRef.current = true;
    setSnapMs(300);
    setWithTrans(true);
    setTx(0); // rail glisse d'un cran vers la droite
  }, [photos.length]);

  // Fin de transition : on commit l'index puis on recentre le rail SANS
  // transition → l'image arrivée reste exactement à la même place (zéro saut).
  function onTrackTransitionEnd() {
    animatingRef.current = false;
    if (tx === -200) {
      setLightbox((i) => (i === null ? i : (i + 1) % photos.length));
      setWithTrans(false);
      setTx(-100);
    } else if (tx === 0) {
      setLightbox((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
      setWithTrans(false);
      setTx(-100);
    } else {
      setWithTrans(false); // simple retour au centre
    }
  }

  useEffect(() => {
    if (lightbox === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, goNext, goPrev]);

  /* ─── Préchargement des photos voisines (navigation instantanée) ─── */
  useEffect(() => {
    if (lightbox === null) return;
    [lightbox + 1, lightbox - 1, lightbox + 2].forEach((n) => {
      const idx = (n + photos.length) % photos.length;
      const img = new window.Image();
      img.src = assetUrl(gallery.slug, photos[idx].display);
    });
  }, [lightbox, photos, gallery.slug]);

  /* ─── Drag tactile (l'image suit le doigt, façon iOS) ─── */
  function onTouchStart(e: React.TouchEvent) {
    if (animatingRef.current) return;
    const t = e.touches[0];
    const now = performance.now();
    dragRef.current = {
      x: t.clientX,
      y: t.clientY,
      dir: null,
      active: true,
      lastX: t.clientX,
      lastT: now,
      vx: 0,
    };
    setWithTrans(false);
  }
  function onTouchMove(e: React.TouchEvent) {
    const d = dragRef.current;
    if (!d.active) return;
    const t = e.touches[0];
    const dx = t.clientX - d.x;
    const dy = t.clientY - d.y;
    // Verrouille la direction au premier mouvement franc
    if (!d.dir && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
      d.dir = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }
    if (d.dir === "h") {
      // Vélocité instantanée (lissée) pour la détection de flick
      const now = performance.now();
      const ddt = now - d.lastT;
      if (ddt > 0) {
        const instV = (t.clientX - d.lastX) / ddt;
        d.vx = d.vx * 0.6 + instV * 0.4; // lissage
      }
      d.lastX = t.clientX;
      d.lastT = now;
      const pct = (dx / (window.innerWidth || 1)) * 100;
      setTx(-100 + pct); // suit le doigt en temps réel
    }
  }
  function onTouchEnd(e: React.TouchEvent) {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    if (d.dir !== "h") return;
    const dx = e.changedTouches[0].clientX - d.x;
    const W = window.innerWidth || 1;
    const distThresh = W * 0.1; // seuil de distance plus permissif
    const VEL = 0.3; // px/ms ≈ flick rapide
    animatingRef.current = true;
    setWithTrans(true);
    // Flick rapide → snap court ; sinon snap normal
    const isFlick = Math.abs(d.vx) > VEL;
    setSnapMs(isFlick ? 210 : 300);
    if (d.vx < -VEL || (dx <= -distThresh && d.vx < 0.05)) {
      setTx(-200); // suivante
    } else if (d.vx > VEL || (dx >= distThresh && d.vx > -0.05)) {
      setTx(0); // précédente
    } else {
      setTx(-100); // retour élastique
    }
  }

  // Galerie 100 % vidéo (mariages…) : lecture seule, pas de téléchargement.
  // Galerie mixte (campagnes : film + visuels print) : « créations », et le
  // ZIP ne contient que les images.
  const videoCount = photos.filter((p) => p.type === "video").length;
  const isVideoGallery = photos.length > 0 && videoCount === photos.length;
  const isMixed = videoCount > 0 && !isVideoGallery;
  const downloadableCount = photos.length - videoCount;

  return (
    <>
      {/* Barre d'action sticky (sous la navbar fixe, h-16) */}
      <div className="sticky top-[4.25rem] z-20 bg-asphalt/85 backdrop-blur-xl border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between gap-4">
          <p className="text-sm text-chalk-60">
            <span className="text-chalk font-medium">{gallery.count}</span>{" "}
            {isVideoGallery
              ? gallery.count > 1 ? "films" : "film"
              : isMixed
                ? "créations"
                : `${gallery.count > 1 ? "photos" : "photo"} · ${formatBytes(gallery.totalOriginalBytes)}`}
          </p>
          {!isVideoGallery && (
          <button
            onClick={downloadAll}
            disabled={zipping}
            className="inline-flex items-center gap-2 rounded-full bg-race px-5 py-2.5 text-sm font-semibold text-white hover:bg-race-deep transition-colors disabled:opacity-60 disabled:cursor-wait"
          >
            {zipping ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Préparation {zipProgress}/{downloadableCount}…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Tout télécharger
              </>
            )}
          </button>
          )}
        </div>
      </div>

      {/* Grille. Galeries mixtes (campagnes) : mise en page façon Behance —
          films en pleine largeur, visuels print en maçonnerie aux proportions
          naturelles (jamais recadrés). Sinon : grille uniforme en ordre de
          lecture. */}
      <div className="mx-auto max-w-7xl px-6 py-8">
        {isMixed && (
          <>
            {/* Films horizontaux : pièce maîtresse pleine largeur */}
            <div className="space-y-3">
              {photos.map((p, i) =>
                p.type === "video" && (p.width ?? 0) >= (p.height ?? 0) ? (
                  <div
                    key={p.id}
                    className="group relative aspect-video rounded-xl overflow-hidden bg-asphalt-3 cursor-pointer [transform:translateZ(0)]"
                    onClick={() => setLightbox(i)}
                  >
                    <img
                      src={assetUrl(gallery.slug, p.thumb || p.display)}
                      alt={p.title || gallery.title}
                      width={p.width}
                      height={p.height}
                      loading="lazy"
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] select-none pointer-events-none [-webkit-touch-callout:none]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="w-16 h-16 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-7 h-7 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.54-6.86a1.03 1.03 0 000-1.76L9.56 4.26A1.03 1.03 0 008 5.14z" />
                        </svg>
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 flex items-end justify-between gap-3">
                      {p.title && <span className="text-white text-sm font-medium">{p.title}</span>}
                      {p.duration && (
                        <span className="text-white/75 text-xs tabular-nums shrink-0">{p.duration}</span>
                      )}
                    </div>
                  </div>
                ) : null
              )}
            </div>
            {/* Bento : reels verticaux (2 rangées de haut) + photos en cases
                carrées, flux dense — les photos comblent autour de la vidéo */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 [grid-auto-flow:dense]">
              {photos.map((p, i) => {
                if (p.type === "video") {
                  if ((p.height ?? 0) <= (p.width ?? 0)) return null; // déjà en pleine largeur
                  return (
                    <div
                      key={p.id}
                      className="group relative row-span-2 rounded-xl overflow-hidden bg-asphalt-3 cursor-pointer [transform:translateZ(0)]"
                      onClick={() => setLightbox(i)}
                    >
                      <img
                        src={assetUrl(gallery.slug, p.thumb || p.display)}
                        alt={p.title || gallery.title}
                        width={p.width}
                        height={p.height}
                        loading="lazy"
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] select-none pointer-events-none [-webkit-touch-callout:none]"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="w-14 h-14 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                          <svg className="w-6 h-6 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.54-6.86a1.03 1.03 0 000-1.76L9.56 4.26A1.03 1.03 0 008 5.14z" />
                          </svg>
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2.5 pt-8 flex items-end justify-between gap-2">
                        {p.title && <span className="text-white text-xs font-medium">{p.title}</span>}
                        {p.duration && (
                          <span className="text-white/75 text-xs tabular-nums shrink-0">{p.duration}</span>
                        )}
                      </div>
                    </div>
                  );
                }
                return (
                  <div
                    key={p.id}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-asphalt-3 cursor-pointer [transform:translateZ(0)]"
                    onClick={() => setLightbox(i)}
                  >
                    <img
                      src={assetUrl(gallery.slug, p.thumb || p.display)}
                      alt={p.title || `${gallery.title} — visuel ${i + 1}`}
                      width={p.width}
                      height={p.height}
                      loading="lazy"
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05] select-none pointer-events-none [-webkit-touch-callout:none]"
                    />
                    {p.title && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8 pointer-events-none">
                        <span className="text-white text-xs font-medium">{p.title}</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadOriginal(i);
                      }}
                      className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-race"
                      title="Télécharger l'original"
                      aria-label="Télécharger l'original"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
        {!isMixed && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {photos.map((p, i) => (
            <div
              key={p.id}
              className={`group relative rounded-xl overflow-hidden bg-asphalt-3 cursor-pointer [transform:translateZ(0)] [will-change:transform] ${
                p.type === "video"
                  ? (p.height ?? 0) > (p.width ?? 0)
                    ? "aspect-[9/16]"
                    : "col-span-2 aspect-video"
                  : "aspect-square"
              }`}
              onClick={() => setLightbox(i)}
            >
              <img
                src={assetUrl(gallery.slug, p.thumb || p.display)}
                alt={p.title || `${gallery.title} — photo ${i + 1}`}
                width={p.width}
                height={p.height}
                loading="lazy"
                draggable={false}
                className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-[1.05] select-none pointer-events-none [-webkit-touch-callout:none]"
              />
              {p.type === "video" ? (
                <>
                  {/* Badge lecture centré */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full bg-black/45 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <svg className="w-7 h-7 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5.14v13.72c0 .8.87 1.3 1.56.88l10.54-6.86a1.03 1.03 0 000-1.76L9.56 4.26A1.03 1.03 0 008 5.14z" />
                      </svg>
                    </span>
                  </div>
                  {/* Titre + durée */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 flex items-end justify-between gap-3">
                    {p.title && <span className="text-white text-sm font-medium">{p.title}</span>}
                    {p.duration && (
                      <span className="text-white/75 text-xs tabular-nums shrink-0">{p.duration}</span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Titre optionnel (visuels de campagne : affiches, stories…) */}
                  {p.title && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8 pointer-events-none">
                      <span className="text-white text-xs font-medium">{p.title}</span>
                    </div>
                  )}
                  {/* Overlay download au hover (photos uniquement) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadOriginal(i);
                    }}
                    className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-black/55 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-race"
                    title="Télécharger l'original"
                    aria-label="Télécharger l'original"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black select-none overflow-hidden animate-[lightboxIn_0.3s_ease-out]">
          {/* Zone tactile : rail à 3 slides (préc / courante / suiv) qui
              suit le doigt, façon iOS. touch-action none = on contrôle le geste. */}
          <div
            className="absolute inset-0"
            style={{ touchAction: "none" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="flex h-full w-full"
              style={{
                transform: `translate3d(${tx}%, 0, 0)`,
                transition: withTrans
                  ? `transform ${snapMs}ms cubic-bezier(0.22, 1, 0.36, 1)`
                  : "none",
                willChange: "transform",
              }}
              onTransitionEnd={onTrackTransitionEnd}
            >
              {[
                (lightbox - 1 + photos.length) % photos.length,
                lightbox,
                (lightbox + 1) % photos.length,
              ].map((idx, slot) => (
                <div
                  key={slot}
                  className="w-full h-full shrink-0 flex items-center justify-center"
                >
                  {photos[idx].type === "video" && slot === 1 ? (
                    /* Player sur la slide centrale uniquement. stopPropagation :
                       les gestes sur le player ne déclenchent pas le swipe. */
                    <div
                      className="w-full max-h-full px-0 sm:px-14"
                      onTouchStart={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                      onTouchEnd={(e) => e.stopPropagation()}
                    >
                      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                      <video
                        key={photos[idx].id}
                        controls
                        playsInline
                        preload="metadata"
                        poster={assetUrl(gallery.slug, photos[idx].display)}
                        className="w-full max-h-[82vh] object-contain"
                      >
                        <source src={photos[idx].video} type="video/mp4" />
                      </video>
                    </div>
                  ) : (
                    <img
                      src={assetUrl(gallery.slug, photos[idx].display)}
                      alt={photos[idx].title || `${gallery.title} — photo ${idx + 1}`}
                      className="w-full h-full object-contain select-none pointer-events-none [-webkit-touch-callout:none]"
                      draggable={false}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dégradé haut + compteur + fermer. pointer-events-none : le bandeau
              ne bloque pas les contrôles vidéo (plein écran en paysage iPhone) ;
              seul le bouton fermer reste cliquable. */}
          <div
            className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 via-black/25 to-transparent pointer-events-none"
            style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
          >
            <div className="flex items-center justify-between px-5 pb-10 pt-3 text-white">
              <span className="text-sm font-medium tabular-nums tracking-wide">
                {lightbox + 1} <span className="text-white/50">/ {photos.length}</span>
              </span>
              <button
                onClick={close}
                className="pointer-events-auto w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white flex items-center justify-center transition-colors shrink-0"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Flèches (desktop ; mobile = drag) */}
          <button
            onClick={goPrev}
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white items-center justify-center transition-all hover:scale-105"
            aria-label="Précédent"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white items-center justify-center transition-all hover:scale-105"
            aria-label="Suivant"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dégradé bas + actions (zone du pouce sur mobile). pointer-events-none :
              ne bloque pas la timeline/plein écran du player en paysage ; seuls
              les boutons restent cliquables. */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10 px-4 pt-16 bg-gradient-to-t from-black/90 via-black/55 to-transparent pointer-events-none"
            style={{ paddingBottom: "max(1.1rem, env(safe-area-inset-bottom))" }}
          >
            {photos[lightbox].type === "video" ? (
              /* Vidéo : légende sobre, pas de téléchargement */
              <p className="text-center text-sm text-white/80 pb-1">
                {photos[lightbox].title}
                {photos[lightbox].duration && (
                  <span className="text-white/50"> · {photos[lightbox].duration}</span>
                )}
              </p>
            ) : (
            <>
            <div className="flex items-center justify-center max-w-lg mx-auto">
              {/* Enregistrer cette photo (centré) */}
              <button
                onClick={() => downloadOriginal(lightbox)}
                disabled={savingIndex === lightbox}
                className="pointer-events-auto inline-flex items-center justify-center gap-2 rounded-full bg-race hover:bg-race-deep px-8 py-3.5 text-sm font-semibold text-white transition-colors disabled:opacity-70 disabled:cursor-wait"
              >
                {savingIndex === lightbox ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Préparation…
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Enregistrer cette photo
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-[11px] text-white/45 mt-2.5">
              Qualité originale conservée
            </p>
            </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
