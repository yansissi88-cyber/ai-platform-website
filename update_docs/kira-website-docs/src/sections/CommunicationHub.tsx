import { Inbox, Radio, Users, MessageSquare, Mail, Phone, Smartphone, Globe, Slack, Video } from 'lucide-react';

const channels = [
  { name: 'Email', icon: Mail, provider: 'Resend', color: 'bg-blue-500' },
  { name: 'SMS', icon: Smartphone, provider: 'Twilio', color: 'bg-green-500' },
  { name: 'WhatsApp', icon: MessageSquare, provider: 'Meta Business', color: 'bg-green-600' },
  { name: 'Voice', icon: Phone, provider: 'Twilio', color: 'bg-purple-500' },
  { name: 'Telegram', icon: Globe, provider: 'Bot API', color: 'bg-sky-500' },
  { name: 'Slack', icon: Slack, provider: 'OAuth', color: 'bg-red-500' },
  { name: 'Teams', icon: Video, provider: 'Azure Bot', color: 'bg-blue-600' },
  { name: 'WeChat', icon: MessageSquare, provider: 'Official Account', color: 'bg-green-500' },
];

const inboxFeatures = [
  {
    title: 'Three-Column Layout',
    description: 'Conversation list, real-time thread, and customer details in a single view',
  },
  {
    title: 'AI-Assisted Replies',
    description: 'Smart reply suggestions based on conversation context',
  },
  {
    title: 'Conversation Summary',
    description: 'Automatically generated key points summary',
  },
  {
    title: 'Customer Tags',
    description: 'AI automatically identifies and tags customer characteristics',
  },
];

const contactFeatures = [
  {
    title: 'DISC Personality Profiling',
    description: 'Know your customer before you call. AI analyzes interactions to categorize personality types (Dominant, Influential, Steady, Conscientious).',
  },
  {
    title: 'Behavioral Insights',
    description: 'Smart tags like "High Dominance", "Quick Decision Maker", and "Result-oriented" guide agent tone for maximum conversion.',
  },
  {
    title: 'Contact Intelligence',
    description: 'Comprehensive customer profile with demographics, company info, and interaction patterns.',
  },
  {
    title: 'Activity Timeline',
    description: 'Complete history of sessions, calls, and messages with engagement metrics.',
  },
];

export function CommunicationHub() {
  return (
    <section id="communication" className="relative py-20 lg:py-32 bg-kr-dark-900 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-kr-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Radio className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">Communication Hub</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Unified Communication
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Manage all customer conversations across every channel from one powerful platform
          </p>
        </div>

        {/* Unified Inbox */}
        <div className="mb-20 lg:mb-24">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-kr-blue-600 flex items-center justify-center">
                  <Inbox className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm text-purple-400 font-medium">Core Workspace</span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">Unified Inbox</h3>
                </div>
              </div>

              <p className="text-slate-400 text-lg leading-relaxed">
                The heart of the Kira platform featuring a three-column layout design that integrates 
                conversation list, real-time conversation thread, and customer details into a single view, 
                significantly improving customer service efficiency.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {inboxFeatures.map((feature, i) => (
                  <div key={i} className="glass rounded-lg p-4 hover:border-purple-500/30 transition-colors">
                    <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-kr-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-kr-dark-800 shadow-2xl">
                  <img
                    src="/images/inbox.png"
                    alt="Unified Inbox"
                    className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-kr-dark-900/50 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Channel Management */}
        <div className="mb-20 lg:mb-24">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-2">Channel Management</h3>
            <p className="text-slate-400">Connect and manage all your communication channels</p>
          </div>

          {/* Channel Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {channels.map((channel, i) => (
              <div
                key={i}
                className="group glass rounded-xl p-4 text-center hover:border-kr-blue-500/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-lg ${channel.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <channel.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-sm font-medium text-white">{channel.name}</div>
                <div className="text-xs text-slate-500">{channel.provider}</div>
              </div>
            ))}
          </div>

          {/* Channel Image */}
          <div className="mt-8 relative rounded-xl overflow-hidden border border-white/10 bg-kr-dark-800 shadow-xl">
            <img
              src="/images/channels.png"
              alt="Channel Management"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kr-dark-900/50 via-transparent to-transparent" />
          </div>
        </div>

        {/* Contact Management */}
        <div>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Images - Side by side layout */}
            <div className="relative order-2 lg:order-1 space-y-6">
              {/* Main Contact List */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-kr-blue-600/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-kr-dark-800 shadow-2xl">
                  <img
                    src="/images/contacts_list.png"
                    alt="Contact List with DISC Profiles"
                    className="w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-kr-dark-900/30 via-transparent to-transparent" />
                </div>
                
                {/* Label */}
                <div className="absolute -bottom-2 left-4 px-3 py-1 rounded-full bg-kr-blue-600 text-white text-xs font-medium">
                  Contact List
                </div>
              </div>

              {/* Detail Panel with DISC Analysis */}
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-kr-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-kr-dark-800 shadow-2xl">
                  <img
                    src="/images/contacts_detail.png"
                    alt="Contact Detail with DISC Personality Analysis"
                    className="w-full h-auto transform group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-kr-dark-900/30 via-transparent to-transparent" />
                </div>
                
                {/* Label */}
                <div className="absolute -bottom-2 left-4 px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-medium">
                  DISC Personality Profile
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-6 order-1 lg:order-2 lg:sticky lg:top-24">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kr-blue-600 to-purple-500 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-sm text-kr-blue-400 font-medium">AI-Native Hub</span>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">Contact Management</h3>
                </div>
              </div>

              <p className="text-slate-400 text-lg leading-relaxed">
                The AI-native contact intelligence hub that helps you know your customer before you call. 
                The new Contact Detail view provides instant DISC personality profiling and behavioral insights, 
                allowing your agents to adapt their tone for maximum conversion.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {contactFeatures.map((feature, i) => (
                  <div key={i} className="glass rounded-lg p-4 hover:border-kr-blue-500/30 transition-colors">
                    <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                    <p className="text-sm text-slate-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
