
import React from 'react';
import { AppMode, Language, UserProfile, ViewType } from '../types';
import { translations } from '../constants';

interface SidebarProps {
    mode: AppMode;
    language: Language;
    setLanguage: (lang: Language) => void;
    currentView: ViewType;
    setView: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mode, language, setLanguage, currentView, setView }) => {
    const t = (key: string) => {
        const langData = translations[language];
        return langData[key as keyof typeof langData] || key;
    };

    const userProfile: UserProfile = mode === 'training' 
        ? { name: 'Vivian', role: t('roleJunior'), initials: 'V' }
        : { name: 'Roberto', role: t('roleSenior'), initials: 'R' };

    return (
        <aside className="w-full md:w-64 bg-gray-900 border-b md:border-b-0 md:border-r border-gray-700 flex flex-col z-20 shadow-xl flex-shrink-0">
            <div className="p-6 text-center border-b border-gray-800">
                <img 
                    src="https://cdn.worldvectorlogo.com/logos/stara-1.svg" 
                    alt="Stara Logo" 
                    className="h-8 mx-auto mb-2 filter brightness-110" 
                />
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{t('appTitle')}</p>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {/* TRAINING MODE SECTION */}
                {mode === 'training' && (
                    <div className="animate-fade-in-up">
                        <p className="text-[10px] text-edu-green font-bold uppercase tracking-wider mb-2 px-3 border-l-2 border-edu-green">
                            {t('academiaStara')}
                        </p>
                        <div className="space-y-1">
                            <button 
                                onClick={() => setView('simulator')}
                                className={`w-full flex items-center p-2 rounded-l-lg transition-all ${
                                    currentView === 'simulator' 
                                    ? 'bg-gray-800 border-r-2 border-stara shadow-lg' 
                                    : 'text-gray-300 hover:bg-gray-800'
                                }`}
                            >
                                <span className={`material-icons-outlined mr-3 ${currentView === 'simulator' ? 'text-stara' : 'text-gray-500'}`}>school</span>
                                <span className={`text-sm font-medium ${currentView === 'simulator' ? 'text-white' : ''}`}>{t('trainingMode')}</span>
                            </button>
                            
                            <button 
                                onClick={() => setView('achievements')}
                                className={`w-full flex items-center p-2 rounded-l-lg transition-all ${
                                    currentView === 'achievements' 
                                    ? 'bg-gray-800 border-r-2 border-stara shadow-lg' 
                                    : 'text-gray-300 hover:bg-gray-800'
                                }`}
                            >
                                <span className={`material-icons-outlined mr-3 ${currentView === 'achievements' ? 'text-stara' : 'text-gray-500'}`}>emoji_events</span>
                                <span className={`text-sm font-medium ${currentView === 'achievements' ? 'text-white' : ''}`}>{t('achievements')}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* OPERATION MODE SECTION */}
                {mode === 'operation' && (
                    <div className="animate-fade-in-up">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2 px-3 border-l-2 border-gray-600">
                            {t('technicalTools')}
                        </p>
                        <div className="space-y-1">
                            <a href="#" className="flex items-center p-2 text-gray-300 hover:bg-gray-800 rounded-lg group transition-colors">
                                <span className="material-icons-outlined text-gray-500 mr-3">search</span>
                                <span className="text-sm font-medium">{t('quickConsult')}</span>
                            </a>
                            <a href="#" className="flex items-center p-2 text-gray-300 hover:bg-gray-800 rounded-lg group transition-colors">
                                <span className="material-icons-outlined text-gray-500 mr-3">description</span>
                                <span className="text-sm font-medium">{t('manualsPDF')}</span>
                            </a>
                        </div>
                    </div>
                )}

                {/* HISTORY (ALWAYS VISIBLE) */}
                <div className="border-t border-gray-800 pt-4">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-3 px-2">{t('recentHistory')}</p>
                    <div className="space-y-2">
                        <div className="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer transition">
                            <div className="w-2 h-2 rounded-full bg-stara mr-3 shadow-glow"></div>
                            <div>
                                <p className="text-xs font-semibold text-gray-200">{t('nozzle')}</p>
                                <p className="text-[10px] text-gray-500">{t('ago20min')}</p>
                            </div>
                        </div>
                        <div className="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer transition">
                            <div className="w-2 h-2 rounded-full bg-edu-blue mr-3"></div>
                            <div>
                                <p className="text-xs font-semibold text-gray-200">{t('sensor')}</p>
                                <p className="text-[10px] text-gray-500">{t('ago2hours')}</p>
                            </div>
                        </div>
                        <div className="flex items-center p-2 rounded hover:bg-gray-800 cursor-pointer transition">
                            <div className="w-2 h-2 rounded-full bg-gray-500 mr-3"></div>
                            <div>
                                <p className="text-xs font-semibold text-gray-200">{t('armWeld')}</p>
                                <p className="text-[10px] text-gray-500">{t('yesterday')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LANGUAGE SELECTOR */}
                <div className="pt-2 border-t border-gray-800">
                    <div className="flex items-center justify-between px-2 text-gray-400">
                        <div className="flex items-center">
                            <span className="material-icons-outlined text-sm mr-2">language</span>
                            <span className="text-xs">{t('language')}</span>
                        </div>
                        <select 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value as Language)}
                            className="bg-gray-800 text-xs text-white border border-gray-700 rounded p-1 focus:outline-none focus:border-stara"
                        >
                            <option value="pt">Português</option>
                            <option value="es">Español</option>
                        </select>
                    </div>
                </div>
            </nav>

            {/* USER PROFILE */}
            <div className="p-4 border-t border-gray-800 flex items-center bg-gray-850">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${mode === 'training' ? 'bg-gradient-to-tr from-stara to-yellow-500' : 'bg-gradient-to-tr from-gray-600 to-gray-400'}`}>
                    {userProfile.initials}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-white">{userProfile.name}</p>
                    <p className="text-xs text-gray-500">{userProfile.role}</p>
                </div>
            </div>
        </aside>
    );
};
