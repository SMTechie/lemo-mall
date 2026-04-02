export function SiteBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/lemofest/blog11.jpg"
        className="absolute inset-0 h-full w-full object-cover object-center"
      >
        <source src="/lemofest/2025_HIGHLIGHTS.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,8,10,0.92)_0%,rgba(9,8,10,0.84)_34%,rgba(9,8,10,0.58)_68%,rgba(9,8,10,0.26)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,0,0.12),transparent_26%),radial-gradient(circle_at_82%_16%,rgba(255,44,85,0.26),transparent_28%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.25),transparent_40%)]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_12%,transparent_88%,rgba(255,255,255,0.04))]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,11,11,0.15),rgba(11,11,11,0.42))]" />
    </div>
  );
}
