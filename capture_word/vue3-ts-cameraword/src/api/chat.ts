export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface WordAssistantPayload {
  message: string;
  history: ChatMessage[];
  word: string;
  sentence: string;
  explainations: string[];
}

export interface WordAssistantResponse {
  answer: string;
  history: ChatMessage[];
}

const TIMEOUT_MS = 25000;

const mapError = (code: string) => {
  if (code === 'message_required') return '请输入问题后再发送';
  if (code === 'missing_api_key') return '服务端未配置模型密钥';
  if (code === 'empty_model_response') return '模型未返回有效内容';
  return '单词助手暂时不可用，请稍后重试';
};

export const requestWordAssistant = async (payload: WordAssistantPayload): Promise<WordAssistantResponse> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch('/api/word-assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const data = await response.json();
    if (!response.ok) {
      const code = typeof data?.error === 'string' ? data.error : '';
      throw new Error(mapError(code));
    }
    if (typeof data?.answer !== 'string' || !Array.isArray(data?.history)) {
      throw new Error('单词助手返回格式错误');
    }
    return { answer: data.answer, history: data.history };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('请求超时，请稍后重试');
    }
    throw error instanceof Error ? error : new Error('请求失败');
  } finally {
    clearTimeout(timer);
  }
};
