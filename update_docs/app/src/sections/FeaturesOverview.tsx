import { useState, useRef } from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Store, 
  Brain, 
  FlaskConical, 
  Phone, 
  Megaphone, 
  Workflow, 
  Inbox, 
  Radio, 
  Users, 
  BookOpen, 
  Settings
} from 'lucide-react';

const featureCategories = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    title: 'Analytics Dashboard',
    description: 'Real-time monitoring of key business metrics and historical trend analysis. Features intuitive visual design with key metric cards, time range switching, and trend charts.',
    image: '/images/dashboard.png',
  },
  {
    id: 'agent-builder',
    label: 'Agent Builder',
    icon: Bot,
    title: 'AI Agent Builder',
    description: 'Create and configure intelligent AI agents with custom personalities, skills, and capabilities. Choose from base models and customize behavior patterns.',
    image: '/images/agent_builder.png',
  },
  {
    id: 'mcp-store',
    label: 'MCP Store',
    icon: Store,
    title: 'MCP Store',
    description: 'Integration marketplace providing rich third-party services and tool integrations. Connect CRM, DevOps, Communication, and AI services.',
    image: '/images/mcp_store.png',
  },
  {
    id: 'synapse',
    label: 'Synapse',
    icon: Brain,
    title: 'Synapse Analysis',
    description: 'Cognitive state modulation console using AI to analyze emotional states in real-time. Detect curiosity, fatigue, confidence, engagement, urgency, and rapport.',
    image: '/images/synapse.png',
  },
  {
    id: 'testing',
    label: 'Testing',
    icon: FlaskConical,
    title: 'RAG Testing Lab',
    description: 'Testing environment for evaluating Retrieval-Augmented Generation quality. Test knowledge base retrieval effectiveness to optimize AI response accuracy.',
    image: '/images/testing.png',
  },
  {
    id: 'voice-testing',
    label: 'Voice Testing',
    icon: Phone,
    title: 'Voice Testing',
    description: 'Test Grok Voice API real-time audio integration. Verify voice call quality, latency, and recognition accuracy with session metrics.',
    image: '/images/voice_testing.png',
  },
  {
    id: 'campaigns',
    label: 'Campaigns',
    icon: Megaphone,
    title: 'Campaign Management',
    description: 'Central hub for outbound marketing campaigns with integrated script optimization. Design campaigns, generate AI script variants, launch A/B tests, and manage voice call templates—all in one streamlined workflow.',
    image: '/images/campaigns_overview.png',
  },
  {
    id: 'workflows',
    label: 'Workflows',
    icon: Workflow,
    title: 'Workflow Automation',
    description: 'Visually build automated business processes. Create complex combinations of triggers, conditions, and actions to automate execution.',
    image: '/images/workflows.png',
  },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: Inbox,
    title: 'Unified Inbox',
    description: 'Three-column layout integrating conversation list, real-time thread, and customer details. AI-assisted replies and conversation summaries.',
    image: '/images/inbox.png',
  },
  {
    id: 'channels',
    label: 'Channels',
    icon: Radio,
    title: 'Channel Management',
    description: 'Unified communication channel configuration supporting Email, SMS, WhatsApp, Voice, Telegram, Slack, Teams, WeChat, and LINE.',
    image: '/images/channels.png',
  },
  {
    id: 'contacts',
    label: 'Contacts',
    icon: Users,
    title: 'Smart Contact Management',
    description: 'AI-native contact intelligence hub featuring DISC personality profiling. Know your customer before you call—with instant behavioral insights, personality traits, and interaction history for personalized engagement.',
    image: '/images/contacts_list.png',
  },
  {
    id: 'knowledge-base',
    label: 'Knowledge',
    icon: BookOpen,
    title: 'Knowledge Base',
    description: 'Tenant-aware knowledge center for centralized document management. AI RAG support with automatic indexing of uploaded documents.',
    image: '/images/knowledge_base.png',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    title: 'System Settings',
    description: 'Centralized platform configuration hub. Manage organization settings, voice & phone providers, AI models, team members, and developer integrations—all in one place.',
    image: '/images/settings_overview.png',
  },
];

export function FeaturesOverview() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAnimating, setIsAnimating] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const activeFeature = featureCategories.find(f => f.id === activeTab);

  const handleTabChange = (id: string) => {
    if (id === activeTab || isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(id);
      setTimeout(() => setIsAnimating(false), 400);
    }, 200);
  };

  return (
    <section id="features" className="relative py-20 lg:py-32 bg-kr-dark-900">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-kr-blue-500/10 border border-kr-blue-500/20 text-kr-blue-400 text-sm font-medium mb-4">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Complete Feature Ecosystem
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Explore the comprehensive suite of tools designed to transform your customer engagement strategy
          </p>
        </div>

        {/* Feature Explorer */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Tab Navigation - Left Side */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 custom-scrollbar">
              {featureCategories.map((feature) => {
                const Icon = feature.icon;
                const isActive = activeTab === feature.id;
                return (
                  <button
                    key={feature.id}
                    onClick={() => handleTabChange(feature.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group ${
                      isActive
                        ? 'bg-gradient-to-r from-kr-blue-600/20 to-kr-cyan-500/10 border border-kr-blue-500/30'
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-kr-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                    <span className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                    }`}>
                      {feature.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-kr-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area - Right Side */}
          <div className="lg:col-span-9">
            <div className="space-y-6">
              {/* Feature Image */}
              <div 
                ref={imageContainerRef}
                className="relative rounded-xl overflow-hidden border border-white/10 bg-kr-dark-800"
              >
                <div className={`transition-all duration-400 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                  {activeFeature && (
                    <img
                      src={activeFeature.image}
                      alt={activeFeature.title}
                      className="w-full h-auto"
                    />
                  )}
                </div>
                
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-kr-dark-900/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Feature Description */}
              <div className={`glass rounded-xl p-6 transition-all duration-400 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <div className="flex items-start gap-4">
                  {activeFeature && (
                    <>
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-kr-blue-600 to-kr-cyan-500 flex items-center justify-center">
                        <activeFeature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {activeFeature.title}
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                          {activeFeature.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
