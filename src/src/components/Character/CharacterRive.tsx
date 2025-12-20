import { useEffect } from "react";
import {
  useRive,
  useStateMachineInput,
  Layout,
  Fit,
  Alignment,
} from "@rive-app/react-canvas";

type Props = {
  src: string;
  stateMachine: string;
  amplitude: number;      // 0..1
  isTalking: boolean;     // true quando áudio tocando
  mouthInputName?: string;
  talkInputName?: string;
};

export default function CharacterRive({
  src,
  stateMachine,
  amplitude,
  isTalking,
  mouthInputName = "mouthOpen",
  talkInputName = "Talk",
}: Props) {
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  const mouthOpen = useStateMachineInput(rive, stateMachine, mouthInputName);
  const talk = useStateMachineInput(rive, stateMachine, talkInputName);

  useEffect(() => {
    if (!mouthOpen) {
      return;
    }
    
    if(amplitude > 0.028){
      // eslint-disable-next-line react-hooks/immutability
      mouthOpen.value = 1;
    }
    else{
      mouthOpen.value = 0;
    }
  }, [amplitude, mouthOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    if (talk) talk.value = isTalking; // boolean input
  }, [isTalking, talk]);

  return <RiveComponent style={{ width: "100%", height: 320 }} />;
}
