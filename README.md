# Capture Word · 拍照记单词

一个面向英语学习场景的多模态小应用：上传或拍摄图片，自动识别图片语义，提炼出最具代表性的英文单词（A1~A2 难度），并生成例句、场景化解释与语音朗读。

## 项目亮点

- 图像理解驱动词汇学习：基于 Kimi Vision 从图片中提取核心词汇与例句。
- 学习内容结构化输出：返回单词、例句、解释段落、追问式练习回复。
- TTS 朗读能力：支持将单词转成语音播放，强化听觉记忆。
- 对话式学习助手：围绕当前单词继续提问，支持“怎么用、怎么记、怎么造句”。
- 前后端一体化本地开发：Vite 前端 + Express API，开箱即跑。

## 适用场景

- 旅行、点餐、看路牌等“看到即学习”场景。
- 少儿/初学者视觉化单词记忆训练。
- AI + 教育方向的产品原型验证与课程项目。

## 技术栈

- 前端：Vue 3、TypeScript、Vite、Three.js
- 服务端：Node.js、Express、LangChain
- 模型能力：
  - 多模态识图：Moonshot/Kimi Vision
  - 对话补充：Moonshot Chat
  - 语音合成：TTS API（通过前端调用）

## 功能流程

1. 上传图片（本地文件预览）。
2. 调用多模态模型识别图像，返回 JSON 学习内容。
3. 展示单词与例句，支持展开查看解释与互动回复。
4. 点击播放按钮生成并播放单词语音。
5. 在 Word Assistant 中继续追问，进行延展练习。

## 快速开始

### 1) 安装依赖

在 `project/capture_word/vue3-ts-cameraword` 目录执行：

```bash
npm install
```

### 2) 配置环境变量

创建并填写 `project/capture_word/vue3-ts-cameraword/.env.local`：

```bash
# Kimi / Moonshot
VITE_KIMI_API_ENDPOINT=https://api.moonshot.cn/v1
VITE_KIMI_API_KEY=your_kimi_api_key
KIMI_CHAT_MODEL=moonshot-v1-8k

# Word Assistant Server
WORD_ASSISTANT_PORT=8787

# TTS
VITE_AUDIO_APP_ID=your_tts_app_id
VITE_AUDIO_ACCESS_TOKEN=your_tts_access_token
VITE_AUDIO_CLUSTER_ID=volcano_tts
VITE_AUDIO_VOICE_NAME=en_female_anna_mars_bigtts
```

### 3) 启动开发环境

```bash
npm run dev
```

默认会同时启动：

- Web：`http://localhost:5173`
- API：`http://localhost:8787`

## 可用脚本

在 `vue3-ts-cameraword` 目录：

- `npm run dev`：同时启动前端与本地 API。
- `npm run dev:web`：仅启动 Vite 前端。
- `npm run dev:server`：仅启动本地 Express 服务。
- `npm run build`：Type Check + 生产构建。
- `npm run preview`：预览生产构建结果。

## 目录结构

```text
project/capture_word/
├─ readme.md
└─ vue3-ts-cameraword/
   ├─ server/
   │  └─ index.mjs                # Word Assistant 后端接口
   ├─ src/
   │  ├─ api/chat.ts              # 聊天助手请求封装
   │  ├─ audio.ts                 # TTS 请求与音频处理
   │  ├─ components/
   │  │  ├─ PictureCard.vue
   │  │  ├─ AnimeScene.vue
   │  │  └─ WordAssistant.vue
   │  └─ App.vue
   └─ package.json
```

## Roadmap

- [ ] 增加单词本与复习计划（SRS）。
- [ ] 增加多语言 UI 与语音角色切换。
- [ ] 增加移动端适配与拍照直传体验。
- [ ] 增加错误边界和接口重试策略。

## 开源说明

- 当前仓库用于学习与原型验证，欢迎 issue / PR。
- 请勿提交真实密钥到仓库，建议通过 `.env.local` 本地管理。