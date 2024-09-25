import { useFloating } from "@floating-ui/react-dom";
import { useState } from "react";

type EmoteProps = {
  blob: string;
  name: string;
};

export default function Emote(props: EmoteProps) {
  const { refs, floatingStyles } = useFloating();
  const [showFloating, setShowFloating] = useState(false);

  return (
    <>
      <img
        loading="lazy"
        onMouseEnter={() => setShowFloating(true)}
        onMouseLeave={() => setShowFloating(false)}
        ref={refs.setReference}
        src={props.blob}
      />
      {showFloating && (
        <div id="sevengit-floating" ref={refs.setFloating} style={floatingStyles}>
          <p>{props.name}</p>
        </div>
      )}
    </>
  );
}
