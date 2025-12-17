"use client";

import Link from "next/link";
import Image from "next/image";
import { SpadeIcon } from "@/components/ui/spade-icon";
import { useEffect, useState, useRef, useCallback } from "react";

// Collage images with varying widths, heights, and vertical offsets for organic feel
// type: "image" or "video"
const collageImages = [
  { id: 1, ext: "jpg", type: "image", width: "w-36 md:w-48", height: "h-[85%]", offset: "mt-[8%]" },
  { id: 2, ext: "jpg", type: "image", width: "w-28 md:w-36", height: "h-[90%]", offset: "mt-[5%]" },
  { id: 3, ext: "jpg", type: "image", width: "w-40 md:w-52", height: "h-[75%]", offset: "mt-[12%]" },
  // ROLL VIDEO 1
  { id: "RollM1", ext: "mp4", type: "video", width: "w-36 md:w-48", height: "h-[90%]", offset: "mt-[5%]" },
  { id: 20, ext: "JPEG", type: "image", width: "w-32 md:w-44", height: "h-[95%]", offset: "mt-[2%]" },
  { id: 4, ext: "jpg", type: "image", width: "w-28 md:w-36", height: "h-[68%]", offset: "mt-[18%]" },
  { id: 5, ext: "jpg", type: "image", width: "w-36 md:w-48", height: "h-[82%]", offset: "mt-[10%]" },
  { id: 21, ext: "JPEG", type: "image", width: "w-30 md:w-40", height: "h-[72%]", offset: "mt-[14%]" },
  // FLAME VIDEO
  { id: "ATSV Flame shot", ext: "mov", type: "video", width: "w-40 md:w-52", height: "h-[88%]", offset: "mt-[6%]" },
  { id: 6, ext: "jpg", type: "image", width: "w-32 md:w-44", height: "h-[88%]", offset: "mt-[6%]" },
  // TEAM SHOT - Big center piece
  { id: 19, ext: "JPEG", type: "image", width: "w-72 md:w-[400px]", height: "h-[92%]", offset: "mt-[4%]" },
  { id: 7, ext: "jpg", type: "image", width: "w-28 md:w-36", height: "h-[78%]", offset: "mt-[11%]" },
  // ROLL VIDEO 2
  { id: "RollM2", ext: "mp4", type: "video", width: "w-36 md:w-48", height: "h-[85%]", offset: "mt-[8%]" },
  { id: 22, ext: "JPEG", type: "image", width: "w-40 md:w-52", height: "h-[92%]", offset: "mt-[4%]" },
  { id: 8, ext: "jpg", type: "image", width: "w-32 md:w-40", height: "h-[65%]", offset: "mt-[20%]" },
  { id: 9, ext: "jpg", type: "image", width: "w-36 md:w-48", height: "h-[85%]", offset: "mt-[8%]" },
  { id: 23, ext: "JPG", type: "image", width: "w-28 md:w-36", height: "h-[75%]", offset: "mt-[13%]" },
  { id: 10, ext: "jpg", type: "image", width: "w-32 md:w-44", height: "h-[90%]", offset: "mt-[5%]" },
  // ROLL VIDEO 3
  { id: "Mroll3", ext: "mp4", type: "video", width: "w-36 md:w-48", height: "h-[82%]", offset: "mt-[9%]" },
  { id: 11, ext: "jpg", type: "image", width: "w-30 md:w-40", height: "h-[70%]", offset: "mt-[16%]" },
  { id: 24, ext: "JPG", type: "image", width: "w-36 md:w-48", height: "h-[88%]", offset: "mt-[6%]" },
  // ROLL VIDEO 4
  { id: "Mroll4", ext: "mp4", type: "video", width: "w-32 md:w-44", height: "h-[78%]", offset: "mt-[11%]" },
  { id: 12, ext: "jpg", type: "image", width: "w-28 md:w-36", height: "h-[80%]", offset: "mt-[10%]" },
  { id: 13, ext: "jpg", type: "image", width: "w-40 md:w-52", height: "h-[73%]", offset: "mt-[14%]" },
  { id: 14, ext: "jpg", type: "image", width: "w-32 md:w-40", height: "h-[95%]", offset: "mt-[2%]" },
  { id: 15, ext: "jpg", type: "image", width: "w-36 md:w-48", height: "h-[68%]", offset: "mt-[18%]" },
  { id: 16, ext: "jpg", type: "image", width: "w-28 md:w-36", height: "h-[85%]", offset: "mt-[8%]" },
  { id: 17, ext: "jpg", type: "image", width: "w-32 md:w-44", height: "h-[78%]", offset: "mt-[12%]" },
  { id: 18, ext: "jpg", type: "image", width: "w-36 md:w-48", height: "h-[90%]", offset: "mt-[5%]" },
];

