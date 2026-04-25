<script setup lang="ts">
import PictureCard from './components/PictureCard.vue';
import AnimeScene from './components/AnimeScene.vue';
import WordAssistant from './components/WordAssistant.vue';
// composition api 组合式API
import { ref } from 'vue';
import { generateAudio } from './audio';
const imagePreview = ref('');
const userPrompt = `
  分析图片内容，找出最能描述图片的一个英文单词，尽量选择更简单的A1~A2的词汇。

  返回JSON 数据：
  {
    "image_discription": "图片描述",
    "representative_word": "图片代表的英文单词",
    "example_sentence": "结合英文单词和图片描述，给出一个简单的例句",
    "explaination": "结合图片解释英文单词，段落以Look at ...开头，将段落分句，每一句单独一行，解释的最后给一个日常生活有关的问句",
    "explanation_replys": ["根据explaination给出的回复1", "根据explaination给出的回复2"],
  }
`
const word = ref('请上传图片');
const sentence = ref('');
const detailExpand = ref(false);
const explainations = ref<string[]>([]);
const expReply = ref<string[]>([]);
let playSeq = 0;
let playingCount = 0;



const update = async (imageDate: string) => {
  // #region agent log
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '5d5d5c'
    },
    body: JSON.stringify({
      sessionId: '5d5d5c',
      runId: 'pre-fix',
      hypothesisId: 'H1',
      location: 'src/App.vue:update',
      message: 'update called',
      data: { hasImage: !!imageDate },
      timestamp: Date.now()
    })
  }).catch(() => { });
  // #endregion

  // console.log(imageDate);
  imagePreview.value = imageDate;
  const baseEndpoint = import.meta.env.VITE_KIMI_API_ENDPOINT;
  const endpoint = `${baseEndpoint || ''}/chat/completions`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_KIMI_API_KEY}`
  }
  // #region agent log
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '5d5d5c'
    },
    body: JSON.stringify({
      sessionId: '5d5d5c',
      runId: 'pre-fix',
      hypothesisId: 'H2',
      location: 'src/App.vue:update',
      message: 'endpoint prepared',
      data: { baseEndpoint, endpoint, hasEndpoint: !!endpoint, endpointStartsWithHttp: /^https?:\/\//.test(endpoint) },
      timestamp: Date.now()
    })
  }).catch(() => { });
  // #endregion

  word.value = '分析中...';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: 'moonshot-v1-8k-vision-preview',
      messages: [
        {
          role: 'user',
          content: [{
            type: 'image_url',
            image_url: {
              url: imageDate
            }
          }, {
            type: 'text',
            text: userPrompt
          }]
        }
      ],
      stream: false
    })
  });

  // #region agent log
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '5d5d5c'
    },
    body: JSON.stringify({
      sessionId: '5d5d5c',
      runId: 'pre-fix',
      hypothesisId: 'H3',
      location: 'src/App.vue:update',
      message: 'response received',
      data: { ok: response.ok, status: response.status },
      timestamp: Date.now()
    })
  }).catch(() => { });
  // #endregion

  const responseText = await response.text();
  // #region agent log
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '5d5d5c'
    },
    body: JSON.stringify({
      sessionId: '5d5d5c',
      runId: 'pre-fix',
      hypothesisId: 'H4',
      location: 'src/App.vue:update',
      message: 'response text received',
      data: {
        contentType: response.headers.get('content-type'),
        bodyPreview: responseText.slice(0, 200),
        bodyLength: responseText.length
      },
      timestamp: Date.now()
    })
  }).catch(() => { });
  // #endregion
  const data = JSON.parse(responseText);

  // #region agent log
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '5d5d5c'
    },
    body: JSON.stringify({
      sessionId: '5d5d5c',
      runId: 'pre-fix',
      hypothesisId: 'H5',
      location: 'src/App.vue:update',
      message: 'response json parsed for choices',
      data: {
        hasChoices: Array.isArray((data as any).choices),
        firstChoiceType: (data as any).choices && (data as any).choices[0] ? typeof (data as any).choices[0].message?.content : null
      },
      timestamp: Date.now()
    })
  }).catch(() => { });
  // #endregion

  // console.log(data);
  const choiceContent = (data as any).choices?.[0]?.message?.content;
  // #region agent log
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '5d5d5c'
    },
    body: JSON.stringify({
      sessionId: '5d5d5c',
      runId: 'pre-fix',
      hypothesisId: 'H5',
      location: 'src/App.vue:update',
      message: 'choice content before parse',
      data: {
        contentType: typeof choiceContent,
        contentPreview: typeof choiceContent === 'string' ? choiceContent.slice(0, 200) : null
      },
      timestamp: Date.now()
    })
  }).catch(() => { });
  // #endregion
  const replyData = JSON.parse(choiceContent);
  // console.log(replyData, '/////');
  word.value = replyData.representative_word;
  sentence.value = replyData.example_sentence;
  explainations.value = replyData.explaination.split('\n').filter((item:string) => item !== "");
  expReply.value = replyData.explanation_replys;

}
const submit = (imageData: string) => {
  update(imageData);
}
const playAudio = async (text: string) => {
  const playId = ++playSeq;
  playingCount += 1;
  // #region agent log
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H10', location: 'src/App.vue:playAudio:entry', message: 'playAudio called', data: { playId, playingCount, text, textLength: text?.length }, timestamp: Date.now() }) }).catch(() => {});
  // #endregion
  try {
    const url = await generateAudio(text);
    const audioEl = new Audio(url);
    // #region agent log
    fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H11', location: 'src/App.vue:playAudio:beforePlay', message: 'audio element created', data: { playId, urlPrefix: url.slice(0, 20) }, timestamp: Date.now() }) }).catch(() => {});
    // #endregion
    await audioEl.play();
    // #region agent log
    fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H11', location: 'src/App.vue:playAudio:afterPlay', message: 'audio play resolved', data: { playId }, timestamp: Date.now() }) }).catch(() => {});
    // #endregion
    audioEl.onended = () => {
      URL.revokeObjectURL(url);
      audioEl.currentTime = 0;
      // #region agent log
      fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H11', location: 'src/App.vue:playAudio:onended', message: 'audio ended', data: { playId }, timestamp: Date.now() }) }).catch(() => {});
      // #endregion
    };
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e);
    // #region agent log
    fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H10', location: 'src/App.vue:playAudio:catch', message: 'playAudio error', data: { playId, errMsg }, timestamp: Date.now() }) }).catch(() => {});
    // #endregion
    console.error('播放失败', e);
  } finally {
    playingCount = Math.max(playingCount - 1, 0);
    // #region agent log
    fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H10', location: 'src/App.vue:playAudio:finally', message: 'playAudio finished', data: { playId, playingCount }, timestamp: Date.now() }) }).catch(() => {});
    // #endregion
  }
};
</script>

<template>
  <div class="container">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <main class="shell">
      <section class="hero">
        <div class="hero-content">
          <p class="tag">Anime Vibes Vocabulary</p>
          <h1>Upload a photo, unlock a lively English word.</h1>
          <p class="sub">让学习像动漫场景一样鲜活：看图、识词、跟读、对话一条龙。</p>
          <div class="hero-card">
            <PictureCard
              :word="word"
              :can-play="!!(word && word !== '分析中...' && word !== '请上传图片')"
              @update-image="submit"
              @play-audio="() => playAudio(word)"
            />
          </div>
        </div>
        <div class="hero-model">
          <AnimeScene />
        </div>
      </section>
      <section class="output">
        <div class="sentence">{{ sentence || '结果会显示在这里，准备开始吧。' }}</div>
        <div class="details">
          <button @click="detailExpand = !detailExpand">
            {{ detailExpand ? 'Hide Talk Bout It' : 'Talk Bout It' }}
          </button>
          <div class="panel" v-if="detailExpand">
            <img v-if="imagePreview" :src="imagePreview" alt="preview" />
            <div class="explaination" v-for="item in explainations" :key="item">
              <p>{{ item }}</p>
            </div>
            <div class="reply" v-for="item in expReply" :key="item">
              <p>{{ item }}</p>
            </div>
          </div>
        </div>
        <WordAssistant :word="word" :sentence="sentence" :explainations="explainations" />
      </section>
    </main>
  </div>
</template>

<style scoped>
.container {
  position: relative;
  min-height: 100vh;
  padding: 28px 18px;
  overflow: hidden;
  background: radial-gradient(circle at 16% 12%, #ffd3f2 0%, #ffc4a8 22%, #7b5bff 58%, #191a45 100%);
  color: #fff;
}
.orb {
  position: absolute;
  filter: blur(2px);
  border-radius: 9999px;
  pointer-events: none;
}
.orb-1 {
  width: 220px;
  height: 220px;
  left: -60px;
  top: -50px;
  background: radial-gradient(circle at 30% 30%, #ffe2fb 0%, #ff83cf 70%, transparent 100%);
}
.orb-2 {
  width: 280px;
  height: 280px;
  right: -70px;
  bottom: -90px;
  background: radial-gradient(circle at 30% 30%, #a8ffff 0%, #70a1ff 68%, transparent 100%);
}
.shell {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  gap: 18px;
}
.hero {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 18px;
}
.hero-content,
.hero-model,
.output {
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: linear-gradient(140deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 100%);
  backdrop-filter: blur(12px);
  border-radius: 24px;
}
.hero-content {
  padding: 26px;
  display: flex;
  flex-direction: column;
}
.hero-content h1 {
  margin-top: 10px;
  font-size: clamp(26px, 4vw, 42px);
  line-height: 1.05;
}
.tag {
  width: fit-content;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: linear-gradient(90deg, #f857a6 0%, #ff5858 100%);
}
.sub {
  margin-top: 12px;
  color: #f8ecff;
  opacity: 0.9;
}
.hero-card {
  margin-top: 14px;
  width: fit-content;
}
.hero-model {
  min-height: 420px;
  padding: 12px;
}
.output {
  padding: 18px;
}
.sentence {
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);
}
.details {
  margin-top: 14px;
}
.details button {
  background: linear-gradient(90deg, #f857a6 0%, #ff5858 100%);
  color: white;
  border-radius: 9999px;
  border: none;
  height: 38px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.panel {
  margin-top: 14px;
  border-radius: 16px;
  padding: 14px;
  max-height: 50vh;
  overflow: auto;
  background: rgba(255, 255, 255, 0.9);
  color: #2b1c52;
}
.panel img {
  width: min(280px, 100%);
  margin: 0 auto 12px;
  border-radius: 12px;
  border: 2px solid rgba(123, 91, 255, 0.35);
}
.explaination p {
  font-weight: 500;
  margin: 0 0 10px;
}
.reply p {
  margin: 0 0 10px;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid rgba(123, 91, 255, 0.35);
  background: rgba(255, 255, 255, 0.7);
}
@media (max-width: 960px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .hero-model {
    min-height: 320px;
  }
}
</style>