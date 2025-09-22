export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
  tokens?: number;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  model: string;
  createdAt: string;
  updatedAt: string;
  systemPrompt?: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  variables?: string[];
  isFavorite?: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  maxTokens: number;
  pricing?: {
    input: number;
    output: number;
  };
  contextWindow: number;
}

export interface ChatSettings {
  defaultModel: string;
  systemPrompt: string;
  maxTokens: number;
  temperature: number;
  enableStream: boolean;
}

export interface StreamResponse {
  content: string;
  isComplete: boolean;
  error?: string;
}