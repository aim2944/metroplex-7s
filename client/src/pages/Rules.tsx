import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { api } from '../lib/api';

interface Rule {
  id: string;
  section: string;
  title: string;
  content: string;
}

export default function Rules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    api.getRules()
      .then(data => {
        setRules(data);
        if (data.length > 0) {
          const sections = [...new Set(data.map((r: Rule) => r.section))];
          setActiveSection(sections[0] as string);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sections = [...new Set(rules.map(r => r.section))];
  const filteredRules = activeSection
    ? rules.filter(r => r.section === activeSection)
    : rules;

  return (
    <div className="bg-navy-dark min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          LEAGUE <span className="text-gold">RULES</span>
        </h1>
        <p className="text-white/50 text-center mb-10">
          Official rules and regulations for the Metroplex Summer League 7's
        </p>

        {loading ? (
          <p className="text-center text-white/40">Loading rules...</p>
        ) : rules.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={48} className="text-gold/30 mx-auto mb-4" />
            <p className="text-white/40 text-lg">Rules coming soon.</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Section tabs */}
            <div className="sm:w-48 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible">
              {sections.map(section => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-2 rounded-lg text-sm font-display font-semibold text-left whitespace-nowrap transition-colors ${
                    activeSection === section
                      ? 'bg-gold/20 text-gold border border-gold/30'
                      : 'text-white/50 hover:text-white border border-transparent'
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            {/* Rules content */}
            <div className="flex-1 space-y-4">
              {filteredRules.map(rule => (
                <div
                  key={rule.id}
                  className="bg-navy/50 border border-gold/10 rounded-xl p-5"
                >
                  <h3 className="font-display text-base font-bold text-gold mb-2">
                    {rule.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {rule.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
