
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Card from './components/Card';
import { getYouTubeID, constructEmbedUrl } from './utils';
import { Screen } from './types';

// Define NavItem component
const NavItem: React.FC<{ icon: string; active?: boolean; onClick: () => void }> = ({ icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-12 h-12 flex items-center justify-center text-lg rounded-xl transition-all ${active ? 'text-[#301934] bg-[#301934]/5' : 'text-gray-400 hover:text-gray-600'}`}
  >
    <i className={`fas ${icon}`}></i>
  </button>
);

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('home');
  const [videoUrl, setVideoUrl] = useState('');
  const [windowCount, setWindowCount] = useState<number>(30); 
  const [showDialog, setShowDialog] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [mode, setMode] = useState<'views' | 'subs' | 'watchtime'>('views');
  const [loadedFrames, setLoadedFrames] = useState<Record<number, boolean>>({});
  
  // STAGGERED LOADING: One by one to avoid triggering spam blocks
  const [visibleCount, setVisibleCount] = useState(0);

  // Constants
  const MIN_WINDOWS = 1;
  const MAX_WINDOWS = 100;

  const isValidUrl = useMemo(() => {
    if (!videoUrl) return null;
    return getYouTubeID(videoUrl) !== null;
  }, [videoUrl]);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1);
    const nextTime = mode === 'subs' ? 45 : (mode === 'watchtime' ? 120 : 60);
    setTimeLeft(nextTime);
    setLoadedFrames({});
    setVisibleCount(0); // Restart loading sequence
  }, [mode]);

  // Staggered loading: increment visibleCount one by one
  useEffect(() => {
    if (screen === 'viewer' && visibleCount < windowCount) {
      const timer = window.setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, visibleCount === 0 ? 0 : 1500); // 1.5 second delay per node for maximum safety
      return () => clearTimeout(timer);
    }
  }, [screen, visibleCount, windowCount, refreshKey]);

  useEffect(() => {
    let interval: number | undefined;
    if (screen === 'viewer' && isAutoRefresh) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            triggerRefresh();
            return mode === 'subs' ? 45 : (mode === 'watchtime' ? 120 : 60);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, isAutoRefresh, triggerRefresh, mode]);

  const handleStart = () => {
    if (!isValidUrl) return;
    setScreen('viewer');
    setVisibleCount(0);
    setRefreshKey(prev => prev + 1);
  };

  const handleBack = () => {
    if (screen === 'viewer') {
      setScreen('setup');
      setVisibleCount(0);
    } else if (screen === 'setup') {
      setScreen('home');
    }
  };

  const renderHome = () => (
    <div className="animate-in fade-in duration-1000 pb-24 bg-gray-50/30 min-h-screen">
      <div className="relative pt-12 pb-20 px-8 bg-gradient-to-br from-[#301934] via-[#4a2650] to-[#1a0d1c] text-white rounded-b-[50px] shadow-2xl overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-8 relative group" onClick={() => setScreen('setup')}>
            <div className="w-28 h-28 bg-white/10 backdrop-blur-2xl rounded-[32px] flex items-center justify-center border border-white/20 shadow-2xl transform group-hover:rotate-0 -rotate-12 transition-all duration-700 cursor-pointer">
              <i className="fas fa-play text-5xl text-white"></i>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-[#301934] animate-bounce"></div>
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-4xl font-black tracking-tighter leading-none italic uppercase">Creator Pro</h2>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Engine v3.0 | Pure Mode</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-2 gap-5">
          <Card 
            title="Views Boost" 
            subtitle="Rapid Engine"
            icon="fa-bolt-lightning"
            badge="HOT"
            iconColor="bg-blue-50 text-blue-600"
            onClick={() => { setMode('views'); setScreen('setup'); }}
          />
          <Card 
            title="Watch Time" 
            subtitle="Long Session"
            icon="fa-clock-rotate-left"
            iconColor="bg-green-50 text-green-600"
            onClick={() => { setMode('watchtime'); setScreen('setup'); }}
          />
          <Card 
            title="Subscribers" 
            subtitle="Channel Growth"
            icon="fa-user-plus"
            badge="NEW"
            iconColor="bg-red-50 text-red-600"
            onClick={() => { setMode('subs'); setScreen('setup'); }}
          />
          <Card 
            title="Reset Cache" 
            subtitle="Clean Config"
            icon="fa-trash-can"
            iconColor="bg-orange-50 text-orange-600"
            onClick={() => {
               localStorage.clear();
               alert("Cache cleared! Relaunching in Pure Mode.");
               window.location.reload();
            }}
          />
        </div>

        <div className="mt-8 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
           <div className="flex items-center justify-between">
              <h4 className="text-gray-900 text-[12px] font-black uppercase tracking-tight">Pure Logic Mode</h4>
              <span className="text-[10px] text-green-500 font-black tracking-widest">ENABLED</span>
           </div>
           <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
             Pure Mode strips away all headers that cause <span className="text-red-500 font-bold">Error 153</span>. It uses standard YouTube embeds with a 1500ms staggered delay for maximum stability.
           </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-20 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-around px-8 z-[50]">
         <NavItem icon="fa-house" active onClick={() => setScreen('home')} />
         <NavItem icon="fa-rocket" onClick={() => setScreen('setup')} />
         <div className="w-14 h-14 bg-[#301934] text-white rounded-2xl shadow-xl flex items-center justify-center -translate-y-6 border-4 border-white active:scale-90 transition-all cursor-pointer" onClick={() => setScreen('setup')}>
           <i className="fas fa-plus text-xl"></i>
         </div>
         <NavItem icon="fa-chart-simple" onClick={() => alert("Stats coming soon!")} />
         <NavItem icon="fa-user-gear" onClick={() => setScreen('setup')} />
      </div>
    </div>
  );

  const renderSetup = () => (
    <div className="p-8 space-y-10 animate-in slide-in-from-bottom-10 duration-500 h-full flex flex-col justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
          Launch Node
        </h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">Mode: {mode.toUpperCase()}</p>
      </div>

      <div className="space-y-8">
        <input 
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube Link..."
          className="w-full bg-gray-50 border-2 border-gray-100 p-6 rounded-[28px] text-center font-black text-gray-800 focus:border-[#301934] transition-all"
        />

        <div className="space-y-6 text-center">
          <div className="flex justify-center gap-8 items-center">
             <button onClick={() => setWindowCount(Math.max(1, windowCount-1))} className="w-12 h-12 bg-gray-100 rounded-2xl active:scale-90 transition-all"><i className="fas fa-minus text-gray-400"></i></button>
             <span className="text-7xl font-black text-[#301934] tracking-tighter">{windowCount}</span>
             <button onClick={() => setWindowCount(Math.min(100, windowCount+1))} className="w-12 h-12 bg-gray-100 rounded-2xl active:scale-90 transition-all"><i className="fas fa-plus text-gray-400"></i></button>
          </div>
          <div className="flex justify-center gap-2">
             {[1, 10, 20, 50, 100].map(val => (
               <button 
                key={val} 
                onClick={() => setWindowCount(val)}
                className={`w-10 h-10 rounded-lg text-[9px] font-black uppercase ${windowCount === val ? 'bg-[#301934] text-white' : 'bg-gray-100 text-gray-400'}`}
               >
                 {val}
               </button>
             ))}
          </div>
        </div>
      </div>

      <button 
        onClick={handleStart}
        disabled={!isValidUrl}
        className={`w-full py-7 rounded-[32px] font-black uppercase tracking-[0.3em] text-sm shadow-2xl transition-all ${isValidUrl ? 'bg-[#301934] text-white active:scale-95' : 'bg-gray-100 text-gray-300'}`}
      >
        Ignite Matrix
      </button>
    </div>
  );

  const renderViewer = () => {
    const videoId = getYouTubeID(videoUrl);
    if (!videoId) return null;

    return (
      <div className="bg-[#050505] min-h-screen pb-40">
        <div className="bg-[#1a0d1c] p-5 sticky top-0 z-50 flex items-center justify-between border-b border-white/5 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10">
               <span className="text-sm font-black italic">{timeLeft}s</span>
            </div>
            <div>
              <p className="text-[8px] text-white/30 font-black uppercase tracking-widest">Sequencing</p>
              <h4 className="text-white text-[10px] font-black uppercase">
                {visibleCount < windowCount ? `INIT: ${visibleCount}/${windowCount}` : 'MATRIX LIVE'}
              </h4>
            </div>
          </div>
          <button onClick={triggerRefresh} className="w-12 h-12 bg-[#301934] text-white rounded-2xl flex items-center justify-center border border-white/10 active:rotate-180 transition-all duration-500">
            <i className="fas fa-sync-alt"></i>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1">
          {Array.from({ length: windowCount }).map((_, i) => {
            const isVisible = i < visibleCount;
            return (
              <div key={`${refreshKey}-${i}`} className="aspect-video bg-[#111] rounded overflow-hidden relative border border-white/5">
                {isVisible ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={constructEmbedUrl(videoId, i, refreshKey)}
                    title={`node-${i}`}
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    onLoad={() => setLoadedFrames(prev => ({ ...prev, [i]: true }))}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30">
                     <span className="text-[7px] text-white/10 font-black uppercase">Pending...</span>
                  </div>
                )}
                
                {isVisible && !loadedFrames[i] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                     <div className="w-3 h-3 border border-white/10 border-t-white rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] bg-white/5 backdrop-blur-3xl border border-white/10 p-5 rounded-[32px] flex items-center justify-between z-50 shadow-2xl">
           <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-[9px] text-white/50 font-black uppercase tracking-widest">
                Nodes: {visibleCount}
              </p>
           </div>
           <div className="flex gap-2">
             <button onClick={() => setIsAutoRefresh(!isAutoRefresh)} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${isAutoRefresh ? 'border-green-500/50 text-green-500' : 'border-white/10 text-white/40'}`}>
                {isAutoRefresh ? 'AUTO' : 'MANUAL'}
             </button>
             <button onClick={handleBack} className="bg-red-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
               Abort
             </button>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-[500px] mx-auto bg-white min-h-screen relative overflow-x-hidden shadow-2xl flex flex-col font-['Poppins']">
      {screen !== 'viewer' && (
        <Header 
          showBack={screen !== 'home'} 
          onBack={handleBack} 
        />
      )}
      
      <main className="flex-1 overflow-y-auto">
        {screen === 'home' && renderHome()}
        {screen === 'setup' && renderSetup()}
        {screen === 'viewer' && renderViewer()}
      </main>
    </div>
  );
};

export default App;
