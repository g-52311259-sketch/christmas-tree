import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';
import { AppState } from '../types';

interface UIOverlayProps {
  appState: AppState;
  showGreeting: boolean;
  onToggleState: () => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ 
  appState, 
  showGreeting, 
  onToggleState
}) => {
  const isScattered = appState === AppState.SCATTERED;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-8 z-10">
      
      {/* Header */}
      <header className="w-full flex justify-between items-start">
        <div className="text-white/50 text-xs tracking-[0.3em] font-cinematic uppercase">
          Jenni Collection
        </div>
      </header>

      {/* Center Message */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {showGreeting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-center"
            >
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-elegant text-gold-gradient leading-tight drop-shadow-[0_0_25px_rgba(255,215,0,0.6)]">
                Merry <br/> Christmas
              </h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="mt-6 text-emerald-200 font-cinematic tracking-[0.4em] text-sm md:text-lg uppercase drop-shadow-[0_0_10px_rgba(80,200,120,0.8)]"
              >
                MAY YOUR DREAM COME TRUE
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="pointer-events-auto mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleState}
          className={`
            group relative px-8 py-4 
            border border-emerald-500/30 bg-black/40 backdrop-blur-md 
            rounded-full overflow-hidden transition-all duration-500
            ${!isScattered ? 'border-amber-500/50 shadow-[0_0_30px_-5px_rgba(251,191,36,0.5)]' : 'shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]'}
          `}
        >
          {/* Button Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/0 via-emerald-500/10 to-emerald-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex items-center gap-3 relative z-10">
            {isScattered ? (
              <>
                <Wand2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-100 font-cinematic tracking-widest text-sm">
                  ASSEMBLE TREE
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-amber-100 font-cinematic tracking-widest text-sm">
                  SCATTER MAGIC
                </span>
              </>
            )}
          </div>
        </motion.button>
      </div>
    </div>
  );
};