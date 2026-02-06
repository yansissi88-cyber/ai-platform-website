import { useRef, useEffect, useState } from 'react';
import { Rocket, Mic, BarChart3, Code, Smartphone, Users, Video, Workflow, CheckCircle2, Circle, Clock } from 'lucide-react';

const roadmapData = [
  {
    quarter: 'Q2 2026',
    status: 'in-dev',
    features: [
      {
        icon: Mic,
        title: 'Voice Integration',
        description: 'Support for voice calls and IVR functionality',
      },
      {
        icon: BarChart3,
        title: 'Advanced Analytics',
        description: 'Predictive analytics and custom report builder',
      },
      {
        icon: Code,
        title: 'API Gateway',
        description: 'Public API for third-party integrations',
      },
    ],
  },
  {
    quarter: 'Q3 2026',
    status: 'planned',
    features: [
      {
        icon: Smartphone,
        title: 'Mobile App',
        description: 'Native iOS and Android applications',
      },
      {
        icon: Users,
        title: 'CRM Integration',
        description: 'Native integrations with Salesforce, HubSpot',
      },
      {
        icon: Globe,
        title: 'Multi-language AI',
        description: 'Support for 50+ languages in AI responses',
      },
    ],
  },
  {
    quarter: 'Q4 2026',
    status: 'planned',
    features: [
      {
        icon: Video,
        title: 'Video Chat',
        description: 'In-app video calling capabilities',
      },
      {
        icon: Workflow,
        title: 'Advanced Workflow',
        description: 'Conditional logic and custom triggers',
      },
    ],
  },
];

function Globe({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export function Roadmap() {
  const [visibleQuarters, setVisibleQuarters] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const quarter = entry.target.getAttribute('data-quarter');
            if (quarter) {
              setVisibleQuarters((prev) => new Set([...prev, quarter]));
            }
          }
        });
      },
      { threshold: 0.3, rootMargin: '-50px' }
    );

    const quarterElements = document.querySelectorAll('[data-quarter]');
    quarterElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="roadmap" ref={sectionRef} className="relative py-20 lg:py-32 bg-kr-dark-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kr-cyan-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kr-cyan-500/30 to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-kr-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-kr-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kr-cyan-500/10 border border-kr-cyan-500/20 mb-6">
            <Rocket className="w-4 h-4 text-kr-cyan-400" />
            <span className="text-sm text-kr-cyan-400 font-medium">Future Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            What's Coming Next
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            We are committed to providing customers with the most advanced AI customer engagement solutions through continuous innovation
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-kr-blue-500/50 via-kr-cyan-500/50 to-kr-blue-500/50" />

          {/* Quarters */}
          <div className="space-y-12 lg:space-y-16">
            {roadmapData.map((quarter, index) => (
              <div
                key={quarter.quarter}
                data-quarter={quarter.quarter}
                className={`relative transition-all duration-700 ${
                  visibleQuarters.has(quarter.quarter)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                {/* Timeline node */}
                <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-kr-dark-900 border-2 border-kr-cyan-500 z-10">
                  <div className={`absolute inset-0.5 rounded-full ${
                    quarter.status === 'in-dev' ? 'bg-kr-cyan-400 animate-pulse' : 'bg-kr-dark-900'
                  }`} />
                </div>

                {/* Content */}
                <div className={`pl-12 lg:pl-0 ${
                  index % 2 === 0 ? 'lg:pr-[calc(50%+2rem)]' : 'lg:pl-[calc(50%+2rem)]'
                }`}>
                  {/* Quarter Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-2xl font-bold text-white">{quarter.quarter}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      quarter.status === 'in-dev'
                        ? 'bg-kr-cyan-500/20 text-kr-cyan-400 border border-kr-cyan-500/30'
                        : 'bg-white/5 text-slate-400 border border-white/10'
                    }`}>
                      {quarter.status === 'in-dev' ? (
                        <>
                          <Clock className="w-3 h-3" />
                          In Development
                        </>
                      ) : (
                        <>
                          <Circle className="w-3 h-3" />
                          Planned
                        </>
                      )}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {quarter.features.map((feature, i) => (
                      <div
                        key={i}
                        className="glass rounded-lg p-4 hover:border-kr-cyan-500/30 transition-colors group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-kr-blue-600/20 to-kr-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:from-kr-blue-600/30 group-hover:to-kr-cyan-500/30 transition-colors">
                            <feature.icon className="w-5 h-5 text-kr-cyan-400" />
                          </div>
                          <div>
                            <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                            <p className="text-sm text-slate-400">{feature.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 lg:mt-20 text-center">
          <p className="text-slate-400 mb-4">
            Have feature suggestions or feedback?
          </p>
          <a
            href="https://www.keyreply.com/request-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-kr-blue-600 to-kr-cyan-500 text-white font-medium hover:shadow-glow transition-shadow"
          >
            <CheckCircle2 className="w-5 h-5" />
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
}
