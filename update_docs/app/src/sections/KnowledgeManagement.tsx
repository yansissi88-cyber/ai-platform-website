import { BookOpen, FileText, Link2, Upload, Search, Database, CheckCircle } from 'lucide-react';

const knowledgeFeatures = [
  {
    icon: Upload,
    title: 'Document Upload',
    description: 'Upload PDF, Word, Markdown files for AI training',
  },
  {
    icon: FileText,
    title: 'Internal Articles',
    description: 'Create self-service knowledge documents',
  },
  {
    icon: Link2,
    title: 'External Integrations',
    description: 'Connect Zendesk, Notion, Confluence',
  },
  {
    icon: Search,
    title: 'AI RAG Support',
    description: 'Automatic indexing and retrieval',
  },
];

const integrations = [
  { name: 'Zendesk', articles: '47' },
  { name: 'Notion', articles: '12' },
  { name: 'Confluence', articles: '8' },
];

export function KnowledgeManagement() {
  return (
    <section id="knowledge" className="relative py-20 lg:py-32 bg-kr-dark-900">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kr-blue-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-kr-blue-500/30 to-transparent" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-kr-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-kr-blue-500/10 border border-kr-blue-500/20 mb-6">
            <Database className="w-4 h-4 text-kr-blue-400" />
            <span className="text-sm text-kr-blue-400 font-medium">Knowledge Management</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Centralized Knowledge Base
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Power your AI agents with comprehensive knowledge management and RAG capabilities
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-kr-blue-600 to-kr-cyan-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-sm text-kr-cyan-400 font-medium">Tenant-Aware Center</span>
                <h3 className="text-2xl lg:text-3xl font-bold text-white">Knowledge Base</h3>
              </div>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed">
              The tenant-aware knowledge center of the Kira platform, used for centralized management 
              of all documents supporting AI Retrieval-Augmented Generation (RAG). The system automatically 
              indexes uploaded documents, making them retrievable and referenceable by AI agents.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {knowledgeFeatures.map((feature, i) => (
                <div key={i} className="glass rounded-lg p-4 hover:border-kr-blue-500/30 transition-colors group">
                  <feature.icon className="w-6 h-6 text-kr-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Storage Stats */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">Storage Usage</span>
                <span className="text-sm text-kr-cyan-400 font-medium">45% used</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-gradient-to-r from-kr-blue-600 to-kr-cyan-500 rounded-full" />
              </div>
              <div className="flex items-center justify-between mt-3 text-sm">
                <span className="text-slate-500">12 Documents</span>
                <span className="text-slate-500">8 Articles</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-kr-blue-600/20 to-kr-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative rounded-xl overflow-hidden border border-white/10 bg-kr-dark-800 shadow-2xl">
                <img
                  src="/images/knowledge_base.png"
                  alt="Knowledge Base"
                  className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-kr-dark-900/50 via-transparent to-transparent" />
              </div>

              {/* Integration badges */}
              <div className="absolute -bottom-4 left-4 right-4 flex gap-2 justify-center">
                {integrations.map((integration, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-lg bg-kr-dark-800 border border-white/10 shadow-xl flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-white">{integration.name}</span>
                    <span className="text-xs text-slate-500">{integration.articles}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-16 grid sm:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">Automatic</div>
            <div className="text-sm text-slate-400">Document indexing and processing</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">AI RAG</div>
            <div className="text-sm text-slate-400">Retrieval-augmented generation support</div>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">Multi-Source</div>
            <div className="text-sm text-slate-400">Upload, create, or integrate content</div>
          </div>
        </div>
      </div>
    </section>
  );
}
