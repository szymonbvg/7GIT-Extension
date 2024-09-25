import { useEffect, useRef, useState } from "react";
import { ActionData, ActionType } from "../../../types/Action";

type EmoteDialogProps = {
  emoteName?: string;
  msg?: string;
  action: (action: ActionType, data?: ActionData) => void;
  toggle: (value: boolean) => void;
};

export default function EmoteDialog(props: EmoteDialogProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [visibility, setVisibility] = useState(true);

  const handleSubmit = () => {
    if (inputRef.current?.value && inputRef.current.value !== props.emoteName) {
      props.action(props.emoteName ? ActionType.UPDATE : ActionType.ADD, {
        emoteName: inputRef.current.value,
      });
    }
  };

  useEffect(() => {
    if (props.emoteName && inputRef.current) {
      inputRef.current.value = props.emoteName;
    }
  }, [props.emoteName]);

  useEffect(() => {
    props.toggle(visibility);
  }, [visibility]);

  return (
    <>
      <div id="sevengit-dialog">
        <div id="sevengit-dialog-x">
          <span onClick={() => setVisibility(false)}>X</span>
        </div>
        <div id="sevengit-dialog-content">
          <div id="sevengit-dialog-emotename">
            <p>EMOTE NAME</p>
            <input ref={inputRef} />
          </div>
          {props.msg && (
            <div id="sevengit-dialog-msg">
              <p>{props.msg}</p>
            </div>
          )}
          <div id="sevengit-dialog-btns">
            <button onClick={handleSubmit}>SUBMIT</button>
            {props.emoteName && (
              <button id="sevengit-dialog-remove" onClick={() => props.action(ActionType.REMOVE)}>
                REMOVE
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
