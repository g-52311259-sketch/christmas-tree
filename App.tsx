import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Experience } from './components/Experience';
import { UIOverlay } from './components/UIOverlay';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.SCATTERED);
  const [showGreeting, setShowGreeting] = useState(false);
  
  const toggleState = useCallback(() => {
    setAppState((prev) => {
      const newState = prev === AppState.SCATTERED ? AppState.TREE_SHAPE : AppState.SCATTERED;
      
      // Logic for showing greeting
      if (newState === AppState.TREE_SHAPE) {
        // Delay showing text slightly for dramatic effect after tree forms
        setTimeout(() => setShowGreeting(true), 1200);
      } else {
        setShowGreeting(false);
      }
      
      return newState;
    });
  }, []);

  const handleInteraction = useCallback(() => {
    // If scattered, form tree. If tree, just ensure text is shown.
    if (appState === AppState.SCATTERED) {
      toggleState();
    } else {
      setShowGreeting(prev => !prev);
    }
  }, [appState, toggleState]);

  return (
    <div className="relative w-full h-screen bg-black">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          // Moved camera z from 18 to 22 to see the whole tree and star clearly
          camera={{ position: [0, 0, 22], fov: 35 }}
          dpr={[1, 2]} // Optimize pixel ratio
          gl={{ 
            antialias: false, // Post-processing handles AA usually, or we turn off for bloom perf
            toneMappingExposure: 1.5 
          }}
        >
          <Experience 
            appState={appState} 
            onInteraction={handleInteraction}
          />
        </Canvas>
      </div>

      {/* UI Overlay Layer */}
      <UIOverlay 
        appState={appState} 
        showGreeting={showGreeting} 
        onToggleState={toggleState} 
      />
    </div>
  );
};

export default App;