import { useRef } from 'react';
import { Bot, Store, Brain, FlaskConical, Phone, Sparkles, Zap, Shield } from 'lucide-react';

const aiFeatures = [
  {
    id: 'agent-builder',
    icon: Bot,
    title: 'Agent Builder',
    subtitle: 'Create Intelligent AI Agents',
    description: 'Build custom AI agents with unique personalities, skills, and behavior patterns. Select from base models like qwen2.5-coder-32b and configure agent traits for specific business scenarios.',
    highlights: [
      'Custom personality configuration',
      'Multiple base model support',
      'Skill and tool integration',
      'Real-time agent testing',
    ],
    image: '/images/agent_builder.png',
    imagePosition: 'right',
  },
  {
    id: 'mcp-store',
    icon: Store,
    title: 'MCP Store',
    subtitle: 'Integration Marketplace',
    description: 'Extend AI agent capabilities through the Model Context Protocol Store. Connect to CRM, DevOps, Communication, Productivity, Healthcare, and AI services.',
    highlights: [
      '50+ third-party integrations',
      'CRM & Sales tools (Salesforce, HubSpot)',
      'DevOps & Infrastructure (AWS, Azure)',
      'AI & ML services (OpenAI, Claude)',
    ],
    image: '/images/mcp_store.png',
    imagePosition: 'left',
  },
  {
    id: 'synapse',
    icon: Brain,
    title: 'Synapse',
    subtitle: 'Cognitive State Analysis',
    description: 'Real-time emotional state and cognitive indicator analysis during conversations. Understand customer emotional changes and optimize engagement strategies.',
    highlights: [
      'Curiosity detection',
      'Fatigue monitoring',
      'Confidence assessment',
      'Engagement measurement',
    ],
    image: '/images/synapse.png',
    imagePosition: 'right',
  },
  {
    id: 'rag-testing',
    icon: FlaskConical,
    title: 'RAG Testing Lab',
    subtitle: 'Optimize AI Response Accuracy',
    description: 'Evaluate Retrieval-Augmented Generation quality with comprehensive testing tools. Test knowledge base retrieval effectiveness and track performance metrics.',
    highlights: [
      'Similarity score configuration',
      'Expected answer validation',
      'Source document tracking',
      'Performance analytics',
    ],
    image: '/images/testing.png',
    imagePosition: 'left',
  },
  {
    id: 'voice-testing',
    icon: Phone,
    title: 'Voice Testing',
    subtitle: 'Real-time Audio Integration',
    description: 'Test Grok Voice API integration with real-time audio. Verify voice call quality, latency, and recognition accuracy with comprehensive session metrics.',
    highlights: [
      'Multiple voice providers',
      'Character voice selection',
      'Session metrics tracking',
      'Real-time conversation testing',
    ],
    image: '/images/voice_testing.png',
    imagePosition: 'right',
  },
];

interface Feature {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  image: string;
  imagePosition: string;
}

function FeatureBlock({ feature }: { feature: Feature }) {
  const blockRef = useRef<HTMLDivElement>(null);
  const isReversed = feature.imagePosition === 'left';

  return (
    <div
      ref={blockRef}
      className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
        isReversed ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative ${isReversed ? 'lg:order-1' : 'lg:order-2'}`}>
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-kr-blue-600/20 to-kr-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Image container */}
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-kr-dark-800 shadow-2xl">
            <img
              src={feature.image}
              alt={feature.title}
              className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-kr-dark-900/50 via-transparent to-transparent" />
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-lg bg-kr-dark-800 border border-white/10 shadow-xl flex items-center gap-2">
            <Zap className="w-4 h-4 text-kr-cyan-400" />
            <span className="text-sm text-white font-medium">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`space-y-6 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-kr-blue-600 to-kr-cyan-500 flex items-center justify-center shadow-glow">
            <feature.icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-sm text-kr-cyan-400 font-medium">{feature.subtitle}</span>
            <h3 className="text-2xl lg:text-3xl font-bold text-white">{feature.title}</h3>
          </div>
        </div>

        <p className="text-slate-400 text-lg leading-relaxed">
          {feature.description}
        </p>

        <ul className="space-y-3">
          {feature.highlights.map((highlight, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-kr-blue-500/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-3 h-3 text-kr-blue-400" />
              </div>
              <span className="text-slate-300">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AIIntelligence() {
  return (
    <section id="ai-intelligence" className="relative py-20 lg:py-32 bg-kr-dark-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-kr-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-kr-cyan-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kr-blue-500/10 border border-kr-blue-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-kr-blue-400" />
            <span className="text-sm text-kr-blue-400 font-medium">AI Intelligence Module</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Powered by Advanced AI
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Leverage cutting-edge artificial intelligence to understand, engage, and serve your customers better
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-20 lg:space-y-32">
          {aiFeatures.map((feature) => (
            <FeatureBlock key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