const recentEvents = [
  { id: 1, date: "12.21.25", type: "NIGHT MEET", location: "DENVER", status: "PRIVATE" },
  { id: 2, date: "12.22.25", type: "PRIVATE", location: "TBA", status: "INVITE ONLY" },
];

// Stats data
const stats = [
  { label: "MEMBERS", value: 130, suffix: "+" },
  { label: "EVENTS", value: 47, suffix: "" },
  { label: "BUILDS", value: 70, suffix: "+" },
];

// Featured builds
const featuredBuilds = [
  { id: 1, name: "800HP Supra", owner: "@turbo_mike", image: 1 },
  { id: 2, name: "Twin Turbo 370Z", owner: "@z_nation", image: 4 },
  { id: 3, name: "Built STI", owner: "@subie_sean", image: 7 },
];

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!hasStarted) return;
    
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, hasStarted]);

  return { count, startCounter: () => setHasStarted(true) };
}

// Countdown timer component
function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-4 justify-center">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="text-center">
          <div className="text-3xl md:text-5xl font-bold font-mono text-white tabular-nums">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-xs text-white/30 uppercase tracking-widest mt-1">{label}</div>
        </div>
      ))}
    </div>
  );
}

// Stats counter component
function StatCounter({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const { count, startCounter } = useCounter(value);
  
  useEffect(() => {
    const timer = setTimeout(startCounter, 500);
    return () => clearTimeout(timer);
  }, [startCounter]);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-6xl font-bold font-mono gradient-text">
        {count}{suffix}
      </div>
      <div className="text-xs text-white/40 uppercase tracking-[0.3em] mt-2">{label}</div>
    </div>
  );
}

// Draggable scroll hook - real physics with velocity tracking
function useDraggableScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const animationRef = useRef<number>();
  const [isDragging, setIsDragging] = useState(false);

  // Track velocity over last few frames for accuracy
  const velocityHistoryRef = useRef<number[]>([]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    lastXRef.current = e.pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    velocityHistoryRef.current = [];
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    ref.current.style.animationPlayState = 'paused';
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current || !ref.current) return;
    e.preventDefault();
    
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    const dx = e.pageX - lastXRef.current;
    
    // Direct scroll - 1:1 with finger
    ref.current.scrollLeft -= dx;
    
    // Calculate instantaneous velocity (pixels per ms)
    if (dt > 0) {
      const instantVelocity = dx / dt;
      velocityHistoryRef.current.push(instantVelocity);
      // Keep last 5 samples
      if (velocityHistoryRef.current.length > 5) {
        velocityHistoryRef.current.shift();
      }
    }
    
    lastXRef.current = e.pageX;
    lastTimeRef.current = now;
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    if (!ref.current) return;
    
    // Average velocity from history for smoother release
    const avgVelocity = velocityHistoryRef.current.length > 0
      ? velocityHistoryRef.current.reduce((a, b) => a + b, 0) / velocityHistoryRef.current.length
      : 0;
    
    // Convert to momentum - faster flick = more momentum
    let momentum = avgVelocity * 20; // Scale factor for feel
    const friction = 0.97; // Higher = longer coast
    
    const coast = () => {
      if (!ref.current || Math.abs(momentum) < 0.5) {
        if (ref.current) {
          setTimeout(() => {
            if (ref.current) ref.current.style.animationPlayState = 'running';
          }, 500);
        }
        return;
      }
      ref.current.scrollLeft -= momentum;
      momentum *= friction;
      animationRef.current = requestAnimationFrame(coast);
    };
    
    if (Math.abs(momentum) > 1) {
      coast();
    } else {
      setTimeout(() => {
        if (ref.current) ref.current.style.animationPlayState = 'running';
      }, 500);
    }
  }, []);

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!ref.current) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    lastXRef.current = e.touches[0].pageX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    velocityHistoryRef.current = [];
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    ref.current.style.animationPlayState = 'paused';
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingRef.current || !ref.current) return;
    
    const now = performance.now();
    const dt = now - lastTimeRef.current;
    const dx = e.touches[0].pageX - lastXRef.current;
    
    // Direct scroll - 1:1 with finger
    ref.current.scrollLeft -= dx;
    
    // Calculate instantaneous velocity
    if (dt > 0) {
      const instantVelocity = dx / dt;
      velocityHistoryRef.current.push(instantVelocity);
      if (velocityHistoryRef.current.length > 5) {
        velocityHistoryRef.current.shift();
      }
    }
    
    lastXRef.current = e.touches[0].pageX;
    lastTimeRef.current = now;
  }, []);

  const handleTouchEnd = useCallback(() => {
    handleMouseUp();
  }, [handleMouseUp]);

  return {
    ref,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }
  };
}

