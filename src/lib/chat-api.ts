import { ChatMessage, AIModel, StreamResponse } from '@/types/chat';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string;
    }
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class ChatAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(
    messages: ChatMessage[],
    model: string,
    systemPrompt?: string,
    maxTokens: number = 2000,
    temperature: number = 0.7,
    stream: boolean = false
  ): Promise<string> {
    const openRouterMessages: OpenRouterMessage[] = [];
    
    if (systemPrompt) {
      openRouterMessages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.forEach(msg => {
      openRouterMessages.push({
        role: msg.role,
        content: msg.content
      });
    });

    const request: OpenRouterRequest = {
      model,
      messages: openRouterMessages,
      max_tokens: maxTokens,
      temperature,
      stream
    };

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
          'X-Title': 'U2记事本'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API调用失败: ${response.status} ${response.statusText}\n` +
          `错误详情: ${errorData.error?.message || '未知错误'}`
        );
      }

      const data: OpenRouterResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      throw new Error(`API请求失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  async *streamMessage(
    messages: ChatMessage[],
    model: string,
    systemPrompt?: string,
    maxTokens: number = 2000,
    temperature: number = 0.7
  ): AsyncGenerator<StreamResponse, void, unknown> {
    const openRouterMessages: OpenRouterMessage[] = [];
    
    if (systemPrompt) {
      openRouterMessages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.forEach(msg => {
      openRouterMessages.push({
        role: msg.role,
        content: msg.content
      });
    });

    const request: OpenRouterRequest = {
      model,
      messages: openRouterMessages,
      max_tokens: maxTokens,
      temperature,
      stream: true
    };

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
          'X-Title': 'U2记事本'
        },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `API调用失败: ${response.status} ${response.statusText}\n` +
          `错误详情: ${errorData.error?.message || '未知错误'}`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应流');
      }

      let accumulatedContent = '';
      
      try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              yield { content: accumulatedContent, isComplete: true };
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                accumulatedContent += content;
                yield { content: accumulatedContent, isComplete: false };
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

      yield { content: accumulatedContent, isComplete: true };
    } catch (error) {
      throw new Error(`流式请求失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  async generateTitle(messages: ChatMessage[]): Promise<string> {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return '新对话';

    const prompt = `根据以下对话内容生成一个简洁的标题（不超过20个字）：
${lastMessage.content}

请只返回标题，不要添加任何解释。`;

    try {
      const title = await this.sendMessage(
        [{ role: 'user', content: prompt, id: Date.now().toString(), timestamp: new Date().toISOString() }],
        'deepseek/deepseek-chat-v3.1',
        undefined,
        50,
        0.3
      );
      return title.trim() || '新对话';
    } catch (error) {
      console.error('生成标题失败:', error);
      return '新对话';
    }
  }
}

// AI模型配置
export const AI_MODELS: AIModel[] = [
  {
    id: 'deepseek/deepseek-chat-v3.1',
    name: 'DeepSeek Chat v3.1',
    provider: 'DeepSeek',
    description: '强大的中文对话模型',
    maxTokens: 4000,
    contextWindow: 128000,
    pricing: { input: 0.0000014, output: 0.0000028 }
  },
  {
    id: 'anthropic/claude-3-sonnet-20240229',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: '平衡性能和成本的选择',
    maxTokens: 4000,
    contextWindow: 200000,
    pricing: { input: 0.000003, output: 0.000015 }
  },
  {
    id: 'anthropic/claude-3.5-sonnet-20241022',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: '最新最强的Claude模型',
    maxTokens: 4000,
    contextWindow: 200000,
    pricing: { input: 0.000003, output: 0.000015 }
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    description: '轻量级GPT-4模型',
    maxTokens: 4000,
    contextWindow: 128000,
    pricing: { input: 0.00000015, output: 0.0000006 }
  },
  {
    id: 'openai/gpt-4o-2024-08-06',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'OpenAI最新旗舰模型',
    maxTokens: 4000,
    contextWindow: 128000,
    pricing: { input: 0.0000025, output: 0.00001 }
  }
];

// 默认提示词模板
export const DEFAULT_PROMPT_TEMPLATES = [
  {
    id: 'code-helper',
    name: '代码助手',
    content: '你是一个专业的编程助手。请帮助解决以下编程问题：{question}',
    category: '编程'
  },
  {
    id: 'writing-assistant',
    name: '写作助手',
    content: '你是一个专业的写作助手。请帮助改进以下文本：{text}',
    category: '写作'
  },
  {
    id: 'translator',
    name: '翻译专家',
    content: '你是一个专业的翻译专家。请将以下文本翻译成{target_language}：{text}',
    category: '翻译'
  },
  {
    id: 'analyst',
    name: '数据分析师',
    content: '你是一个专业的数据分析师。请分析以下数据并提供见解：{data}',
    category: '分析'
  }
];