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
  isTalking: boolean;     // true quando áudio tocando
  talkInputName?: string;
};

export default function CharacterRive({
  src,
  stateMachine,
  isTalking,
  talkInputName = "Talk",
}: Props) {
  const { rive, RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  const talk = useStateMachineInput(rive, stateMachine, talkInputName);


  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    if (talk) talk.value = isTalking; // boolean input
  }, [isTalking, talk]);

  return <RiveComponent style={{ width: "100%", height: 320 }} />;
}