export default function Home() {
  // Next event date (Dec 21, 2025)
  const nextEventDate = new Date('2025-12-21T20:00:00');
  
  // Draggable scroll for collage
  const { ref: collageRef, isDragging, handlers } = useDraggableScroll();

  return (
    <div className="min-h-screen relative">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />
      

      {/* Hero with Background */}
      <section className="min-h-screen pt-24 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/collage/Banner.png"
            alt=""
            fill
            className="object-cover object-center grayscale"
            style={{ opacity: 0.25 }}
            priority
            unoptimized
          />
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-spades-black via-spades-black/60 to-spades-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-spades-black/50 via-transparent to-spades-black/50" />
          
          {/* Subtle smoke particles drifting */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Smoke wisps - more visible */}
            <div className="absolute right-[15%] top-[25%] w-48 h-48 bg-white/[0.08] rounded-full blur-3xl animate-smoke-drift-1" />
            <div className="absolute right-[22%] top-[35%] w-36 h-36 bg-white/[0.06] rounded-full blur-2xl animate-smoke-drift-2" />
            <div className="absolute right-[10%] top-[30%] w-56 h-56 bg-white/[0.05] rounded-full blur-3xl animate-smoke-drift-3" />
            
            {/* Rubber particles - larger and more visible */}
            <div className="absolute right-[18%] bottom-[30%] w-2 h-2 bg-white/20 rounded-full animate-rubber-float-1" />
            <div className="absolute right-[14%] bottom-[35%] w-1.5 h-1.5 bg-white/15 rounded-full animate-rubber-float-2" />
            <div className="absolute right-[22%] bottom-[28%] w-2.5 h-2.5 bg-white/12 rounded-full animate-rubber-float-3" />
            <div className="absolute right-[16%] bottom-[32%] w-1 h-1 bg-white/18 rounded-full animate-rubber-float-4" />
            <div className="absolute right-[12%] bottom-[30%] w-2 h-2 bg-white/10 rounded-full animate-rubber-float-5" />
            <div className="absolute right-[20%] bottom-[26%] w-1.5 h-1.5 bg-white/14 rounded-full animate-rubber-float-1" style={{ animationDelay: '-8s' }} />
            <div className="absolute right-[10%] bottom-[34%] w-1 h-1 bg-white/16 rounded-full animate-rubber-float-3" style={{ animationDelay: '-12s' }} />
            
            {/* Amber sparks/flames */}
            <div className="absolute right-[19%] bottom-[28%] w-1 h-1 bg-amber-500/60 rounded-full animate-spark-1 blur-[1px]" />
            <div className="absolute right-[15%] bottom-[32%] w-1.5 h-1.5 bg-orange-400/50 rounded-full animate-spark-2 blur-[1px]" />
            <div className="absolute right-[21%] bottom-[30%] w-0.5 h-0.5 bg-yellow-400/70 rounded-full animate-spark-3" />
            <div className="absolute right-[17%] bottom-[26%] w-1 h-1 bg-amber-400/55 rounded-full animate-spark-4 blur-[0.5px]" />
            <div className="absolute right-[13%] bottom-[29%] w-0.5 h-0.5 bg-orange-500/60 rounded-full animate-spark-5" />
            <div className="absolute right-[23%] bottom-[33%] w-1 h-1 bg-yellow-500/45 rounded-full animate-spark-1 blur-[1px]" style={{ animationDelay: '-4s' }} />
            <div className="absolute right-[11%] bottom-[31%] w-1.5 h-1.5 bg-amber-500/40 rounded-full animate-spark-3" style={{ animationDelay: '-7s' }} />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full flex flex-col items-center justify-center">
          {/* Main title - clean, bold, impactful */}
          <div className="relative">
            <h1 
              className="text-white font-black italic tracking-tight leading-none text-center select-none"
              style={{ 
                fontSize: 'clamp(48px, 9vw, 160px)',
                fontWeight: 900,
              }}
            >
              SPADES PERFORMANCE
            </h1>
            {/* Gradient underline - fades from right to left */}
            <div 
              className="absolute left-[15%] right-[15%] h-[2px] mt-2"
              style={{ 
                background: 'linear-gradient(to left, rgba(255,255,255,0.8), rgba(255,255,255,0))',
              }}
            />
          </div>
 
          {/* Tagline - simple, understated */}
          <p className="text-white/50 text-sm md:text-base tracking-[0.2em] mt-6 italic">
            Colorado's Fastest.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              href="/events"
              className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-wider text-sm overflow-hidden transition-all hover:scale-105"
            >
              <span className="relative z-10">View Events</span>
              <div className="absolute inset-0 bg-spades-gold transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link
              href="/garage"
              className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:bg-white/5 hover:border-white/40 transition-all"
            >
              Browse Builds
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 relative border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-spades-black via-spades-dark to-spades-black" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Film Strip Collage - Staggered with gaps + Draggable */}
      <section className="w-full overflow-hidden py-12 bg-spades-black">
        <div 
          ref={collageRef}
          {...handlers}
          className={`flex items-end gap-3 md:gap-4 h-[55vh] md:h-[75vh] animate-scroll-slow px-4 overflow-x-auto scrollbar-hide ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: isDragging ? 'auto' : 'smooth' }}
        >
          {collageImages.map((img, index) => (
            <div
              key={img.id}
              className={`${img.width} ${img.height} ${img.offset} flex-shrink-0 relative overflow-hidden rounded-sm group`}
              style={{
                transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {img.type === "video" ? (
                <video
                  src={`/images/collage/${img.id}.${img.ext}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <Image
                  src={`/images/collage/${img.id}.${img.ext}`}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  quality={100}
                  unoptimized
                />
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              {/* Bottom fade */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {collageImages.map((img, index) => (
            <div
              key={`dup-${img.id}`}
              className={`${img.width} ${img.height} ${img.offset} flex-shrink-0 relative overflow-hidden rounded-sm group`}
              style={{
                transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            >
              {img.type === "video" ? (
                <video
                  src={`/images/collage/${img.id}.${img.ext}`}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <Image
                  src={`/images/collage/${img.id}.${img.ext}`}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  quality={100}
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          ))}
        </div>
      </section>

      {/* Next Event Countdown */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[600px] h-[600px] bg-spades-gold/5 rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-xs text-spades-gold/60 font-mono mb-4 tracking-[0.3em] uppercase">Next Event</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-2">NIGHT MEET</h3>
          <p className="text-white/40 mb-10 font-mono">December 21, 2025 • Denver, CO</p>
          
          <CountdownTimer targetDate={nextEventDate} />
          
          <div className="mt-12">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-spades-gold hover:text-spades-gold/80 transition-colors font-mono text-sm"
            >
              <span>View Details</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Builds */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-xs text-white/30 font-mono mb-2 tracking-[0.3em] uppercase">From the Garage</h2>
              <h3 className="text-3xl md:text-4xl font-bold">Featured Builds</h3>
            </div>
            <Link
              href="/garage"
              className="text-sm text-white/40 hover:text-white/60 transition-colors font-mono"
            >
              View all →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {featuredBuilds.map((build, index) => (
              <Link
                key={build.id}
                href="/garage"
                className={`group relative aspect-[4/5] overflow-hidden rounded-lg card-hover stagger-${index + 1}`}
                style={{ animationFillMode: 'both' }}
              >
                <Image
                  src={`/images/collage/${build.image}.jpg`}
                  alt={build.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h4 className="text-xl font-bold mb-1 group-hover:text-spades-gold transition-colors">
                    {build.name}
                  </h4>
                  <p className="text-white/50 text-sm font-mono">{build.owner}</p>
                </div>
                
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/0 group-hover:border-spades-gold transition-colors duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Event Log */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs text-white/30 font-mono mb-8 tracking-widest">UPCOMING</h2>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <Link
                key={event.id}
                href="/events"
                className="block py-6 px-6 border border-white/5 rounded-lg hover:border-white/10 hover:bg-white/[0.02] transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 font-mono text-sm">
                    <span className="text-2xl font-bold text-white/80">{event.date}</span>
                    <span className="text-white/20">|</span>
                    <span className="text-white/60 uppercase tracking-wider">{event.type}</span>
                    <span className="text-white/20">|</span>
                    <span className="text-white/40">{event.location}</span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/40 group-hover:bg-spades-gold/10 group-hover:text-spades-gold transition-colors">
                    {event.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/events"
            className="block text-center mt-8 text-sm text-white/30 hover:text-white/50 transition-colors font-mono"
          >
            All events →
          </Link>
        </div>
      </section>

      {/* Access Tiers */}
      <section className="py-24 px-4 border-t border-white/5 relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-spades-gold/5 rounded-full blur-[120px]" />
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-xs text-white/30 font-mono mb-4 tracking-[0.3em] uppercase">Membership</h2>
            <h3 className="text-3xl md:text-4xl font-bold">Access Levels</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Nobody */}
            <div className="text-center p-8 bg-white/[0.02] border border-white/5 rounded-xl card-hover">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <SpadeIcon className="w-6 h-6 text-white/30" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white/50">Nobody</h3>
              <p className="text-xs text-white/30 mb-8 uppercase tracking-wider">Public access</p>
              <ul className="text-sm text-white/40 space-y-3">
                <li className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  View events
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  Browse media
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  See partners
                </li>
              </ul>
            </div>

            {/* Member - Featured */}
            <div className="text-center p-8 bg-white/[0.03] border border-white/10 rounded-xl card-hover relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-full">
                Most Common
              </div>
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center">
                <SpadeIcon className="w-6 h-6 text-white/60" />
              </div>
              <h3 className="text-xl font-bold mb-2">Member</h3>
              <p className="text-xs text-white/30 mb-8 uppercase tracking-wider">Invite only</p>
              <ul className="text-sm text-white/50 space-y-3">
                <li className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-white/40 rounded-full" />
                  RSVP to meets
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-white/40 rounded-full" />
                  Post builds
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-white/40 rounded-full" />
                  Marketplace access
                </li>
              </ul>
            </div>

            {/* Verified */}
            <div className="text-center p-8 bg-spades-gold/[0.03] border border-spades-gold/20 rounded-xl card-hover animate-gold-glow">
              <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="w-10 h-10" aria-hidden="true">
                  {/* Chalky circle */}
                  <circle 
                    cx="16" 
                    cy="16" 
                    r="14" 
                    fill="none" 
                    stroke="#d4af37" 
                    strokeWidth="2.5"
                    style={{ filter: 'url(#chalk)' }}
                  />
                  {/* Chalky yellow checkmark */}
                  <path 
                    d="M9 16L14 21L23 11" 
                    fill="none" 
                    stroke="#d4af37" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ filter: 'url(#chalk)' }}
                  />
                  <defs>
                    <filter id="chalk" x="-20%" y="-20%" width="140%" height="140%">
                      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise"/>
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
                    </filter>
                  </defs>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-spades-gold">Verified</h3>
              <p className="text-xs text-spades-gold/50 mb-8 uppercase tracking-wider">Earned</p>
              <ul className="text-sm text-white/50 space-y-3">
                <li className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-spades-gold/60 rounded-full" />
                  Private locations
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-spades-gold/60 rounded-full" />
                  Early access
                </li>
                <li className="flex items-center justify-center gap-2">
                  <span className="w-1 h-1 bg-spades-gold/60 rounded-full" />
                  Partner codes
                </li>
              </ul>
            </div>
          </div>
          
          <p className="text-center text-sm text-white/30 mt-12 font-mono">
            Show up <span className="text-spades-gold">3+ times</span> to earn verified status.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 border-t border-white/5 relative overflow-hidden">
        
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Ready to <span className="gradient-text">Join?</span>
          </h2>
          <p className="text-white/40 mb-10 text-lg">
            Know someone on the team? Get them to vouch for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/join"
              className="px-8 py-4 bg-spades-gold text-black font-bold uppercase tracking-wider text-sm hover:bg-spades-gold/90 transition-all hover:scale-105"
            >
              Request Access
            </Link>
            <Link
              href="/rules"
              className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider text-sm hover:bg-white/5 transition-all"
            >
              Read the Rules
            </Link>
          </div>
        </div>
      </section>

      {/* Minimal Footer spacer */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <SpadeIcon className="w-8 h-8 mx-auto mb-4 text-white/10 spade-glow" />
          <p className="text-xs text-white/20 font-mono tracking-widest">INVITE ONLY</p>
        </div>
      </section>
    </div>
  );
}
