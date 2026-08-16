
export function Footer() {
  return (
    <footer className="mt-20 border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-4 py-8 sm:px-8">
        <div className="font-display text-sm tracking-[0.22em]">
          CINE<span className="text-gold">VERSE</span>
        </div>
        <div className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-muted-foreground">
          Vibe coded by <span className="text-gold">Loknath</span> · © 2026
        </div>
      </div>
    </footer>
  );
}
