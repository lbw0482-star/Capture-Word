<script setup lang="ts">
import { ref } from 'vue';
import defaultCaeraImg from '../assets/camera.png';
import voiceIcon from '../assets/voice.png';

const imgPreview = ref(defaultCaeraImg);

const props = defineProps({
    word: {
        type: String,
        default: ''
    },
    canPlay: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['updateImage', 'play-audio']);
const onPlayClick = () => {
    // #region agent log
    fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H9', location: 'src/components/PictureCard.vue:onPlayClick', message: 'play button clicked', data: { ts: Date.now() }, timestamp: Date.now() }) }).catch(() => {});
    // #endregion
    emit('play-audio');
};

const updateImageData = async (e: Event): Promise<any> => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return 

    return new Promise((resolve, reject) => {
        // 多模态需要的base64
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const data = reader.result as string;
            imgPreview.value = data;
            emit('updateImage', data);
            resolve(data);
        }
        reader.onerror = (error) => {
            reject(error);
        }
    })
}
</script>

<template>
    <div class="card">
        <input type="file" id="selecteImage" class="input"
        accept="image/*" @change="updateImageData"
        >
        <label for="selecteImage" class="upload">
            <img :src="imgPreview" alt="camera" class="img"/>
        </label>
        <div class="word">
        {{props.word}}
        </div>
        <div class="playAudio" v-if="canPlay" @click="onPlayClick">
            <img :src="voiceIcon" alt="play" width="20px"/>
        </div>
    </div>
</template>

<style scoped>
#selecteImage {
    display: none;
}
.card {
  border-radius: 18px;
  padding: 18px;
  margin-top: 8px;
  height: 278px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: linear-gradient(140deg, rgba(12, 24, 66, 0.72) 0%, rgba(120, 52, 154, 0.68) 100%);
  box-shadow: 0 14px 34px rgba(45, 18, 76, 0.35);
  box-sizing: border-box;
}
.upload {
  width: 168px;
  height: 168px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px dashed rgba(255, 255, 255, 0.5);
  overflow: hidden;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease;
}
.upload:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 18px rgba(255, 125, 210, 0.35);
}
.upload img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.word {
  margin-top: 14px;
  font-size: 18px;
  color: rgb(255,255,255);
  font-weight: 700;
  letter-spacing: 0.02em;
}
.playAudio {
  margin-top: 10px;
  width: fit-content;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 6px 12px;
  transition: transform .15s ease;
}
.playAudio:hover {
  transform: scale(1.05);
}
.playAudio img {
  cursor: pointer;
}
</style>
