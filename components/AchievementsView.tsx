import React from 'react';
import { Language } from '../types';
import { translations } from '../constants';

interface AchievementsViewProps {
    language: Language;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ language }) => {
    const t = (key: string) => {
        const langData = translations[language];
        return langData[key as keyof typeof langData] || key;
    };

    const badges = [
        {
            id: 1,
            icon: 'flag',
            title: t('badgeFirstLogin'),
            desc: t('badgeFirstLoginDesc'),
            unlocked: true,
            date: '12/08/2023'
        },
        {
            id: 2,
            icon: 'water_drop',
            title: t('badgePumpMaster'),
            desc: t('badgePumpMasterDesc'),
            unlocked: true,
            date: '15/09/2023'
        },
        {
            id: 3,
            icon: 'health_and_safety',
            title: t('badgeSafety'),
            desc: t('badgeSafetyDesc'),
            unlocked: false,
            progress: 80
        },
        {
            id: 4,
            icon: 'build_circle',
            title: t('badgeMechanic'),
            desc: t('badgeMechanicDesc'),
            unlocked: false,
            progress: 35
        }
    ];

    return (
        <div className="w-full h-full bg-gray-900 p-8 overflow-y-auto animate-fade-in-up">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-stara pl-4 flex items-center">
                    {t('achievements')}
                    <span className="ml-4 text-sm font-normal text-gray-500 bg-gray-800 px-3 py-1 rounded-full">{t('trainingMode')}</span>
                </h2>

                {/* Hero Stats */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-850 rounded-2xl p-8 mb-10 shadow-2xl border border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-stara opacity-5 rounded-full filter blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-stara to-yellow-500 flex items-center justify-center text-4xl font-bold text-white shadow-glow border-4 border-gray-800">
                            V
                        </div>

                        {/* Stats */}
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Vivian</h3>
                                    <p className="text-stara font-medium">{t('roleJunior')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">{t('level')} 5</p>
                                    <p className="text-xl font-bold text-white">4.500 XP</p>
                                </div>
                            </div>
                            
                            {/* XP Bar */}
                            <div className="w-full bg-gray-700 rounded-full h-4 mb-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-stara to-yellow-500 h-full rounded-full w-[75%] shadow-[0_0_10px_rgba(255,102,0,0.5)] relative">
                                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-white opacity-20 animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{t('totalXp')}</span>
                                <span>{t('nextLevel')}: 6.000 XP</span>
                            </div>
                        </div>

                        {/* Extra Stat Cards */}
                        <div className="flex gap-4">
                            <div className="bg-gray-700/50 p-4 rounded-xl text-center border border-gray-600 w-28">
                                <span className="material-icons-outlined text-edu-green text-3xl mb-1">school</span>
                                <p className="text-2xl font-bold text-white">12</p>
                                <p className="text-[10px] text-gray-400 uppercase">{t('completedCourses')}</p>
                            </div>
                            <div className="bg-gray-700/50 p-4 rounded-xl text-center border border-gray-600 w-28">
                                <span className="material-icons-outlined text-edu-blue text-3xl mb-1">emoji_events</span>
                                <p className="text-2xl font-bold text-white">2/4</p>
                                <p className="text-[10px] text-gray-400 uppercase">Badges</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {badges.map((badge) => (
                        <div 
                            key={badge.id} 
                            className={`relative p-6 rounded-xl border transition-all duration-300 group ${
                                badge.unlocked 
                                ? 'bg-gray-800 border-stara/30 hover:border-stara hover:shadow-glow' 
                                : 'bg-gray-850 border-gray-700 opacity-70 grayscale hover:grayscale-0 hover:opacity-100'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${badge.unlocked ? 'bg-stara/20 text-stara' : 'bg-gray-700 text-gray-500'}`}>
                                    <span className="material-icons-outlined text-2xl">{badge.icon}</span>
                                </div>
                                {badge.unlocked ? (
                                    <span className="material-icons-outlined text-edu-green" title={t('unlocked')}>check_circle</span>
                                ) : (
                                    <span className="material-icons-outlined text-gray-600" title={t('locked')}>lock</span>
                                )}
                            </div>
                            
                            <h4 className="text-lg font-bold text-white mb-2">{badge.title}</h4>
                            <p className="text-sm text-gray-400 mb-4 h-10">{badge.desc}</p>
                            
                            {badge.unlocked ? (
                                <p className="text-xs text-stara font-medium flex items-center">
                                    <span className="material-icons-outlined text-sm mr-1">event</span>
                                    {badge.date}
                                </p>
                            ) : (
                                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                                    <div 
                                        className="bg-gray-500 h-full rounded-full" 
                                        style={{ width: `${badge.progress}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};