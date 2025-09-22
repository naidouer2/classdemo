import { AIResponse } from '@/types/note'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'

interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface OpenRouterRequest {
  model: string
  messages: OpenRouterMessage[]
  max_tokens?: number
  temperature?: number
  stream?: boolean
}

interface OpenRouterResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class AIAPI {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async sendRequest(messages: OpenRouterMessage[], maxTokens: number = 1000): Promise<string> {
    const request: OpenRouterRequest = {
      model: 'deepseek/deepseek-chat-v3.1',
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
      stream: false
    }

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
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `API 调用失败: ${response.status} ${response.statusText}\n` +
          `错误详情: ${errorData.error?.message || '未知错误'}`
        )
      }

      const data: OpenRouterResponse = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      throw new Error(`API 请求失败: ${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  async generateTitle(content: string): Promise<string> {
    const prompt = `根据以下内容生成一个简洁、准确的标题（不超过20个字）：

${content}

请只返回标题，不要添加任何解释或标点符号。`

    const messages: OpenRouterMessage[] = [
      {
        role: 'user',
        content: prompt
      }
    ]

    return await this.sendRequest(messages, 50)
  }

  async generateTags(content: string): Promise<string[]> {
    const prompt = `根据以下内容生成3-5个相关标签，用逗号分隔：

${content}

要求：
1. 标签应该准确反映内容主题
2. 使用中文标签
3. 每个标签2-4个字
4. 只返回标签，不要其他内容`

    const messages: OpenRouterMessage[] = [
      {
        role: 'user',
        content: prompt
      }
    ]

    const response = await this.sendRequest(messages, 100)
    return response.split(',').map(tag => tag.trim()).filter(tag => tag)
  }

  async polishContent(content: string): Promise<string> {
    const prompt = `请对以下内容进行专业润色，保持原意但提升表达质量：

${content}

要求：
1. 保持原有的核心思想和信息
2. 改善语言表达，使之更专业、流畅
3. 修正语法和用词错误
4. 保持原有格式和结构
5. 使用中文润色

请直接返回润色后的内容，不要添加任何解释。`

    const messages: OpenRouterMessage[] = [
      {
        role: 'user',
        content: prompt
      }
    ]

    return await this.sendRequest(messages, 2000)
  }
}

// 本地存储API密钥的工具
export const APIKeyManager = {
  getKey(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('openrouter_api_key')
    }
    return null
  },

  setKey(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('openrouter_api_key', key)
    }
  },

  removeKey(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('openrouter_api_key')
    }
  },

  hasKey(): boolean {
    return this.getKey() !== null
  }
}