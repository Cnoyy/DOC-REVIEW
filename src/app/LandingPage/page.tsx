"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  Menu, X, Upload, Brain, FileText, CheckCircle2, Shield, Eye, 
  BarChart3, Database, Workflow, Terminal, Network, ArrowRight, 
  Cpu, Compass, Lock, Zap, FileSpreadsheet, Server, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { DocReviewLogo } from "@/components/dashboard/logo";

const TOTAL_FRAMES = 240;

const SCENES = [
  {
    title: "Ingest & Centralize Multi-Format Information",
    subtitle: "Streamline raw document ingestion from emails, databases, scans, and cloud storage. Our AI-driven pipelines extract raw text, metadata, and visual structures instantly, breaking down data silos across your organization.",
    phase: "PHASE 01 // COGNITIVE DATA CAPTURE"
  },
  {
    title: "Intelligent Semantic Understanding",
    subtitle: "Harness deep neural networks to automatically classify document types, map complex fields, and analyze natural language with human-like precision. Extract tables, signatures, and nested variables with zero manual effort.",
    phase: "PHASE 02 // COGNITIVE UNDERSTANDING"
  },
  {
    title: "Connect & Synthesize Enterprise Knowledge",
    subtitle: "Bridge the gaps between thousands of legacy reports, PDFs, and legal sheets. Build a unified semantic intelligence graph that maps relationships, identifies patterns, and unifies fragmented datasets.",
    phase: "PHASE 03 // SEMANTIC KNOWLEDGE MAP"
  },
  {
    title: "Real-Time Analytical Intelligence",
    subtitle: "Translate complex unstructured data into direct executive decisions. Interactive analytics, system health indicators, and key metric dashboards update dynamically as incoming workflows are processed.",
    phase: "PHASE 04 // STRATEGIC INSIGHTS"
  },
  {
    title: "Automate Workflow Execution",
    subtitle: "Seamlessly deliver validated data, structured audits, and cognitive insights to your downstream CRM, ERP, and API endpoints. Enable end-to-end automation with enterprise-grade security and speed.",
    phase: "PHASE 05 // ACTIONABLE TRANSFORMATION"
  }
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroContainerRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const renderFrameRef = useRef<(idx: number) => void>(() => {});

  const scrollProgress = (currentFrame - 1) / (TOTAL_FRAMES - 1);
  const activeSceneIndex = Math.min(
    SCENES.length - 1,
    Math.floor(scrollProgress * SCENES.length)
  );

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setAnimationComplete(true);
    setCurrentFrame(TOTAL_FRAMES);
    setIsMenuOpen(false);

    // Sync scroll position instantly past the threshold, then scroll smoothly to section
    window.scrollTo(0, window.innerHeight * 2.5);
    
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  // Preload Images
  useEffect(() => {
    let active = true;
    const preloadFirstFrames = 20;

    // Preload first frames urgently
    for (let i = 1; i <= preloadFirstFrames; i++) {
      const img = new Image();
      img.src = `/images/ezgif-frame-${String(i).padStart(3, "0")}.png`;
      img.onload = () => {
        if (!active) return;
        imagesRef.current[i] = img;
        setLoadedCount(prev => prev + 1);
        if (i === 1) {
          // Render initial frame immediately
          renderFrameRef.current(1);
        }
      };
    }

    // Preload remaining frames in background
    for (let i = preloadFirstFrames + 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/images/ezgif-frame-${String(i).padStart(3, "0")}.png`;
      img.onload = () => {
        if (!active) return;
        imagesRef.current[i] = img;
        setLoadedCount(prev => prev + 1);
      };
    }

    return () => {
      active = false;
    };
  }, []);

  // Frame search fallback logic (finds nearest loaded image)
  const getNearestFrame = (index: number): HTMLImageElement | null => {
    if (imagesRef.current[index]) return imagesRef.current[index];

    let step = 1;
    while (step < TOTAL_FRAMES) {
      const prev = index - step;
      const next = index + step;
      if (prev >= 1 && imagesRef.current[prev]) return imagesRef.current[prev];
      if (next <= TOTAL_FRAMES && imagesRef.current[next]) return imagesRef.current[next];
      step++;
    }
    return null;
  };

  // Canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderFrame = (idx: number) => {
      const img = getNearestFrame(idx);
      if (!img || !ctx || !canvas) return;

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgWidth = img.width;
      const imgHeight = img.height;

      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      const x = (canvasWidth - imgWidth * scale) / 2;
      const y = (canvasHeight - imgHeight * scale) / 2;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
    };

    renderFrameRef.current = renderFrame;

    // Initial resize using viewport width and height to prevent 0-sized client rects during hydration
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      
      // Re-draw current frame
      const heroContainer = heroContainerRef.current;
      if (heroContainer) {
        const heroRect = heroContainer.getBoundingClientRect();
        const height = heroRect.height - window.innerHeight;
        const progress = Math.max(0, Math.min(1, -heroRect.top / height));
        const idx = Math.floor(progress * (TOTAL_FRAMES - 1)) + 1;
        renderFrame(idx);
      } else {
        renderFrame(1);
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Track current frame in ref to avoid stale closures in event listeners
  const currentFrameRef = useRef(1);
  useEffect(() => {
    currentFrameRef.current = currentFrame;
  }, [currentFrame]);

  // Synchronous ref-state syncing for scroll locking
  const animationCompleteRef = useRef(false);
  const [animationComplete, setAnimationCompleteState] = useState(false);
  const setAnimationComplete = (val: boolean) => {
    animationCompleteRef.current = val;
    setAnimationCompleteState(val);
  };

  // Re-draw frame when images load or currentFrame changes to solve mounting race conditions
  useEffect(() => {
    if (renderFrameRef.current) {
      renderFrameRef.current(currentFrame);
    }
  }, [currentFrame, loadedCount]);

  // Scroll handler for Header solid styling & native scroll-progress frame syncing
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Header solid styling on scroll
      if (scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Calculate frame progress based on scroll range (threshold is 2.5 * window.innerHeight)
      const threshold = window.innerHeight * 2.5;

      if (!animationCompleteRef.current) {
        const progress = Math.min(1, Math.max(0, scrollY / threshold));
        setCurrentFrame(Math.floor(progress * (TOTAL_FRAMES - 1)) + 1);

        if (progress >= 0.99) {
          setAnimationComplete(true);
        }
      } else {
        // If they scroll back above the threshold, lock to frames again
        if (scrollY < threshold - 20) {
          setAnimationComplete(false);
          const progress = Math.min(1, Math.max(0, scrollY / threshold));
          setCurrentFrame(Math.floor(progress * (TOTAL_FRAMES - 1)) + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const totalPercentageLoaded = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));

  return (
    <div className="cinematic-theme min-h-screen text-slate-100 relative selection:bg-cyan-500 selection:text-black">
      {/* Background radial glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/10 animate-pulse-glow z-0"></div>
        <div className="absolute top-[60%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-cyan-900/10 animate-pulse-glow z-0" style={{ animationDelay: "-3s" }}></div>
      </div>

      {/* 1. Header Section */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled 
          ? "py-3 bg-slate-950/80 backdrop-blur-xl border-slate-800/80 shadow-lg shadow-black/30" 
          : "py-6 bg-transparent border-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
          <DocReviewLogo destination="/" />

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#process" onClick={(e) => handleNavLinkClick(e, "process")} className="hover:text-cyan-400 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-cyan-400 hover:after:w-full after:transition-all">AI Process</a>
            <a href="#features" onClick={(e) => handleNavLinkClick(e, "features")} className="hover:text-cyan-400 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-cyan-400 hover:after:w-full after:transition-all">Capabilities</a>
            <a href="#automation" onClick={(e) => handleNavLinkClick(e, "automation")} className="hover:text-cyan-400 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-cyan-400 hover:after:w-full after:transition-all">Workflows</a>
            <a href="#analytics" onClick={(e) => handleNavLinkClick(e, "analytics")} className="hover:text-cyan-400 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-cyan-400 hover:after:w-full after:transition-all">Analytics</a>
            <a href="#benefits" onClick={(e) => handleNavLinkClick(e, "benefits")} className="hover:text-cyan-400 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-cyan-400 hover:after:w-full after:transition-all">Benefits</a>
          </nav>

          {/* Desktop Call to Action */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/Auth/Login" className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors">
              Sign In
            </Link>
            <Button
              variant="mybutton"
              className="px-6 py-2.5 rounded-full font-bold text-xs active:translate-y-[1px] transition-all"
              asChild
            >
              <Link href="/Auth/Register">Request Demo</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-slate-950/95 border-b border-slate-800 p-6 flex flex-col gap-5 md:hidden shadow-2xl backdrop-blur-2xl">
            <nav className="flex flex-col gap-4 text-base font-semibold text-slate-300">
              <a href="#process" onClick={(e) => handleNavLinkClick(e, "process")} className="hover:text-cyan-400">AI Process</a>
              <a href="#features" onClick={(e) => handleNavLinkClick(e, "features")} className="hover:text-cyan-400">Capabilities</a>
              <a href="#automation" onClick={(e) => handleNavLinkClick(e, "automation")} className="hover:text-cyan-400">Workflows</a>
              <a href="#analytics" onClick={(e) => handleNavLinkClick(e, "analytics")} className="hover:text-cyan-400">Analytics</a>
              <a href="#benefits" onClick={(e) => handleNavLinkClick(e, "benefits")} className="hover:text-cyan-400">Benefits</a>
            </nav>
            <div className="h-[1px] bg-slate-800 w-full"></div>
            <div className="flex flex-col gap-3">
              <Link href="/Auth/Login" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-3 text-slate-300 border border-slate-800 hover:bg-slate-900 rounded-xl transition-colors font-semibold">
                Sign In
              </Link>
              <Button
                variant="mybutton"
                className="w-full py-6 rounded-xl font-bold"
                asChild
              >
                <Link href="/Auth/Register" onClick={() => setIsMenuOpen(false)}>Request Demo</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section (with Scroll-driven Canvas animation) */}
      <section ref={heroContainerRef} className="relative h-[350vh] bg-slate-950 z-10">
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex flex-col justify-between">
          
          {/* Hardware accelerated canvas back layer */}
          <div className="absolute inset-0 w-full h-full z-0 bg-black">
            <canvas ref={canvasRef} className="w-full h-full object-cover opacity-80" />
            {/* Cinematic scanlines and dark vignette overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80 pointer-events-none"></div>
            <div className="absolute inset-0 bg-radial-gradient(ellipse_at_center,transparent_40%,rgba(3,7,18,0.7)) pointer-events-none"></div>
          </div>

          {/* Progressive Loading Indicator */}
          <div className="relative max-w-7xl mx-auto px-6 md:px-8 pt-28 w-full z-20 flex justify-end items-start pointer-events-none">
            {/* Elegant futuristic download ticker */}
            {totalPercentageLoaded < 100 && (
              <div className="font-mono text-[10px] text-slate-400 flex items-center gap-2 bg-slate-950/40 backdrop-blur-md px-3 py-1 rounded-full border border-slate-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-soft"></span>
                <span>DOWNLOADING NEURAL CORES: {totalPercentageLoaded}%</span>
              </div>
            )}
          </div>

          {/* Elegantly positioned Editorial Text content (Top-left area) */}
          <div className="relative max-w-7xl mx-auto px-6 md:px-8 w-full flex-1 flex flex-col justify-start py-12 z-20 pointer-events-none">
            
            {/* Top-Left Main Heading */}
            <div className="max-w-2xl self-start mt-6 flex flex-col gap-4">
              {/* Scene Indicator Phase Tag */}
              <div 
                key={`phase-${activeSceneIndex}`} 
                className="text-cyan-400 font-mono text-xs tracking-widest animate-fade-in-up uppercase font-semibold"
              >
                {SCENES[activeSceneIndex].phase}
              </div>
              {/* Dynamic Title with blur reveal */}
              <h1 
                key={`title-${activeSceneIndex}`} 
                className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white animate-fade-in-up"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
              >
                {SCENES[activeSceneIndex].title}
              </h1>
              {/* Dynamic Professional Subtitle/Description with cascaded standard animation */}
              <p 
                key={`desc-${activeSceneIndex}`} 
                className="text-slate-300/90 text-sm md:text-base leading-relaxed max-w-xl animate-fade-in-up"
                style={{ 
                  animationDelay: "0.15s",
                  textShadow: "0 1px 5px rgba(0,0,0,0.4)" 
                }}
              >
                {SCENES[activeSceneIndex].subtitle}
              </p>
            </div>
          </div>

          {/* Scroll to Explore Hint */}
          <div 
            className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-slate-400 font-mono text-[9px] tracking-widest transition-all duration-700 pointer-events-none ${
              currentFrame > 15 ? "opacity-0 translate-y-4" : "opacity-70"
            }`}
          >
            <span className="animate-pulse">SCROLL TO EXPLORE</span>
            <ChevronRight className="w-3.5 h-3.5 rotate-90 text-cyan-400 animate-bounce" />
          </div>

          {/* Bottom Glowing Border */}
          <div className="w-full h-8 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none"></div>
        </div>
      </section>

      {/* Scroll Completed revealed contents */}
      <div 
        className={`transition-all duration-700 ease-out origin-top ${
          animationComplete 
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-30 translate-y-8 pointer-events-none"
        }`}
      >
        {/* 3. AI Processing Section */}
        <section id="process" className="relative bg-slate-950 py-32 px-6 border-b border-slate-900 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-800/30">Intelligence Pipeline</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">The Neural Processing Engine</h2>
            <p className="text-slate-400 text-sm md:text-base mt-4 leading-relaxed">Observe how our cognitive workflow ingest, reads, processes, extracts, and delivers information directly to your business stack.</p>
          </div>

          {/* Dynamic pipeline timeline steps with SVG connectors */}
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 gap-y-16">
            
            {/* SVG Connecting path lines (visible on desktop) */}
            <div className="hidden md:block absolute top-[50px] left-[10%] right-[10%] h-[2px] z-0 pointer-events-none">
              <svg className="w-full h-full overflow-visible" fill="none">
                <path d="M 0 0 L 800 0" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="2" />
                <path d="M 0 0 L 800 0" stroke="url(#cyan-grad)" strokeWidth="2" className="animated-path" />
                <defs>
                  <linearGradient id="cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Step 1 */}
            <div className="glass-panel p-8 rounded-2xl relative z-10 flex flex-col gap-4 group hover:-translate-y-2">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors duration-300">
                <Upload className="w-6 h-6" />
              </div>
              <div className="absolute top-4 right-6 font-mono text-xs text-slate-700 font-bold group-hover:text-cyan-500/30 transition-colors">STEP 01</div>
              <h3 className="text-lg font-bold text-white mt-2">Upload Documents</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Drop folders, APIs, or emails containing PDFs, images, spreadsheets, and scanned documents securely into the portal.</p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-8 rounded-2xl relative z-10 flex flex-col gap-4 group hover:-translate-y-2">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-black transition-colors duration-300">
                <Brain className="w-6 h-6" />
              </div>
              <div className="absolute top-4 right-6 font-mono text-xs text-slate-700 font-bold group-hover:text-blue-500/30 transition-colors">STEP 02</div>
              <h3 className="text-lg font-bold text-white mt-2">AI Analysis</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Our advanced vision models read the visual layers, layout, text structures, and hidden hierarchies of every page.</p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-8 rounded-2xl relative z-10 flex flex-col gap-4 group hover:-translate-y-2">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-black transition-colors duration-300">
                <FileText className="w-6 h-6" />
              </div>
              <div className="absolute top-4 right-6 font-mono text-xs text-slate-700 font-bold group-hover:text-indigo-500/30 transition-colors">STEP 03</div>
              <h3 className="text-lg font-bold text-white mt-2">Data Extraction</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Identify key-value pairs, recursive tables, invoice line items, dates, and signee metadata with near-zero error margins.</p>
            </div>

            {/* Step 4 */}
            <div className="glass-panel p-8 rounded-2xl relative z-10 flex flex-col gap-4 group hover:-translate-y-2">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-black transition-colors duration-300">
                <Compass className="w-6 h-6" />
              </div>
              <div className="absolute top-4 right-6 font-mono text-xs text-slate-700 font-bold group-hover:text-purple-500/30 transition-colors">STEP 04</div>
              <h3 className="text-lg font-bold text-white mt-2">Classification</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Smart algorithms categorize files into proper buckets (agreements, taxes, bank logs) automatically matching tax laws.</p>
            </div>

            {/* Step 5 */}
            <div className="glass-panel p-8 rounded-2xl relative z-10 flex flex-col gap-4 group hover:-translate-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors duration-300">
                <Network className="w-6 h-6" />
              </div>
              <div className="absolute top-4 right-6 font-mono text-xs text-slate-700 font-bold group-hover:text-emerald-500/30 transition-colors">STEP 05</div>
              <h3 className="text-lg font-bold text-white mt-2">Knowledge Generation</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Synthesize context across multiple sources to assemble a searchable repository, answering complex business queries.</p>
            </div>

            {/* Step 6 */}
            <div className="glass-panel p-8 rounded-2xl relative z-10 flex flex-col gap-4 group hover:-translate-y-2">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors duration-300">
                <Workflow className="w-6 h-6" />
              </div>
              <div className="absolute top-4 right-6 font-mono text-xs text-slate-700 font-bold group-hover:text-cyan-500/30 transition-colors">STEP 06</div>
              <h3 className="text-lg font-bold text-white mt-2">Workflow Automation</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Push clean structured files to Salesforce, NetSuite, SAP, and trigger alerts or approvals with zero manual touchpoints.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="relative bg-slate-900 py-32 px-6 border-b border-slate-950 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20">
            <div className="max-w-xl">
              <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-800/30">System Features</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">Enterprise Cognitive Capabilities</h2>
            </div>
            <p className="text-slate-400 text-sm md:text-base max-w-sm mt-4 md:mt-0 leading-relaxed">Unprecedented accuracy, instant responsiveness, and compliance-level security engineered for global enterprise scales.</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 glow-card-border hover:translate-y-[-4px]">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Intelligent IDP</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Process millions of complex layout variations with layout-agnostic cognitive neural networks.</p>
            </div>

            {/* Card 2 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 glow-card-border hover:translate-y-[-4px]">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">OCR & Data Extraction</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Extract text from low-res PDFs, handwritten notes, and skewed documents with near-perfect reliability.</p>
            </div>

            {/* Card 3 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 glow-card-border hover:translate-y-[-4px]">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">AI Summarization</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Condense 200-page lease agreements or audit histories into actionable executive bullet summaries.</p>
            </div>

            {/* Card 4 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 glow-card-border hover:translate-y-[-4px]">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Semantic Search</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Ask questions in natural phrasing like "Which leases require landlord permission for repair works?"</p>
            </div>

            {/* Card 5 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 glow-card-border hover:translate-y-[-4px]">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Knowledge Graph</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Graph connections across contracts, vendors, and invoices to automatically isolate duplicate charges.</p>
            </div>

            {/* Card 6 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 glow-card-border hover:translate-y-[-4px]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Workflow className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Workflow Automation</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Auto-forward extracted data directly into core databases, ERP systems, or trigger validation flows.</p>
            </div>

            {/* Card 7 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 glow-card-border hover:translate-y-[-4px]">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Enterprise Security</h3>
              <p className="text-slate-400 text-xs leading-relaxed">SOC2 Type II compliant, AES-256 data encryption at rest and transit, with custom isolated client tenants.</p>
            </div>

            {/* Card 8 */}
            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 glow-card-border hover:translate-y-[-4px]">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Compliance Audit</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Continuous audit trail recording all human-in-the-loop decisions, validations, and exports.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Workflow Automation Section */}
      <section id="automation" className="relative bg-slate-950 py-32 px-6 border-b border-slate-900 z-20 overflow-hidden">
        
        {/* Glow behind the flow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-800/30">End-to-End Orchestration</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">System Connectivity Pipeline</h2>
            <p className="text-slate-400 text-sm md:text-base mt-4 leading-relaxed">Connect files directly to operational tools. Let the AI orchestrate workflows while syncing your business systems instantly.</p>
          </div>

          {/* Interactive SVG Connector Flow Graph */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-slate-900/40 border border-slate-800/50 backdrop-blur-md p-10 rounded-3xl relative">
            
            {/* Box 1: Sources */}
            <div className="w-full lg:w-[280px] flex flex-col gap-4">
              <div className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-1">INPUT CHANNELS</div>
              
              <div className="glass-panel p-4 rounded-xl flex items-center gap-4 bg-slate-950/60 border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Legal Contracts</h4>
                  <p className="text-[10px] text-slate-500">PDF, DOCX format</p>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl flex items-center gap-4 bg-slate-950/60 border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Financial Invoices</h4>
                  <p className="text-[10px] text-slate-500">CSV, XLSX sheets</p>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl flex items-center gap-4 bg-slate-950/60 border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">API Data Logs</h4>
                  <p className="text-[10px] text-slate-500">Structured JSON feeds</p>
                </div>
              </div>
            </div>

            {/* Connecting SVG Path 1 */}
            <div className="hidden lg:block w-20 h-20 relative">
              <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
                <path d="M 0 40 L 80 40" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="3" />
                <path d="M 0 40 L 80 40" stroke="#06b6d4" strokeWidth="3" className="animated-path" />
                <polygon points="75,36 80,40 75,44" fill="#06b6d4" />
              </svg>
            </div>

            {/* Box 2: Core AI Engine */}
            <div className="w-full lg:w-[320px] glass-panel p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-cyan-500/30 flex flex-col items-center text-center relative shadow-2xl shadow-cyan-500/5">
              <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 opacity-40 blur-md pointer-events-none"></div>
              
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 mb-6">
                <Cpu className="w-8 h-8 text-black" />
                <div className="absolute inset-0 rounded-2xl bg-cyan-400 opacity-20 blur-md animate-pulse-soft"></div>
              </div>

              <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase mb-1">COGNITIVE ENGINE</span>
              <h3 className="text-lg font-bold text-white">DocReview AI V4</h3>
              <p className="text-slate-400 text-xs leading-relaxed mt-2">Processes vision layout models, routes to NLP analyzers, extracts entities, maps semantics, and evaluates confidence scores.</p>
              
              <div className="mt-6 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-3 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CONFIDENCE: 99.8%</span>
              </div>
            </div>

            {/* Connecting SVG Path 2 */}
            <div className="hidden lg:block w-20 h-20 relative">
              <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
                <path d="M 0 40 L 80 40" stroke="rgba(59, 130, 246, 0.15)" strokeWidth="3" />
                <path d="M 0 40 L 80 40" stroke="#3b82f6" strokeWidth="3" className="animated-path" />
                <polygon points="75,36 80,40 75,44" fill="#3b82f6" />
              </svg>
            </div>

            {/* Box 3: Outputs */}
            <div className="w-full lg:w-[280px] flex flex-col gap-4">
              <div className="text-xs font-mono text-slate-500 tracking-widest uppercase mb-1">DESTINATION SYSTEMS</div>

              <div className="glass-panel p-4 rounded-xl flex items-center gap-4 bg-slate-950/60 border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">ERP & SQL DBs</h4>
                  <p className="text-[10px] text-slate-500">Auto-update tables</p>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl flex items-center gap-4 bg-slate-950/60 border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                  <Workflow className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Salesforce & CRM</h4>
                  <p className="text-[10px] text-slate-500">Sync accounts, files</p>
                </div>
              </div>

              <div className="glass-panel p-4 rounded-xl flex items-center gap-4 bg-slate-950/60 border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Network className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Slack & Webhooks</h4>
                  <p className="text-[10px] text-slate-500">Approval trigger alerts</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Analytics & Insights Section */}
      <section id="analytics" className="relative bg-slate-900 py-32 px-6 border-b border-slate-950 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Descriptive text */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-800/30">Analytics & Insights</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">Convert Static Data to Executive Intelligence</h2>
              </div>
              
              <p className="text-slate-400 text-sm leading-relaxed">
                Rather than storing PDFs in offline directories, ingest them into a global database. Track critical KPIs, evaluate performance trends, identify bottlenecks, and get automated recommendations instantly.
              </p>

              {/* Bullet Features list */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Predictive Trend Modeling</h4>
                    <p className="text-xs text-slate-400">Estimate invoice costs and flag future payment trends before deadlines.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Cognitive Recommendation Engines</h4>
                    <p className="text-xs text-slate-400">Auto-detect contract anomalies, deviations, or expirations automatically.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Real-Time Operational Audit</h4>
                    <p className="text-xs text-slate-400">Monitor model correctness metrics and human-in-the-loop validation speed.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dashboard UI Panel */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border-slate-800 bg-slate-950/60 relative overflow-hidden shadow-2xl">
              {/* Scanline reflection card effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
              
              {/* Header of Dashboard mock */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">ANALYTICS-ENGINE-V4 // LIVE REPORT</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                  99.98% ACCURACY
                </div>
              </div>

              {/* Dashboard Content Mock */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                
                {/* Metric Box 1 */}
                <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">DOCS INGESTED</span>
                  <div className="text-xl md:text-2xl font-black text-white mt-1">1,248,300</div>
                  <span className="text-[9px] font-mono text-emerald-400 mt-1 block">+12.4% THIS MONTH</span>
                </div>

                {/* Metric Box 2 */}
                <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">EXTRACTION SPEED</span>
                  <div className="text-xl md:text-2xl font-black text-cyan-400 mt-1">420ms</div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1 block">AVG PER 10-PAGE DOC</span>
                </div>

                {/* Metric Box 3 */}
                <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block tracking-wider">MANUAL TOUCH</span>
                  <div className="text-xl md:text-2xl font-black text-white mt-1">0.12%</div>
                  <span className="text-[9px] font-mono text-emerald-400 mt-1 block">-8% DECREASE YTD</span>
                </div>

              </div>

              {/* Glowing Interactive SVG Chart representation */}
              <div className="bg-slate-900/40 border border-slate-850 rounded-xl p-4 h-48 relative">
                <div className="absolute top-4 left-4 text-[9px] font-mono text-slate-500">COGNITIVE ACCURACY OVER TIME</div>
                <div className="absolute top-4 right-4 text-[9px] font-mono text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-soft"></span>
                  <span>VISION MODELS ENGAGED</span>
                </div>
                
                {/* SVG Graph line */}
                <svg className="w-full h-full pt-10" viewBox="0 0 400 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Fill Area */}
                  <path d="M0,90 Q50,70 100,85 T200,40 T300,30 T400,10 L400,120 L0,120 Z" fill="url(#chart-glow)" />
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="400" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  <line x1="0" y1="90" x2="400" y2="90" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  
                  {/* Line Chart */}
                  <path d="M0,90 Q50,70 100,85 T200,40 T300,30 T400,10" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
                  
                  {/* Glowing Pulse Node */}
                  <circle cx="400" cy="10" r="4" fill="#06b6d4" />
                  <circle cx="400" cy="10" r="8" fill="none" stroke="#06b6d4" strokeWidth="1" className="animate-pulse-soft" />
                </svg>
              </div>

              {/* Recommendation Box */}
              <div className="mt-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4 flex gap-3 items-start">
                <Zap className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-white">AI-Generated Insights Recommendation</h5>
                  <p className="text-[10px] text-slate-400 mt-1">Detected a recurring layout mismatch in 14.2% of Lease Amendments from Vendor-X. Model auto-corrected labels, resolving a potential $4,200/mo billing discrepancy.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 7. Enterprise Benefits Section */}
      <section id="benefits" className="relative bg-slate-950 py-32 px-6 border-b border-slate-900 z-20">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase bg-cyan-950/30 px-3 py-1 rounded-full border border-cyan-800/30">Strategic Value</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4 tracking-tight">Measurable Business Impact</h2>
            <p className="text-slate-400 text-sm md:text-base mt-4 leading-relaxed">Transition from complex paperwork pipelines to intelligent strategic execution hubs with tangible efficiency improvements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Benefit 1 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all"></div>
              <div className="text-4xl md:text-5xl font-black text-cyan-400/90 tracking-tight">10x</div>
              <h3 className="text-lg font-bold text-white">Faster Decision Making</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Instantly summarize vendor quotes, tax structures, and terms to clear audit gates and approve contracts in minutes instead of weeks.</p>
            </div>

            {/* Benefit 2 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
              <div className="text-4xl md:text-5xl font-black text-blue-400/90 tracking-tight">95%</div>
              <h3 className="text-lg font-bold text-white">Reduced Manual Effort</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Reallocate hundreds of manual review hours to strategic operations, eliminating repetitive copy-paste invoice review steps.</p>
            </div>

            {/* Benefit 3 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
              <div className="text-4xl md:text-5xl font-black text-indigo-400/90 tracking-tight">85%</div>
              <h3 className="text-lg font-bold text-white">Improved Productivity</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Enable analysts to query intelligence directly. Let them search across massive documentation structures using natural semantic phrasing.</p>
            </div>

            {/* Benefit 4 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all"></div>
              <div className="text-4xl md:text-5xl font-black text-purple-400/90 tracking-tight">Zero</div>
              <h3 className="text-lg font-bold text-white">Better Compliance</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Maintain complete audit traceability. Prevent data leaks, structure permission controls, and flag compliance errors automatically.</p>
            </div>

            {/* Benefit 5 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-all"></div>
              <div className="text-4xl md:text-5xl font-black text-pink-400/90 tracking-tight">99.9%</div>
              <h3 className="text-lg font-bold text-white">Enterprise Scalability</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Serve large multi-national operations with robust cloud APIs, processing up to hundreds of thousands of documents concurrently.</p>
            </div>

            {/* Benefit 6 */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col gap-4 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all"></div>
              <div className="text-4xl md:text-5xl font-black text-emerald-400/90 tracking-tight">100%</div>
              <h3 className="text-lg font-bold text-white">Knowledge Accessibility</h3>
              <p className="text-slate-400 text-xs leading-relaxed">Unify unstructured reports, emails, chats, and contracts in a single secure semantic intelligence database.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Footer Section */}
      <footer className="relative bg-slate-950 border-t border-slate-900 py-16 px-6 z-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo column */}
            <div className="flex flex-col gap-4">
              <DocReviewLogo destination="/" />
              <p className="text-slate-500 text-xs leading-relaxed mt-2">
                Delivering high-fidelity Document Intelligence & Workflow Automation systems to modernize enterprise information structures.
              </p>
            </div>

            {/* Links column 1 */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">CAPABILITIES</h4>
              <a href="#process" className="text-slate-500 hover:text-cyan-400 text-xs transition-colors">AI Processing Pipeline</a>
              <a href="#features" className="text-slate-500 hover:text-cyan-400 text-xs transition-colors">Cognitive Core Features</a>
              <a href="#automation" className="text-slate-500 hover:text-cyan-400 text-xs transition-colors">Workflow Automation</a>
              <a href="#analytics" className="text-slate-500 hover:text-cyan-400 text-xs transition-colors">BI Analytics & Metrics</a>
            </div>

            {/* Links column 2 */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">PLATFORM</h4>
              <Link href="/Auth/Login" className="text-slate-500 hover:text-cyan-400 text-xs transition-colors">Client Login</Link>
              <Link href="/Auth/Register" className="text-slate-500 hover:text-cyan-400 text-xs transition-colors">Request Account</Link>
              <a href="#" className="text-slate-500 hover:text-cyan-400 text-xs transition-colors">API documentation</a>
              <a href="#" className="text-slate-500 hover:text-cyan-400 text-xs transition-colors">Security & Trust Center</a>
            </div>

            {/* Contact column */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">ENTERPRISE HQ</h4>
              <span className="text-slate-500 text-xs">info@docreview.ai</span>
              <span className="text-slate-500 text-xs">+1 (800) 555-0199</span>
              <span className="text-slate-500 text-xs">100 Pine Street, 24th Floor,<br />San Francisco, CA 94111</span>
            </div>

          </div>

          <div className="h-[1px] bg-slate-900 w-full"></div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© 2026 DocReview.AI. All rights reserved. SOC2 Type II Certified.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Trust & Safety</a>
            </div>
          </div>

        </div>
      </footer>
      </div>

    </div>
  );
}
