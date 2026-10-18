import { useEffect, useRef, useState } from 'react';

const NOTE_WIDTH = 320;

/**
 * Lebdeća beleška ("sticky note") — dostupna na svim ekranima aplikacije.
 *
 * Namerna ograničenja (po zahtevu):
 * - Tekst živi SAMO u React state-u (RAM). Bez localStorage/sessionStorage/
 *   bilo kakvog storage-a — osvežavanje stranice briše sadržaj.
 * - Jedini način čuvanja je klik na ".txt": Blob + privremeni <a download>
 *   klik, fajl se skida direktno na računar korisnika (bez servera).
 *
 * Panel se prevlači po ekranu za header (pointer događaji — radi i na touch-u).
 */
export default function StickyNote({ open, onOpen, onClose, text, onChange }) {
  // Početna pozicija: dole-desno, iznad dugmeta. Menja se samo prevlačenjem.
  const [pos, setPos] = useState(() => ({
    x: Math.max(16, window.innerWidth - NOTE_WIDTH - 24),
    y: Math.max(16, window.innerHeight - 460),
  }));
  const [dragging, setDragging] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false); // kratki "Sačuvano ✓" feedback
  const dragOffset = useRef({ x: 0, y: 0 });
  const flashTimer = useRef(null);

  // Čišćenje tajmera pri demontiranju komponente.
  useEffect(() => () => clearTimeout(flashTimer.current), []);

  /** Početak prevlačenja — samo iz header-a, i ne sa dugmadi u header-u. */
  function startDrag(e) {
    if (e.target.closest('button')) return;
    e.preventDefault(); // sprečava selekciju teksta tokom prevlačenja
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setDragging(true);
  }

  // Dok traje prevlačenje — slušamo kretanje miša/prsta na nivou prozora,
  // pa panel prati kursor i kad izađe izvan header-a.
  useEffect(() => {
    if (!dragging) return undefined;

    const move = (e) => {
      const maxX = window.innerWidth - 96; // bar deo panela ostaje vidljiv
      const maxY = window.innerHeight - 48; // bar header ostaje vidljiv
      setPos({
        x: Math.min(Math.max(0, e.clientX - dragOffset.current.x), maxX),
        y: Math.min(Math.max(0, e.clientY - dragOffset.current.y), maxY),
      });
    };
    const stop = () => setDragging(false);

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    };
  }, [dragging]);

  /** Export trenutnog sadržaja u .txt fajl na računaru korisnika. */
  function exportAsTxt() {
    if (!text.trim()) return;

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clf-c02-beleske-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setSavedFlash(true);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setSavedFlash(false), 1600);
  }

  return (
    <>
      {/* Lebdeće dugme (vidljivo samo kad je beleška zatvorena) */}
      {!open && (
        <button
          type="button"
          onClick={onOpen}
          title="Otvori beleške"
          aria-label="Otvori beleške"
          className="fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full bg-amber-400 text-xl text-neutral-900 shadow-lg shadow-black/40 transition-transform hover:scale-105 hover:bg-amber-300"
        >
          📝
        </button>
      )}

      {/* Panel beleške */}
      {open && (
        <aside
          role="complementary"
          aria-label="Beleške"
          style={{ left: pos.x, top: pos.y, width: `min(${NOTE_WIDTH}px, calc(100vw - 2rem))` }}
          className="fixed z-50 flex flex-col overflow-hidden rounded-xl border border-amber-300 bg-amber-100 text-neutral-900 shadow-2xl shadow-black/50"
        >
          {/* Header — ručka za prevlačenje */}
          <div
            onPointerDown={startDrag}
            style={{ touchAction: 'none' }}
            className={`flex select-none items-center justify-between gap-2 border-b border-amber-300 bg-amber-200 px-3 py-2 ${
              dragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <span className="text-sm font-semibold">📝 Beleške</span>
            <span className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={exportAsTxt}
                disabled={!text.trim()}
                title="Skini beleške kao .txt fajl"
                className="rounded-md bg-amber-300/80 px-2 py-1 text-xs font-semibold text-neutral-900 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {savedFlash ? 'Sačuvano ✓' : '⬇ .txt'}
              </button>
              <button
                type="button"
                onClick={onClose}
                title="Zatvori beleške"
                aria-label="Zatvori beleške"
                className="rounded-md px-2 py-1 text-xs font-semibold text-neutral-700 transition-colors hover:bg-amber-300/70 hover:text-neutral-900"
              >
                ✕
              </button>
            </span>
          </div>

          {/* Unos — kontroliše App, tako da zatvaranje/otvaranje ne briše tekst */}
          <textarea
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Zapiši ovde šta želiš da zapamtiš tokom vežbanja…"
            spellCheck={false}
            className="h-48 resize-y bg-transparent px-3 py-2 font-mono text-[13px] leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-500"
          />

          {/* Podsetnik na namerno ograničenje */}
          <p className="border-t border-amber-300/70 bg-amber-200/60 px-3 py-1.5 text-[11px] leading-snug text-neutral-600">
            Ne čuva se nigde u storage-u — osvežavanje stranice briše tekst.
            Kad želiš da sačuvaš, klikni ⬇ .txt.
          </p>
        </aside>
      )}
    </>
  );
}
