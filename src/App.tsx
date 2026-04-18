/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Palette, 
  Type as FontIcon, 
  CloudDownload, 
  Share2,
  X,
  Plus,
  RefreshCw,
  Layout
} from 'lucide-react';
import { CardData, ThemeId } from './types';
import { THEMES } from './constants';
import { generateCardsFromText } from './lib/gemini';
import Card from './components/Card';

export default function App() {
  const [inputText, setInputText] = useState('');
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('artistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    try {
      const generated = await generateCardsFromText(inputText);
      setCards(generated);
      setActiveCardIndex(0);
    } catch (error) {
      console.error("Generation failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateCardContent = (index: number, field: 'title' | 'content', value: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setCards(newCards);
  };

  const handleExport = () => {
    const text = cards.map(c => `${c.title}\n${c.content}`).join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
    alert('카드뉴스 텍스트가 복사되었습니다! 미리보기를 캡처해서 사용하실 수 있습니다.');
  };

  const nextCard = () => {
    setActiveCardIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setActiveCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const reset = () => {
    setCards([]);
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-[var(--color-studio-bg)] flex flex-col font-sans text-white">
      {/* Header */}
      <header className="h-[60px] border-b border-[var(--color-studio-border)] bg-[var(--color-studio-bg)] px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="text-[var(--color-studio-accent)] font-black text-xl tracking-[2px]">
            CARD.STUDIO
          </div>
          <div className="text-[var(--color-studio-text-dim)] text-sm hidden sm:block">
            {cards.length > 0 ? `Untitled News Card #${activeCardIndex + 1}` : 'New Project'}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {cards.length > 0 && (
            <button 
              onClick={handleExport}
              className="btn-accent px-4 py-2 rounded text-xs"
            >
              Export Assets
            </button>
          )}
          {cards.length > 0 && (
            <button 
              onClick={reset}
              className="px-4 py-2 border border-[var(--color-studio-border)] rounded text-xs hover:bg-neutral-800 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {cards.length === 0 ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center p-6 bg-[#121212]"
            >
              <div className="w-full max-w-2xl space-y-8">
                <div className="text-center">
                  <h2 className="text-4xl font-black mb-2 tracking-tight">카드뉴스 바로 만들기</h2>
                  <p className="text-[var(--color-studio-text-dim)]">기사를 입력하면 AI가 예술적인 카드뉴스를 디자인합니다.</p>
                </div>

                <div className="bg-[var(--color-studio-panel)] p-1 rounded-2xl border border-[var(--color-studio-border)] shadow-2xl">
                  <textarea
                    placeholder="카드로 만들고 싶은 텍스트를 입력하세요..."
                    className="w-full h-64 p-8 bg-transparent border-none focus:ring-0 text-lg leading-relaxed placeholder:text-[var(--color-studio-text-dim)] resize-none"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <div className="p-4 border-t border-[var(--color-studio-border)] flex justify-end">
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !inputText.trim()}
                      className="btn-accent px-8 py-3 rounded-xl flex items-center gap-2 disabled:bg-neutral-800 disabled:text-neutral-500 transition-all font-bold"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Generate Story</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div key="preview" className="flex-1 flex h-full">
              {/* Sidebar Toolbar */}
              <div className="w-[340px] bg-[var(--color-studio-panel)] border-r border-[var(--color-studio-border)] p-6 overflow-y-auto flex flex-col gap-8">
                {/* Templates Group */}
                <div className="space-y-4">
                  <label className="text-[0.7rem] uppercase font-bold tracking-[1px] text-[var(--color-studio-text-dim)]">Themes</label>
                  <div className="grid grid-cols-2 gap-2">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setCurrentTheme(theme.id)}
                        className={`p-3 rounded border-2 text-[0.7rem] font-bold transition-all text-center ${
                          currentTheme === theme.id 
                            ? 'border-[var(--color-studio-accent)] text-[var(--color-studio-accent)]' 
                            : 'border-transparent bg-[#252525] text-[var(--color-studio-text-dim)] hover:text-white'
                        }`}
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Editor Group */}
                <div className="space-y-4">
                  <label className="text-[0.7rem] uppercase font-bold tracking-[1px] text-[var(--color-studio-text-dim)]">Content Editor</label>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={cards[activeCardIndex].title} 
                      onChange={(e) => updateCardContent(activeCardIndex, 'title', e.target.value)}
                      placeholder="Headline"
                      className="studio-input w-full p-4 rounded"
                    />
                    <textarea 
                      rows={6}
                      value={cards[activeCardIndex].content} 
                      onChange={(e) => updateCardContent(activeCardIndex, 'content', e.target.value)}
                      placeholder="Body Text"
                      className="studio-input w-full p-4 rounded resize-none"
                    />
                  </div>
                </div>

                {/* Branding Group */}
                <div className="space-y-4 mt-auto">
                   <label className="text-[0.7rem] uppercase font-bold tracking-[1px] text-[var(--color-studio-text-dim)]">Page Navigation</label>
                   <div className="flex items-center justify-between bg-[#252525] p-2 rounded border border-[var(--color-studio-border)]">
                      <button onClick={prevCard} className="p-2 hover:text-[var(--color-studio-accent)]"><ChevronLeft className="w-5 h-5"/></button>
                      <span className="text-sm font-mono tracking-widest">{activeCardIndex + 1} / {cards.length}</span>
                      <button onClick={nextCard} className="p-2 hover:text-[var(--color-studio-accent)]"><ChevronRight className="w-5 h-5"/></button>
                   </div>
                </div>
              </div>

              {/* Workspace View */}
              <div className="flex-1 bg-[#121212] flex items-center justify-center p-12 relative overflow-hidden">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeCardIndex}
                    initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 1.1, rotateY: -10 }}
                    transition={{ type: "spring", damping: 30, stiffness: 200 }}
                    className="w-full max-w-xl shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
                  >
                    <Card card={cards[activeCardIndex]} themeId={currentTheme} />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Tools UI */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-black/80 backdrop-blur-xl border border-[var(--color-studio-border)] py-3 px-6 rounded-full shadow-2xl">
                   <div className="flex items-center gap-4 border-r border-white/10 pr-6 mr-1">
                      <Layout className="w-4 h-4 text-[var(--color-studio-accent)]" />
                      <span className="text-[0.7rem] uppercase font-bold tracking-widest">Card News Studio</span>
                   </div>
                   <div className="flex items-center gap-4">
                      {cards.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveCardIndex(idx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            idx === activeCardIndex ? 'bg-[var(--color-studio-accent)] scale-150' : 'bg-white/20'
                          }`}
                        />
                      ))}
                   </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
