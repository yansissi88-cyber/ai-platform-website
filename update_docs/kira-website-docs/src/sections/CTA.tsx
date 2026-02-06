import { ArrowRight, Sparkles, Phone } from 'lucide-react';

export function CTA() {
  return (
    <section className="relative py-20 lg:py-32 bg-kr-dark-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-kr-blue-600/20 via-transparent to-transparent" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div className="absolute inset-0 bg-kr-blue-600/10 rounded-full blur-[100px] animate-pulse-glow" />
          <div className="absolute inset-8 bg-kr-cyan-500/10 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-16 bg-purple-500/10 rounded-full blur-[60px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>

        {/* Grid */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <Sparkles className="w-4 h-4 text-kr-cyan-400" />
          <span className="text-sm text-slate-300">Start Your AI Journey Today</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to Transform Your{' '}
          <span className="text-gradient">Customer Engagement?</span>
        </h2>

        {/* Description */}
        <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Join leading organizations worldwide using KeyReply Kira to deliver exceptional customer experiences with AI-powered engagement.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="https://www.keyreply.com/request-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-kr-blue-600 to-kr-cyan-500 hover:from-kr-blue-500 hover:to-kr-cyan-400 text-white rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300 group text-base"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://kira.keyreply.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-white/20 text-white hover:bg-white/5 rounded-lg text-base"
          >
            Try Demo
          </a>
        </div>

        {/* Phone CTA */}
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <Phone className="w-4 h-4" />
          <span className="text-sm">Call us: </span>
          <a 
            href="tel:+15104395472" 
            className="text-sm text-kr-cyan-400 hover:text-kr-cyan-300 transition-colors font-medium"
          >
            +1 510 HEY KIRA
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-slate-500 mb-4">Trusted by organizations worldwide</p>
          <div className="flex flex-wrap justify-center gap-8 text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                <span className="text-xs font-bold">83M+</span>
              </div>
              <span className="text-sm">Interactions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                <span className="text-xs font-bold">94%</span>
              </div>
              <span className="text-sm">Retention</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                <span className="text-xs font-bold">80%</span>
              </div>
              <span className="text-sm">Faster</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
