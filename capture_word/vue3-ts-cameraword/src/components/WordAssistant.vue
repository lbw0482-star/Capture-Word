<script setup lang="ts">
import { ref } from 'vue';
import { requestWordAssistant, type ChatMessage } from '../api/chat';

const props = defineProps<{
  word: string;
  sentence: string;
  explainations: string[];
}>();

const input = ref('');
const loading = ref(false);
const errorText = ref('');
const messages = ref<ChatMessage[]>([
  { role: 'assistant', content: '我是单词助手，问我这个单词怎么用、怎么记、怎么造句。' }
]);

const send = async () => {
  const text = input.value.trim();
  if (!text || loading.value) return;
  errorText.value = '';
  loading.value = true;
  messages.value.push({ role: 'user', content: text });
  input.value = '';
  try {
    const response = await requestWordAssistant({
      message: text,
      history: messages.value,
      word: props.word,
      sentence: props.sentence,
      explainations: props.explainations
    });
    messages.value = response.history;
  } catch (error) {
    errorText.value = error instanceof Error ? error.message : '发送失败';
  } finally {
    loading.value = false;
  }
};

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    send();
  }
};
</script>

<template>
  <div class="assistant">
    <h3>Word Assistant</h3>
    <div class="chat-list">
      <div class="msg" :class="item.role" v-for="(item, idx) in messages" :key="`${item.role}-${idx}`">
        <p>{{ item.content }}</p>
      </div>
    </div>
    <p v-if="errorText" class="error">{{ errorText }}</p>
    <div class="input-row">
      <textarea
        v-model="input"
        rows="2"
        placeholder="问：这个单词还有哪些常见搭配？"
        @keydown="onKeydown"
      />
      <button :disabled="loading || !input.trim()" @click="send">
        {{ loading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.assistant {
  margin-top: 14px;
  border-radius: 16px;
  padding: 14px;
  background: rgba(15, 8, 46, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.35);
}
.assistant h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}
.chat-list {
  margin-top: 12px;
  max-height: 280px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.msg {
  max-width: 86%;
  border-radius: 12px;
  padding: 10px;
  line-height: 1.45;
}
.msg p {
  margin: 0;
}
.msg.user {
  margin-left: auto;
  background: rgba(248, 87, 166, 0.9);
}
.msg.assistant {
  background: rgba(255, 255, 255, 0.94);
  color: #2b1c52;
}
.input-row {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}
.input-row textarea {
  resize: vertical;
  width: 100%;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  padding: 8px 10px;
  outline: none;
}
.input-row textarea::placeholder {
  color: rgba(255, 255, 255, 0.65);
}
.input-row button {
  width: fit-content;
  height: 34px;
  padding: 0 16px;
  border-radius: 9999px;
  border: none;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(90deg, #7b5bff 0%, #00c6ff 100%);
}
.input-row button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.error {
  margin-top: 10px;
  color: #ffd6e5;
  font-size: 12px;
}
</style>
