import { Megaphone, Workflow, Target, Calendar, Zap, CheckCircle } from 'lucide-react';

const automationFeatures = [
  {
    id: 'campaigns',
    icon: Megaphone,
    title: 'Campaign Management',
    description: 'Central hub for outbound marketing campaigns with integrated script optimization. Design multi-channel campaigns, generate AI script variants, launch A/B tests, and manage voice call templates—all without leaving your campaign workflow.',
    image: '/images/campaigns_overview.png',
    stats: [
      { label: 'Total Campaigns', value: '9' },
      { label: 'Active Now', value: '1' },
      { label: 'Completed', value: '2' },
      { label: 'Drafts', value: '4' },
    ],
    capabilities: [
      'Multi-channel campaigns (Voice, Email, WhatsApp)',
      'Integrated script optimization with AI variants',
      'A/B testing and experiment setup',
      'Voice call template management',
    ],
  },
  {
    id: 'workflows',
    icon: Workflow,
    title: 'Workflow Automation',
    description: 'Visually build automated business processes with complex combinations of triggers, conditions, and actions.',
    image: '/images/workflows.png',
    stats: [
      { label: 'Total Workflows', value: '0' },
      { label: 'Active', value: '0' },
      { label: 'Inactive', value: '0' },
      { label: 'Executions Today', value: '--' },
    ],
    capabilities: [
      'Visual workflow builder',
      'Multiple trigger types (Webhook, Timer, Event)',
      'Conditional logic and branching',
      'Action nodes (message, API, data update)',
    ],
  },
];

export function Automation() {
  return (
    <section id="automation" className="relative py-20 lg:py-32 bg-kr-dark-900">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kr-cyan-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kr-cyan-500/30 to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-kr-cyan-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kr-cyan-500/10 border border-kr-cyan-500/20 mb-6">
            <Zap className="w-4 h-4 text-kr-cyan-400" />
            <span className="text-sm text-kr-cyan-400 font-medium">Automation & Marketing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Automate & Scale
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Streamline your marketing and business processes with intelligent automation tools
          </p>
        </div>

        {/* Features */}
        <div className="space-y-24 lg:space-y-32">
          {automationFeatures.map((feature, index) => (
            <div
              key={feature.id}
              className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kr-cyan-500 to-kr-blue-600 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">{feature.title}</h3>
                </div>

                <p className="text-slate-400 text-lg leading-relaxed">
                  {feature.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-3">
                  {feature.stats.map((stat, i) => (
                    <div key={i} className="glass rounded-lg p-3 text-center">
                      <div className="text-xl lg:text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-slate-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Capabilities */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                    Key Capabilities
                  </h4>
                  <ul className="space-y-2">
                    {feature.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-kr-cyan-400 flex-shrink-0" />
                        <span className="text-slate-400">{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Image */}
              <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-kr-cyan-500/20 to-kr-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative rounded-xl overflow-hidden border border-white/10 bg-kr-dark-800 shadow-2xl">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-kr-dark-900/50 via-transparent to-transparent" />
                  </div>

                  {/* Floating element */}
                  <div className="absolute -bottom-3 -left-3 px-3 py-2 rounded-lg bg-kr-dark-800 border border-white/10 shadow-xl flex items-center gap-2">
                    <Target className="w-4 h-4 text-kr-cyan-400" />
                    <span className="text-xs text-white font-medium">Smart Automation</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 lg:mt-24 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl glass">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-kr-cyan-400" />
              <div className="text-left">
                <div className="text-white font-semibold">Ready to automate?</div>
                <div className="text-sm text-slate-400">Start building workflows today</div>
              </div>
            </div>
            <a
              href="https://kira.keyreply.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-kr-cyan-500 to-kr-blue-600 text-white font-medium hover:shadow-glow-cyan transition-shadow"
            >
              Try Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
