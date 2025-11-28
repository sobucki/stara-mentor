
import React, { useState, useEffect, useRef } from 'react';
import { AppMode, Language, ModelType, PartSelection, Message } from '../types';
import { translations } from '../constants';

interface ChatWidgetProps {
    mode: AppMode;
    language: Language;
    onModelChange: (model: ModelType) => void;
    partSelection: PartSelection | null;
    onStartGlassesMode: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ mode, language, onModelChange, partSelection, onStartGlassesMode }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const t = (key: string) => {
        const langData = translations[language];
        return langData[key as keyof typeof langData] || key;
    };

    // Simulation of existing conversation history
    useEffect(() => {
        const now = new Date();
        const t1 = new Date(now.getTime() - 120000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const t2 = new Date(now.getTime() - 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const t3 = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        let history: Message[] = [];

        if (mode === 'training') {
            history = [
                { id: '1', sender: 'bot', text: t('trainingGreeting'), time: t1, type: 'text' },
                { id: '2', sender: 'user', text: t('trainingUserSim'), time: t2, type: 'text' },
                { id: '3', sender: 'bot', text: t('trainingBotResponse'), time: t3, type: 'video_card' }
            ];
        } else {
            history = [
                { id: '1', sender: 'bot', text: t('operationGreeting'), time: t1, type: 'text' },
                { id: '2', sender: 'user', text: t('operationUserSim'), time: t2, type: 'text' },
                { id: '3', sender: 'bot', text: t('operationBotResponse'), time: t3, type: 'text' }
            ];
        }

        setMessages(history);
    }, [mode, language]);

    // React to External Part Selection
    useEffect(() => {
        if (partSelection) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            let newMsg: Message | null = null;

            if (mode === 'training') {
                newMsg = {
                    id: Date.now() + 'trigger',
                    sender: 'bot',
                    text: null,
                    type: 'training_options',
                    partName: partSelection.name,
                    time: time
                };
            } else {
                newMsg = {
                    id: Date.now() + 'trigger',
                    sender: 'bot',
                    text: t('opClickDetails'),
                    type: 'operation_info',
                    partName: partSelection.name,
                    time: time
                };
            }
            
            if (newMsg) setMessages(prev => [...prev, newMsg!]);
        }
    }, [partSelection, mode, language]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const userMsg: Message = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputValue,
            time: time,
            type: 'text'
        };

        setMessages(prev => [...prev, userMsg]);
        
        // --- 3D Model Trigger Logic ---
        const lowerText = inputValue.toLowerCase();
        if (lowerText.includes('engrenagem')) {
            onModelChange('gear');
        } else if (lowerText.includes('modulo de bomba') || lowerText.includes('módulo de bomba')) {
            onModelChange('pump');
        }

        setInputValue('');

        // Generic "Thinking" response
        setTimeout(() => {
            const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const botMsg: Message = {
                id: Date.now() + 'bot',
                sender: 'bot',
                text: "...",
                time: responseTime,
                type: 'text'
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    return (
        <aside className="w-full md:w-[350px] bg-gray-800 border-t md:border-t-0 md:border-l border-gray-700 flex flex-col z-20 shadow-2xl h-[40vh] md:h-full transition-all duration-300">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 bg-gray-850 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center">
                    <div className="relative">
                        <div className="w-10 h-10 bg-stara rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-glow">
                            <span className="material-icons-outlined" style={{ fontSize: '24px' }}>smart_toy</span>
                        </div>
                        <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-gray-800"></span>
                        </span>
                    </div>
                    <div className="ml-3">
                        <h2 className="text-sm font-bold text-white">{t('botName')}</h2>
                        <p className="text-xs text-stara">{t('botStatus')} • Mentor</p>
                    </div>
                </div>
                
                {/* Video/Glasses Mode Button */}
                <button 
                    onClick={onStartGlassesMode}
                    className="p-2 bg-gray-700 hover:bg-stara text-gray-300 hover:text-white rounded-full transition-colors duration-300 flex items-center justify-center group relative"
                    title={t('aiGlassesMode')}
                >
                    <svg viewBox="0 0 28 12" fill="currentColor" className="w-5 h-5">
                        <path d="M26.2,0H19c-3,0-4.8,2.3-5,2.6C13.8,2.3,12,0,9,0H1.8C0.8,0,0,0.8,0,1.8v2.4c0,4.3,3.5,7.8,7.8,7.8h1.4c1.6,0,2.8-1.3,2.8-2.8V6.6c0-0.4,0.3-0.8,0.8-0.8h2.4c0.4,0,0.8,0.3,0.8,0.8v2.6c0,1.6,1.3,2.8,2.8,2.8h1.4c4.3,0,7.8-3.5,7.8-7.8V1.8C28,0.8,27.2,0,26.2,0z"/>
                    </svg>
                    <span className="absolute top-0 right-0 w-2 h-2 bg-edu-green rounded-full border border-gray-700"></span>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800 scroll-smooth">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end ml-auto' : 'items-start'} max-w-[90%]`}>
                        
                        {/* Standard Text Bubble */}
                        {msg.type === 'text' && msg.text && (
                            <div className={`p-3 rounded-2xl text-sm shadow-sm border ${
                                msg.sender === 'user' 
                                    ? 'bg-blue-600 text-white rounded-tr-none border-blue-500' 
                                    : 'bg-gray-700 text-gray-200 rounded-tl-none border-gray-600'
                            }`}>
                                {msg.text}
                            </div>
                        )}

                        {/* Video Card */}
                        {msg.type === 'video_card' && (
                            <div className="mt-2 bg-gray-900 border border-edu-green/30 rounded-xl overflow-hidden w-full shadow-lg relative group animate-fade-in-up">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-edu-green z-10"></div>
                                <div className="h-32 bg-gray-700 relative overflow-hidden cursor-pointer pl-1 group">
                                    <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center group-hover:bg-black/20 transition">
                                        <div className="w-10 h-10 bg-stara rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                            <span className="material-icons-outlined text-white ml-1">play_arrow</span>
                                        </div>
                                    </div>
                                    <img src="https://picsum.photos/400/225" alt="Video Thumbnail" className="w-full h-full object-cover opacity-80" />
                                </div>
                                <div className="p-3 pl-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-gray-200 text-xs">{t('videoTitle')}</h4>
                                        <span className="text-[9px] bg-edu-green text-white px-1.5 py-0.5 rounded">{t('juniorTag')}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mb-3">{t('visualStep')}</p>
                                    <button className="w-full py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold rounded flex items-center justify-center transition gap-2">
                                        <span className="material-icons-outlined" style={{fontSize: 14}}>play_circle</span>
                                        {t('watchTutorial')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Training Options */}
                        {msg.type === 'training_options' && (
                            <div className="bg-gray-700 p-3 rounded-2xl rounded-tl-none border border-gray-600 w-full animate-fade-in-up">
                                <p className="text-sm text-gray-200 mb-2">
                                    {t('trainingClickIntro')} <strong>{msg.partName}</strong>.
                                    <br/>
                                    {t('trainingClickPrompt')}
                                </p>
                                <div className="flex flex-col gap-2 mt-2">
                                    <button className="bg-gray-800 hover:bg-edu-green hover:text-white border border-gray-600 text-gray-300 py-2 px-3 rounded-lg text-xs font-medium transition text-left flex items-center">
                                        <span className="material-icons-outlined text-sm mr-2">lightbulb</span>
                                        {t('optHowItWorks')}
                                    </button>
                                    <button className="bg-gray-800 hover:bg-edu-green hover:text-white border border-gray-600 text-gray-300 py-2 px-3 rounded-lg text-xs font-medium transition text-left flex items-center">
                                        <span className="material-icons-outlined text-sm mr-2">build</span>
                                        {t('optCommonErrors')}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Operation Info */}
                        {msg.type === 'operation_info' && (
                            <div className="bg-gray-800 p-0 rounded-2xl rounded-tl-none border border-gray-600 w-full animate-fade-in-up overflow-hidden shadow-lg">
                                <div className="bg-gray-900 p-3 border-b border-gray-700 flex items-center justify-between">
                                    <span className="text-white text-xs font-bold uppercase">{t('opClickIntro')} {msg.partName}</span>
                                    <span className="material-icons-outlined text-stara text-sm">warning</span>
                                </div>
                                <div className="p-3">
                                    <p className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                                        {msg.text}
                                    </p>
                                </div>
                            </div>
                        )}

                        <span className={`text-[10px] text-gray-500 mt-1 ${msg.sender === 'user' ? 'mr-1' : 'ml-1'}`}>{msg.time}</span>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-850 border-t border-gray-700 flex-shrink-0">
                <div className="relative flex gap-2">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={t('inputPlaceholder')}
                        className="flex-1 bg-gray-900 border border-gray-600 text-white text-sm rounded-full py-3 pl-4 pr-10 focus:outline-none focus:border-stara focus:ring-1 focus:ring-stara transition-colors placeholder-gray-500"
                    />
                    <button 
                        className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition shadow-lg flex-shrink-0 flex items-center justify-center"
                        title="Gravar áudio"
                    >
                        <span className="material-icons-outlined" style={{ fontSize: '20px' }}>mic</span>
                    </button>
                    <button 
                        onClick={handleSendMessage}
                        className="p-3 bg-stara hover:bg-orange-500 text-white rounded-full transition shadow-glow flex-shrink-0 flex items-center justify-center"
                    >
                        <span className="material-icons-outlined" style={{ fontSize: '18px', transform: 'rotate(-45deg)', marginLeft: '2px', marginTop: '2px' }}>send</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};
