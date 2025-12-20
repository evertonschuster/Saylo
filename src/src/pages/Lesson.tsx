import AudioLipSyncPlayer from "../components/Audio/AudioLipSyncPlayer";

export default function Lesson() {
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <p>Olá! Bem-vindo ao Saylo.</p>

      <p>
        Aqui, você aprende a se comunicar praticando de verdade, sem pressão e no seu ritmo.
      </p>

      <p>
        Ao longo das lições, você vai ouvir frases curtas, repetir em voz alta e interagir com personagens que falam com você.
        Cada exercício foi pensado para ajudar você a ganhar confiança, melhorar sua pronúncia e se sentir mais confortável ao se expressar.
      </p>

      <p>
        Não se preocupe em errar. Errar faz parte do aprendizado.
        O importante é continuar praticando um pouco todos os dias.
      </p>

      <p>
        Agora, respire fundo, escute com atenção e tente repetir em voz alta.
        Vamos começar?
      </p>


      {/* https://rive.app/marketplace/5628-11215-wave-hear-and-talk/ */}
      {/* https://rive.app/marketplace/21097-39950-custom-talking-avatar-real-time-lip-sync-for-your-app/ */}
      {/* https://rive.app/marketplace/19795-37212-customizable-avatar/ */}
      <AudioLipSyncPlayer
        audioSrc="/audio/sample.mp3"
        riveSrc="/rive/customizable-avatar.riv"
        stateMachine="State Machine 1"
        mouthInputName="numMouth"
      />
    </div>
  );
}
