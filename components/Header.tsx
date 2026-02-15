
import React, { useState } from 'react';

interface HeaderProps {
  onBack?: () => void;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onBack, showBack }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarClick = (label: string) => {
    alert(`${label} feature is coming soon in the next update!`);
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="bg-[#301934] text-white p-4 flex items-center justify-between sticky top-0 z-[60] shadow-xl">
        <div className="flex items-center gap-4">
          {showBack ? (
            <button 
              onClick={onBack} 
              className="w-10 h-10 flex items-center justify-center bg-white/10 active:bg-white/20 rounded-xl transition-all"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
          ) : (
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="w-10 h-10 flex items-center justify-center bg-white/10 active:bg-white/20 rounded-xl transition-all"
            >
              <i className="fas fa-bars"></i>
            </button>
          )}
          <div>
            <h1 className="text-sm font-black italic tracking-tight uppercase leading-none">Creator Pro</h1>
            <p className="text-[9px] text-white/50 font-bold uppercase tracking-widest mt-0.5">Multi-Browser v2.5</p>
          </div>
        </div>
        <button 
          onClick={() => alert("Rate us 5 stars on the store!")}
          className="w-10 h-10 flex items-center justify-center bg-yellow-500/10 text-yellow-500 rounded-xl active:scale-90 transition-all"
        >
          <i className="fas fa-star"></i>
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white z-[80] shadow-2xl transform transition-transform duration-500 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="bg-gradient-to-br from-[#301934] to-[#4a2650] p-10 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[24px] mx-auto mb-6 flex items-center justify-center text-white text-4xl shadow-2xl border border-white/20 transform -rotate-6">
               <i className="fas fa-rocket"></i>
            </div>
            <h2 className="text-xl font-black italic tracking-tighter uppercase">Creator Pro</h2>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">Multi Watch Engine</p>
          </div>
          
          {/* Animated Background Text Decor */}
          <div className="absolute inset-0 opacity-[0.03] flex flex-wrap gap-4 text-[8px] font-black rotate-12 pointer-events-none select-none">
            {Array.from({ length: 80 }).map((_, i) => (
              <span key={i}>CREATOR PRO ENGINE</span>
            ))}
          </div>
        </div>

        <nav className="p-6 space-y-3">
          <SidebarItem icon="fa-sync-alt" label="Check for Updates" color="text-blue-500" onClick={() => handleSidebarClick('Update')} />
          <SidebarItem icon="fa-star" label="Rate the App" color="text-yellow-500" onClick={() => handleSidebarClick('Rating')} />
          <SidebarItem icon="fa-share-nodes" label="Share with Friends" color="text-green-500" onClick={() => handleSidebarClick('Share')} />
          <SidebarItem icon="fa-shield-halved" label="Privacy Policy" color="text-purple-500" onClick={() => handleSidebarClick('Privacy')} />
          <SidebarItem icon="fa-circle-question" label="Help & Support" color="text-orange-500" onClick={() => handleSidebarClick('Support')} />
          
          <div className="pt-10">
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="w-full flex items-center justify-center gap-3 p-4 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
              <i className="fas fa-circle-xmark text-lg"></i>
              <span>Close Menu</span>
            </button>
          </div>
        </nav>
        
        <div className="absolute bottom-6 left-0 w-full text-center">
           <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">Build 2025.02.19</p>
        </div>
      </div>
    </>
  );
};

const SidebarItem: React.FC<{ icon: string; label: string; color: string; onClick: () => void }> = ({ icon, label, color, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 text-gray-700 hover:bg-gray-50 rounded-2xl transition-all active:scale-[0.98] group"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${color} bg-current/10`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <span className="font-black text-xs uppercase tracking-wider group-hover:text-[#301934] transition-colors">{label}</span>
  </button>
);

export default Header;
