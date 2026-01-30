import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";

const pictures = [
  "DSC00680",
  "DSC00933",
  "DSC00966",
  "DSC00983",
  "DSC01011",
  "DSC01040",
  "DSC01064",
  "DSC01071",
  "DSC01103",
  "DSC01145",
  "DSC01420",
  "DSC01461",
  "DSC01489",
  "DSC02031",
  "DSC02064",
  "DSC02069",
];

export const pageAtom = atom(0);
export const pages = [
  { front: "book-cover", back: pictures[0] },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}
pages.push({ front: pictures[pictures.length - 1], back: "book-back" });

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const bgAudioRef = useRef(null);

  // Page flip sound
  useEffect(() => {
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.play().catch(() => {
      console.log("Page flip audio blocked by browser autoplay policy");
    });
  }, [page]);

  // Background music after user interaction
  useEffect(() => {
    const startBgMusic = () => {
      if (!bgAudioRef.current) {
        const bgAudio = new Audio("/audios/nature_background.mp3");
        bgAudio.loop = true;
        bgAudio.volume = 0.3;
        bgAudio.play().catch(() => {
          console.log("Background audio still blocked");
        });
        bgAudioRef.current = bgAudio;
      }
      // Remove event listeners after first interaction
      window.removeEventListener("click", startBgMusic);
      window.removeEventListener("keydown", startBgMusic);
    };

    // Wait for first user interaction
    window.addEventListener("click", startBgMusic);
    window.addEventListener("keydown", startBgMusic);

    return () => {
      window.removeEventListener("click", startBgMusic);
      window.removeEventListener("keydown", startBgMusic);
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <main className="pointer-events-none select-none z-10 fixed inset-0 flex flex-col justify-between">
      {/* Logo */}
      <a className="pointer-events-auto mt-10 ml-10">
        <img className="w-20" src="/images/logo.jpg" />
      </a>

      {/* Heading at top middle */}
      <h1
        className="pointer-events-auto fixed top-4 left-1/2 -translate-x-1/2 text-4xl font-bold text-white z-20"
        style={{ fontFamily: "Pacifico, cursive" }}
      >
        Beauty Of Sri Lanka
      </h1>

      {/* Page buttons */}
      <div className="w-full overflow-auto pointer-events-auto flex justify-center mt-6">
        <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
          {[...pages].map((_, index) => (
            <button
              key={index}
              className={`border-transparent hover:border-white transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border ${
                index === page
                  ? "bg-white/90 text-black"
                  : "bg-black/30 text-white"
              }`}
              onClick={() => setPage(index)}
            >
              {index === 0 ? "Cover" : `Page ${index}`}
            </button>
          ))}
          <button
            className={`border-transparent hover:border-white transition-all duration-300 px-4 py-3 rounded-full text-lg uppercase shrink-0 border ${
              page === pages.length
                ? "bg-white/90 text-black"
                : "bg-black/30 text-white"
            }`}
            onClick={() => setPage(pages.length)}
          >
            Back Cover
          </button>
        </div>
      </div>
    </main>
  );
};
