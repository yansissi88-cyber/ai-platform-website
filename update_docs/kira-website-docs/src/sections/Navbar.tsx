import { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'AI Intelligence', href: '#ai-intelligence' },
  { label: 'Automation', href: '#automation' },
  { label: 'Communication', href: '#communication' },
  { label: 'Knowledge', href: '#knowledge' },
  { label: 'Roadmap', href: '#roadmap' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-kr-dark-900/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 lg:w-10 lg:h-10">
              <div className="absolute inset-0 bg-gradient-to-br from-kr-blue-500 to-kr-cyan-500 rounded-lg transform group-hover:scale-110 transition-transform duration-300" />
              <Sparkles className="absolute inset-0 m-auto w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold text-white leading-tight">
                KeyReply
              </span>
              <span className="text-xs text-kr-cyan-400 leading-tight">Kira</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors duration-300 group"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-0 bg-white/5 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300" />
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://kira.keyreply.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              Demo
            </a>
            <a
              href="https://www.keyreply.com/request-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm bg-gradient-to-r from-kr-blue-600 to-kr-cyan-500 hover:from-kr-blue-500 hover:to-kr-cyan-400 text-white rounded-lg shadow-glow hover:shadow-glow-lg transition-all duration-300"
            >
              Talk to Expert
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-slate-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-kr-dark-900/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="pt-4 space-y-2">
            <a
              href="https://kira.keyreply.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 text-center border border-white/10 rounded-lg text-white"
            >
              Demo
            </a>
            <a
              href="https://www.keyreply.com/request-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full px-4 py-2 text-center bg-gradient-to-r from-kr-blue-600 to-kr-cyan-500 rounded-lg text-white"
            >
              Talk to Expert
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
