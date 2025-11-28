
import React, { useEffect, useState } from 'react';
import { Language } from '../types';
import { translations } from '../constants';

interface AIGlassesOverlayProps {
    language: Language;
    onClose: () => void;
}

export const AIGlassesOverlay: React.FC<AIGlassesOverlayProps> = ({ language, onClose }) => {
    const [time, setTime] = useState('');
    const [isListening, setIsListening] = useState(true);

    const t = (key: string) => {
        const langData = translations[language];
        return langData[key as keyof typeof langData] || key;
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        
        // Simulate listening/processing toggle
        const toggleInterval = setInterval(() => {
            setIsListening(prev => !prev);
        }, 4000);

        return () => {
            clearInterval(interval);
            clearInterval(toggleInterval);
        };
    }, []);

    return (
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col justify-between overflow-hidden">
            {/* Vignette & Scanlines Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>
            <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>

            {/* Top HUD */}
            <div className="flex justify-between items-start p-6 pt-8 animate-fade-in-up">
                {/* Left Info */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-600/50">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-mono font-bold text-red-500 tracking-widest">REC</span>
                        <span className="text-xs font-mono text-gray-300 ml-2">{time}</span>
                    </div>
                    <div className="text-[10px] font-mono text-stara uppercase tracking-widest mt-1 opacity-80">
                        {t('systemCheck')}: OK
                    </div>
                </div>

                {/* Right Info */}
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">{t('connectionStable')}</span>
                        <div className="flex gap-0.5">
                            <div className="w-1 h-3 bg-stara"></div>
                            <div className="w-1 h-3 bg-stara"></div>
                            <div className="w-1 h-3 bg-stara"></div>
                            <div className="w-1 h-3 bg-gray-600"></div>
                        </div>
                    </div>
                    <div className="text-2xl text-white">
                        <span className="material-icons-outlined">battery_std</span>
                    </div>
                </div>
            </div>

            {/* Central Targeting Reticle (Subtle) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/10 rounded-lg pointer-events-none flex items-center justify-center">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-stara"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-stara"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-stara"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-stara"></div>
                <div className="w-1 h-1 bg-stara/50 rounded-full"></div>
            </div>

            {/* Bottom HUD (AI Interaction) */}
            <div className="p-8 pb-10 flex flex-col items-center justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                
                {/* AI Text Output */}
                <div className="mb-6 max-w-2xl text-center">
                    <p className="text-lg md:text-xl font-medium text-white drop-shadow-lg leading-relaxed font-sans">
                        "{isListening ? t('glassesOverlayText') : '...'}"
                    </p>
                </div>

                {/* Audio Visualizer & Status */}
                <div className="flex items-center justify-between w-full max-w-3xl pointer-events-auto">
                    
                    {/* Status Indicator */}
                    <div className="flex items-center gap-3 w-1/3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isListening ? 'border-stara bg-stara/20' : 'border-blue-500 bg-blue-500/20'}`}>
                            <span className="material-icons-outlined text-white">
                                {isListening ? 'smart_toy' : 'mic'}
                            </span>
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wider text-white">
                            {isListening ? t('processing') : t('listening')}
                        </span>
                    </div>

                    {/* Waveform Animation */}
                    <div className="flex items-center justify-center gap-1 h-12 w-1/3">
                        {[...Array(8)].map((_, i) => (
                            <div 
                                key={i}
                                className={`w-1.5 bg-white rounded-full transition-all duration-150 ${isListening ? 'bg-stara' : 'bg-blue-400'}`}
                                style={{
                                    height: `${Math.random() * 100}%`,
                                    opacity: 0.8,
                                    animation: `pulse 0.5s infinite ${i * 0.1}s`
                                }}
                            ></div>
                        ))}
                    </div>

                    {/* Controls */}
                    <div className="flex justify-end w-1/3">
                        <button 
                            onClick={onClose}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-transform hover:scale-105"
                        >
                            <span className="material-icons-outlined">call_end</span>
                            {t('endCall')}
                        </button>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
                    50% { transform: scaleY(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};
