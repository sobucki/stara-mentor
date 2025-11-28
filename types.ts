export type AppMode = 'training' | 'operation';
export type Language = 'pt' | 'es';
export type ModelType = 'pump' | 'gear';
export type ViewType = 'simulator' | 'achievements';

export interface PartSelection {
    name: string;
    timestamp: number;
}

export type MessageType = 'text' | 'video_card' | 'training_options' | 'operation_info';

export interface Message {
    id: string;
    sender: 'user' | 'bot';
    text: string | null;
    time: string;
    type: MessageType;
    partName?: string;
}

export interface UserProfile {
    name: string;
    role: string;
    initials: string;
}