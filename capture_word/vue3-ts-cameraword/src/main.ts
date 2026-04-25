import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

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
    hypothesisId: 'H0',
    location: 'src/main.ts:after-mount',
    message: 'Vue app mounted',
    data: {},
    timestamp: Date.now()
  })
}).catch(() => { });
// #endregion
