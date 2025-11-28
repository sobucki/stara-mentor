
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWidget } from './components/ChatWidget';
import { ThreeScene } from './components/ThreeScene';
import { AchievementsView } from './components/AchievementsView';
import { AIGlassesOverlay } from './components/AIGlassesOverlay';
import { translations } from './constants';
import { AppMode, Language, ModelType, PartSelection, ViewType } from './types';

const App: React.FC = () => {
    const [mode, setMode] = useState<AppMode>('training');
    const [view, setView] = useState<ViewType>('simulator');
    const [language, setLanguage] = useState<Language>('pt');
    const [modelType, setModelType] = useState<ModelType>('pump');
    const [partSelection, setPartSelection] = useState<PartSelection | null>(null);
    const [isGlassesMode, setIsGlassesMode] = useState(false);

    // Reset view to simulator when switching modes
    useEffect(() => {
        if (mode === 'operation') {
            setView('simulator');
        }
    }, [mode]);

    const t = (key: string) => {
        const langData = translations[language];
        return langData[key as keyof typeof langData] || key;
    };

    const currentModelName = modelType === 'pump' ? t('pumpModule') : t('gearComponent');

    return (
        <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-gray-900 text-gray-100 font-sans">
            
            {/* 1. SIDEBAR (Hidden in Glasses Mode) */}
            {!isGlassesMode && (
                <Sidebar 
                    mode={mode} 
                    language={language} 
                    setLanguage={setLanguage}
                    currentView={view}
                    setView={setView}
                />
            )}

            {/* 2. MAIN CONTENT */}
            <main className="flex-1 relative bg-gray-900 flex flex-col min-h-0">
                
                {/* AI Glasses Overlay */}
                {isGlassesMode && (
                    <AIGlassesOverlay 
                        language={language} 
                        onClose={() => setIsGlassesMode(false)} 
                    />
                )}

                {/* Header Overlay - Only visible in Simulator View and NOT in Glasses Mode */}
                {view === 'simulator' && !isGlassesMode && (
                    <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                        <div className="pointer-events-auto">
                            <h1 className="text-xl font-bold text-white tracking-tight mb-2 drop-shadow-md">
                                {t('machineTitle')} <span className="text-stara font-normal">| {currentModelName}</span>
                            </h1>
                            
                            {/* THE SWITCH */}
                            <div className="inline-flex bg-gray-800 rounded-full p-1 border border-gray-700 shadow-lg backdrop-blur-sm">
                                <button 
                                    onClick={() => setMode('training')}
                                    className={`px-4 py-1.5 rounded-full text-xs transition-all duration-300 flex items-center gap-2 ${
                                        mode === 'training' 
                                            ? 'bg-edu-green text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]' 
                                            : 'text-gray-400 font-medium hover:text-white'
                                    }`}
                                >
                                    {mode === 'training' && <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>}
                                    {t('trainingMode')}
                                </button>
                                <button 
                                    onClick={() => setMode('operation')}
                                    className={`px-4 py-1.5 rounded-full text-xs transition-all duration-300 flex items-center gap-2 ${
                                        mode === 'operation' 
                                            ? 'bg-gray-600 text-white font-bold shadow-lg' 
                                            : 'text-gray-400 font-medium hover:text-white'
                                    }`}
                                >
                                    {t('operationMode')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content Switching */}
                {view === 'simulator' ? (
                    <>
                        {/* 3D Scene */}
                        <ThreeScene mode={mode} modelType={modelType} onPartClick={setPartSelection} />

                        {/* Bottom Toolbar (Visual only, hidden in glasses mode) */}
                        {!isGlassesMode && (
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 bg-gray-800/90 backdrop-blur border border-gray-600 rounded-full px-4 py-2 flex space-x-4 shadow-lg">
                                <button className="text-gray-300 hover:text-stara transition p-1"><span className="material-icons-outlined">add</span></button>
                                <button className="text-gray-300 hover:text-stara transition p-1"><span className="material-icons-outlined">remove</span></button>
                                <div className="w-px bg-gray-600 h-6 my-auto"></div>
                                <button className="text-gray-300 hover:text-stara transition p-1"><span className="material-icons-outlined">3d_rotation</span></button>
                                <button className="text-gray-300 hover:text-stara transition p-1"><span className="material-icons-outlined">restart_alt</span></button>
                            </div>
                        )}
                    </>
                ) : (
                    <AchievementsView language={language} />
                )}

            </main>

            {/* 3. CHAT WIDGET (Hidden in Glasses Mode) */}
            {!isGlassesMode && (
                <ChatWidget 
                    mode={mode} 
                    language={language} 
                    onModelChange={setModelType} 
                    partSelection={partSelection} 
                    onStartGlassesMode={() => setIsGlassesMode(true)}
                />
            )}

        </div>
    );
};

export default App;
