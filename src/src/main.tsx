import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'

import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("Nova versão disponível");
  },
  onOfflineReady() {
    console.log("App pronto para uso offline");
  },
});


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
