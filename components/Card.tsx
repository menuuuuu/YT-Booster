
import React from 'react';

interface CardProps {
  title: string;
  subtitle?: string;
  icon: string;
  iconColor: string;
  badge?: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, subtitle, icon, iconColor, badge, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="relative w-full bg-white border border-gray-100 rounded-[24px] p-6 flex flex-col items-start text-left shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all active:scale-[0.96] group overflow-hidden"
    >
      {badge && (
        <span className="absolute top-3 right-3 bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter z-10">
          {badge}
        </span>
      )}
      
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner mb-4 transition-transform group-hover:scale-110 duration-300 ${iconColor}`}>
        <i className={`fas ${icon}`}></i>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-gray-900 text-sm font-bold leading-tight group-hover:text-[#301934] transition-colors">{title}</h3>
        {subtitle && <p className="text-[10px] text-gray-400 font-semibold tracking-wide uppercase">{subtitle}</p>}
      </div>

      {/* Subtle decorative element */}
      <div className="absolute -bottom-2 -right-2 opacity-[0.03] text-4xl group-hover:opacity-[0.07] transition-opacity duration-500">
        <i className={`fas ${icon}`}></i>
      </div>
    </button>
  );
};

export default Card;
