import { useEffect, useRef } from 'react';
import { ArrowRight, Play, Phone } from 'lucide-react';

export function Hero() {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      imageRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(0)`;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-kr-dark-900">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-kr-blue-600/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-kr-cyan-500/15 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-kr-blue-500/10 rounded-full blur-[150px]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-slate-300">AI-Powered Engagement Platform</span>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                KeyReply{' '}
                <span className="text-gradient">Kira</span>
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-slate-400 font-light">
                Next-Generation Customer Engagement
              </p>
            </div>

            {/* Description */}
            <p className="text-base lg:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Build smarter and more efficient customer communication systems with AI intelligent agents, 
              automated workflows, and unified communication centers. Deliver 24/7 uninterrupted service 
              while maintaining high-quality customer experiences.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-8">
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white">83M+</div>
                <div className="text-sm text-slate-500">AI Interactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white">94%</div>
                <div className="text-sm text-slate-500">Client Retention</div>
              </div>
              <div className="text-center">
                <div className="text-2xl lg:text-3xl font-bold text-white">80%</div>
                <div className="text-sm text-slate-500">Faster Deployment</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#features" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-kr-blue-600 to-kr-cyan-500 hover:from-kr-blue-500 hover:to-kr-cyan-400 text-white rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 group">
                Explore Features
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://kira.keyreply.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </a>
            </div>

            {/* Phone CTA */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-slate-400">
              <Phone className="w-4 h-4" />
              <span className="text-sm">Experience live: </span>
              <a 
                href="tel:+15104395472" 
                className="text-sm text-kr-cyan-400 hover:text-kr-cyan-300 transition-colors"
              >
                +1 510 HEY KIRA
              </a>
            </div>
          </div>

          {/* Right: Dashboard Preview */}
          <div 
            ref={imageRef}
            className="relative transition-transform duration-200 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Glow effect behind image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-kr-blue-600/30 to-kr-cyan-500/30 rounded-2xl blur-2xl" />
            
            {/* Dashboard Image */}
            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="/images/dashboard.png"
                alt="KeyReply Kira Dashboard"
                className="w-full h-auto"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-kr-dark-900/50 via-transparent to-transparent" />
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-kr-blue-500/20 rounded-lg backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">+12%</div>
                <div className="text-xs text-slate-400">Growth</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-24 h-16 bg-kr-cyan-500/20 rounded-lg backdrop-blur-sm border border-white/10 flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
              <div className="text-center">
                <div className="text-lg font-bold text-white">Live</div>
                <div className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500">
        <span className="text-xs">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
