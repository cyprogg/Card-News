import { motion } from 'motion/react';
import { CardData, CardTheme } from '../types';
import { THEMES } from '../constants';

interface CardProps {
  card: CardData;
  themeId: string;
}

export default function Card({ card, themeId }: CardProps) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const isArtistic = themeId === 'artistic';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full aspect-[1/1] overflow-hidden shadow-2xl flex flex-col ${theme.bg} ${theme.text} ${isArtistic ? 'p-10' : 'p-8 rounded-2xl'} border border-black/5`}
    >
      {/* Accent Element (Traditional Themes) */}
      {!isArtistic && <div className={`absolute top-0 left-0 w-full h-2 ${theme.accent}`} />}

      {/* Decorative / Branding (Artistic Theme) */}
      {isArtistic && (
        <div className="absolute top-10 left-10">
          <div className="bg-black text-[var(--color-studio-accent)] px-3 py-1 font-black text-xs uppercase tracking-wider">
            FEATURE STORY
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 flex flex-col justify-center gap-6 ${isArtistic ? 'mt-8' : ''}`}>
        <h2 className={`${theme.fontDisplay || 'text-4xl font-bold leading-tight ' + theme.fontSans}`}>
          {card.title}
        </h2>
        <p className={`opacity-80 leading-relaxed ${theme.fontSans} ${isArtistic ? 'text-[1.2rem] mt-4' : 'text-lg'}`}>
          {card.content}
        </p>
      </div>

      {/* Footer / Meta */}
      <div className={`flex justify-between items-end ${isArtistic ? 'border-t-2 border-black pt-5' : ''}`}>
        <span className={`text-xs uppercase tracking-[0.2em] font-bold opacity-50 ${theme.fontMono || theme.fontSans}`}>
          {isArtistic ? 'STUDIO.NEWS' : 'News Card'}
        </span>
        <div className={`w-12 h-12 rounded-full border-2 border-current opacity-20`} />
      </div>
    </motion.div>
  );
}
