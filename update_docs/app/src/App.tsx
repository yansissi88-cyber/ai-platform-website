import { Navbar } from './sections/Navbar';
import { Hero } from './sections/Hero';
import { FeaturesOverview } from './sections/FeaturesOverview';
import { AIIntelligence } from './sections/AIIntelligence';
import { Automation } from './sections/Automation';
import { CommunicationHub } from './sections/CommunicationHub';
import { KnowledgeManagement } from './sections/KnowledgeManagement';
import { Roadmap } from './sections/Roadmap';
import { CTA } from './sections/CTA';
import { Footer } from './sections/Footer';

function App() {
  return (
    <div className="min-h-screen bg-kr-dark-900 text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <FeaturesOverview />
        <AIIntelligence />
        <Automation />
        <CommunicationHub />
        <KnowledgeManagement />
        <Roadmap />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
