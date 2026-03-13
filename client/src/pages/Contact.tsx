import { Instagram, Mail, Phone, MessageCircle } from 'lucide-react';

export default function Contact() {
  return (
    <div className="bg-navy-dark min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white text-center mb-2">
          GET IN <span className="text-gold">TOUCH</span>
        </h1>
        <p className="text-white/50 text-center mb-10">
          Have questions about the league? Reach out through any of the channels below.
        </p>

        <div className="space-y-4">
          <a
            href="https://instagram.com/mplsdfw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-navy/50 border border-gold/10 rounded-xl p-5 hover:border-gold/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <Instagram size={22} className="text-gold" />
            </div>
            <div>
              <p className="font-display font-bold text-white group-hover:text-gold transition-colors">
                Instagram
              </p>
              <p className="text-white/50 text-sm">@mplsdfw — DM us anytime</p>
            </div>
          </a>

          <a
            href="mailto:beatyourtestprep@gmail.com"
            className="flex items-center gap-4 bg-navy/50 border border-gold/10 rounded-xl p-5 hover:border-gold/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <Mail size={22} className="text-gold" />
            </div>
            <div>
              <p className="font-display font-bold text-white group-hover:text-gold transition-colors">
                Email
              </p>
              <p className="text-white/50 text-sm">beatyourtestprep@gmail.com</p>
            </div>
          </a>

          <div className="flex items-center gap-4 bg-navy/50 border border-gold/10 rounded-xl p-5">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <Phone size={22} className="text-gold" />
            </div>
            <div>
              <p className="font-display font-bold text-white">Text</p>
              <p className="text-white/50 text-sm">Text us for quick questions — number provided after registration</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-navy/50 border border-gold/10 rounded-xl p-5">
            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
              <MessageCircle size={22} className="text-gold" />
            </div>
            <div>
              <p className="font-display font-bold text-white">WhatsApp Captain Group</p>
              <p className="text-white/50 text-sm">
                Invite link provided to team captains after registration is confirmed
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 bg-navy/30 border border-gold/10 rounded-xl p-6 text-center">
          <p className="text-white/40 text-sm">
            For fastest response, DM us on{' '}
            <a href="https://instagram.com/mplsdfw" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
              Instagram @mplsdfw
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
