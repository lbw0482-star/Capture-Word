import dotenv from 'dotenv';
import express from 'express';
import { ChatOpenAI } from '@langchain/openai';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';

dotenv.config({ path: '.env.local' });

const app = express();
const port = Number(process.env.WORD_ASSISTANT_PORT || 8787);
const baseURL = process.env.KIMI_API_ENDPOINT || process.env.VITE_KIMI_API_ENDPOINT || 'https://api.moonshot.cn/v1';
const apiKey = process.env.KIMI_API_KEY || process.env.VITE_KIMI_API_KEY;
const model = process.env.KIMI_CHAT_MODEL || 'moonshot-v1-8k';

app.use(express.json({ limit: '1mb' }));

const toText = (value) => (typeof value === 'string' ? value.trim() : '');

const buildContext = ({ word, sentence, explainations }) => {
  const parts = [];
  const currentWord = toText(word);
  const currentSentence = toText(sentence);
  const lines = Array.isArray(explainations)
    ? explainations.filter((item) => typeof item === 'string' && item.trim().length > 0).slice(0, 10)
    : [];
  if (currentWord) parts.push(`当前单词: ${currentWord}`);
  if (currentSentence) parts.push(`例句: ${currentSentence}`);
  if (lines.length > 0) parts.push(`解释:\n${lines.join('\n')}`);
  return parts.join('\n');
};

const normalizeHistory = (history) => {
  if (!Array.isArray(history)) return [];
  return history
    .filter((item) => item && typeof item.role === 'string' && typeof item.content === 'string')
    .map((item) => ({
      role: item.role === 'assistant' ? 'assistant' : 'user',
      content: item.content.trim()
    }))
    .filter((item) => item.content.length > 0)
    .slice(-10);
};

app.post('/api/word-assistant/chat', async (req, res) => {
  try {
    if (!apiKey) {
      res.status(500).json({ error: 'missing_api_key' });
      return;
    }
    const message = toText(req.body?.message);
    if (!message) {
      res.status(400).json({ error: 'message_required' });
      return;
    }
    const history = normalizeHistory(req.body?.history);
    const context = buildContext(req.body || {});
    const llm = new ChatOpenAI({
      apiKey,
      model,
      temperature: 0.4,
      configuration: { baseURL }
    });
    const messages = [
      new SystemMessage('你是英语单词学习助手。请用中文回答，输出简洁清晰。优先结合上下文中的单词、例句和解释，给出用法、纠错和可直接练习的表达。'),
      ...history.map((item) => item.role === 'assistant' ? new AIMessage(item.content) : new HumanMessage(item.content)),
      new HumanMessage(`${context ? `${context}\n\n` : ''}用户问题: ${message}`)
    ];
    const response = await llm.invoke(messages);
    const answer = toText(response.content);
    if (!answer) {
      res.status(502).json({ error: 'empty_model_response' });
      return;
    }
    res.json({
      answer,
      history: [...history, { role: 'user', content: message }, { role: 'assistant', content: answer }].slice(-12)
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'chat_failed';
    res.status(500).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`[word-assistant] listening on ${port}`);
});
