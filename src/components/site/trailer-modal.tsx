import { ExternalLink, Play, Volume2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function TrailerModal({
  videoKey,
  title,
  onClose,
}: {
  videoKey: string;
  title: string;
  onClose: () => void;
}) {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  const thumbnail = useMemo(
    () => `https://img.youtube.com/vi/${encodeURIComponent(videoKey)}/hqdefault.jpg`,
    [videoKey],
  );

  const embedSrc = useMemo(() => {
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "0",
      controls: "1",
      playsinline: "1",
      rel: "0",
      modestbranding: "1",
      fs: "1",
      iv_load_policy: "3",
      origin: window.location.origin,
    });
    return `https://www.youtube.com/embed/${encodeURIComponent(videoKey)}?${params.toString()}`;
  }, [videoKey]);

  const playTrailer = () => {
    setFailed(false);
    setPlaying(true);
  };

  return (
    <div
      className="trailer-modal fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-2 backdrop-blur-md sm:p-5"
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} trailer`}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl shadow-black/70 sm:rounded-3xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close trailer"
          onClick={onClose}
          className="absolute right-2 top-2 z-40 grid size-9 place-items-center rounded-full border border-white/20 bg-black/80 text-white backdrop-blur transition hover:bg-white hover:text-black sm:right-3 sm:top-3 sm:size-10"
        >
          <X className="size-4" />
        </button>

        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {!playing ? (
            <button
              type="button"
              onClick={playTrailer}
              className="group absolute inset-0 z-20 flex w-full items-center justify-center overflow-hidden text-left"
              aria-label={`Play ${title} trailer with sound`}
            >
              <img
                src={thumbnail}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-[1.02] group-hover:opacity-80"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/45" />
              <span className="relative flex flex-col items-center text-center px-5">
                <span className="grid size-16 place-items-center rounded-full border border-gold/60 bg-gold/90 text-black shadow-2xl shadow-black/60 transition duration-300 group-hover:scale-105 sm:size-20">
                  <Play className="ml-1 size-7 fill-current sm:size-8" />
                </span>
                <span className="mt-4 max-w-[80vw] font-display text-lg text-white sm:text-2xl">{title}</span>
                <span className="mt-2 inline-flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-white/70 sm:text-[0.65rem]">
                  <Volume2 className="size-3.5" /> Play trailer with sound
                </span>
              </span>
            </button>
          ) : null}

          {playing ? (
            <iframe
              className="absolute inset-0 z-10 block h-full w-full border-0 bg-black"
              src={embedSrc}
              title={`${title} trailer`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onError={() => setFailed(true)}
            />
          ) : null}

          {playing && !failed ? (
            <div className="absolute bottom-2 left-2 z-30 rounded-full bg-black/70 px-3 py-1.5 font-mono text-[0.55rem] uppercase tracking-[0.14em] text-white/75 backdrop-blur sm:bottom-3 sm:left-3">
              Sound enabled · use player controls
            </div>
          ) : null}

          {failed ? (
            <div className="absolute inset-0 z-30 grid place-items-center bg-black/95 p-5 text-center sm:p-8">
              <div>
                <div className="font-display text-xl text-white">Trailer cannot play here</div>
                <p className="mt-2 max-w-md text-sm text-white/65">
                  This video is blocking embedded playback. You can still watch the official trailer directly.
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${encodeURIComponent(videoKey)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-black"
                >
                  <ExternalLink className="size-4" /> Watch on YouTube
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
