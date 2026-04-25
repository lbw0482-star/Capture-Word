/**
 * 将 Base64 编码的音频数据转换为可用于音频播放的 Blob URL
 * @param base64AudioData - 纯 Base64 编码的音频字符串（不含 data:audio/...;base64, 前缀）
 * @param mimeType - MIME 类型，与 TTS encoding 对应：ogg_opus 用 'audio/ogg; codecs=opus'
 */
function createBlobURL(base64AudioData: string, mimeType: string = 'audio/ogg; codecs=opus'): string {
  const byteCharacters = atob(base64AudioData);
  const byteArrays: number[] = [];
  for (let offset = 0; offset < byteCharacters.length; offset++) {
    byteArrays.push(byteCharacters.charCodeAt(offset));
  }
  const audioBlob = new Blob([new Uint8Array(byteArrays)], { type: mimeType });
  const blobURL = URL.createObjectURL(audioBlob);
  return blobURL;
}

/**
 * 调用 TTS 接口，将文本转为语音并返回可播放的 Blob URL
 */
export const generateAudio = async (text: string): Promise<string> => {
  const token = import.meta.env.VITE_AUDIO_ACCESS_TOKEN;
  const appId = import.meta.env.VITE_AUDIO_APP_ID;
  const clusterId = import.meta.env.VITE_AUDIO_CLUSTER_ID;
  const voiceName = import.meta.env.VITE_AUDIO_VOICE_NAME;

  const endpoint = '/tts/api/v1/tts';
  const reqId = Math.random().toString(36).substring(2, 10);
  // #region agent log
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H1', location: 'src/audio.ts:generateAudio:entry', message: 'generateAudio called', data: { reqId, textLength: text?.length, hasToken: !!token, hasAppId: !!appId, hasClusterId: !!clusterId, hasVoiceName: !!voiceName, endpoint }, timestamp: Date.now() }) }).catch(() => {});
  // #endregion

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer; ${token}`,
  };
  // #region agent log
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H6', location: 'src/audio.ts:headers', message: 'audio auth header prepared', data: { authorizationPrefix: String(headers.Authorization).slice(0, 8), tokenLength: token ? String(token).length : 0 }, timestamp: Date.now() }) }).catch(() => {});
  // #endregion
  // #region agent log
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H8', location: 'src/audio.ts:credentialShape', message: 'tts credential shape', data: { appIdLength: appId ? String(appId).length : 0, appIdIsDigits: !!String(appId || '').match(/^\d+$/), tokenTrimChanged: token ? String(token).trim().length !== String(token).length : false, clusterId, voiceName }, timestamp: Date.now() }) }).catch(() => {});
  // #endregion

  const payload = {
    app: {
      appid: appId,
      token,
      cluster: clusterId,
    },
    user: {
      uid: 'bearbobo',
    },
    audio: {
      voice: voiceName,
      voice_type: voiceName,
      encoding: 'ogg_opus',
      compression_rate: 1,
      rate: 24000,
      speed_ratio: 1.0,
      volume_ratio: 1.0,
      pitch_ratio: 1.0,
      emotion: 'happy',
    },
    request: {
      reqid: reqId,
      text,
      text_type: 'plain',
      operation: 'query',
      silence_duration: '125',
      with_frontend: '1',
      frontend_type: 'unitTson',
      pure_english_opt: '1',
    },
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });
  const resText = await res.text();
  // #region agent log
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H5', location: 'src/audio.ts:afterFetch', message: 'TTS response', data: { reqId, ok: res.ok, status: res.status, contentType: res.headers.get('content-type'), bodyPreview: resText.slice(0, 300) }, timestamp: Date.now() }) }).catch(() => {});
  // #endregion

  let data: any = {};
  try {
    data = resText ? JSON.parse(resText) : {};
  } catch (parseErr) {
    // #region agent log
    fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H2', location: 'src/audio.ts:parseError', message: 'TTS body not JSON', data: { preview: resText.slice(0, 200) }, timestamp: Date.now() }) }).catch(() => {});
    // #endregion
    throw parseErr;
  }
  // #region agent log
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H2', location: 'src/audio.ts:dataShape', message: 'TTS data shape', data: { dataKeys: data ? Object.keys(data) : [], dataDataType: typeof data.data, dataDataKeys: data?.data && typeof data.data === 'object' ? Object.keys(data.data) : null }, timestamp: Date.now() }) }).catch(() => {});
  // #endregion

  if (!data.data) {
    const errBody = JSON.stringify({ status: res.status, bodyPreview: resText.slice(0, 200), responseKeys: data ? Object.keys(data) : [] });
    throw new Error(errBody);
  }

  // 接口可能返回 data.audio 或 data 为 base64 字符串
  const base64 = typeof data.data === 'string' ? data.data : (data.data.audio || data.data);
  if (!base64) {
    throw new Error('TTS 返回数据中无音频内容');
  }

  // #region agent log
  const base64Str = typeof base64 === 'string' ? base64 : '';
  fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H3', location: 'src/audio.ts:base64BeforeBlob', message: 'base64 for Blob', data: { base64Length: base64Str.length, base64Prefix: base64Str.slice(0, 50) }, timestamp: Date.now() }) }).catch(() => {});
  // #endregion

  try {
    return createBlobURL(base64);
  } catch (blobErr) {
    const errMsg = blobErr instanceof Error ? blobErr.message : String(blobErr);
    // #region agent log
    fetch('http://127.0.0.1:7579/ingest/b3e98ab6-cafb-4883-b2a9-691d7187531e', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '5d5d5c' }, body: JSON.stringify({ sessionId: '5d5d5c', runId: 'audio-flow', hypothesisId: 'H3', location: 'src/audio.ts:createBlobURLError', message: 'createBlobURL failed', data: { errMsg }, timestamp: Date.now() }) }).catch(() => {});
    // #endregion
    throw blobErr;
  }
};
