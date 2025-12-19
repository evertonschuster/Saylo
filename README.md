# Saylo 🗣️✨

**Saylo** é um aplicativo educacional focado no desenvolvimento de **habilidades de comunicação**, com uma experiência gamificada inspirada em apps como Duolingo.  
O diferencial do Saylo é o uso de **personagens animados que falam**, interagem e ajudam o usuário a aprender praticando a fala de forma natural.

O projeto é construído como um **PWA (Progressive Web App)**, permitindo que o app seja instalado tanto em **smartphones** quanto utilizado diretamente em **computadores** via navegador.

---

## 🚀 Objetivo do MVP

- Desenvolver habilidades de **speaking e listening**
- Criar uma experiência leve, divertida e motivadora
- Utilizar **personagens animados sincronizados com áudio**
- Funcionar **offline** sempre que possível
- Ser multiplataforma (mobile + desktop)

---

## 🧠 Funcionalidades Principais

- 📚 Lições curtas e interativas
- 🎭 Personagens animados que falam
- 🔊 Áudio sincronizado com animações (lip-sync simples ou por visemas)
- 🎮 Gamificação (XP, níveis, streaks)
- 📱 Instalação como app (PWA)
- 🌐 Uso direto no navegador
- ⏱️ Feedback imediato ao usuário

---

## 🛠️ Stack Tecnológica

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **PWA (Service Workers + Cache)**
- **Framer Motion** (animações de UI)
- **Web Audio API** (controle e análise de áudio)

### Animações de Personagem
- **Rive** ou **Spine** (animações 2D)
- Animação de boca baseada em:
  - Amplitude do áudio (MVP)
  - Visemas com timestamps (versão avançada)

### Backend (MVP-friendly)
- **Firebase** ou **Supabase**
  - Autenticação
  - Banco de dados
  - Storage de áudio
  - Analytics

---

## 🎤 Áudio e Sincronização

O Saylo utiliza áudio pré-gravado ou gerado via TTS.  
A sincronização entre áudio e personagem pode ser feita de duas formas:

### MVP
- Análise de volume via **Web Audio API**
- Abertura/fechamento da boca baseado na amplitude do som

### Evolução
- Uso de **visemas com timestamps**
- Controle preciso das formas da boca durante a fala

---

## 📁 Estrutura do Projeto (sugestão)

```txt
src/
 ├─ components/
 │   ├─ Character/
 │   ├─ AudioPlayer/
 │   ├─ Lesson/
 │   └─ UI/
 ├─ animations/
 │   └─ characters/
 ├─ pages/
 │   ├─ Home.tsx
 │   ├─ Lesson.tsx
 │   └─ Profile.tsx
 ├─ services/
 │   ├─ audio.ts
 │   ├─ speech.ts
 │   └─ analytics.ts
 ├─ hooks/
 ├─ assets/
 ├─ styles/
 └─ main.tsx
