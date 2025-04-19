import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import EmoteDialog from "./EmoteDialog";
import { ActionData, ActionType } from "../../../types/Action";
import { MessageResponse, MessageType, sendChromeMsg } from "../../../structures/Messaging";
import { EmoteType } from "../../../types/Emotes";
import { useVersion } from "../hooks/useVersion";
import { useAuth } from "../hooks/useAuth";

type ActionButtonState = {
  exists: boolean;
  loading: boolean;
  name?: string;
  msg?: string;
};

export default function ActionButton(props: {emoteId: string}) {
  const { v2 } = useVersion();

  const { token, payload } = useAuth();
  const [state, setState] = useState<ActionButtonState>({
    exists: false,
    loading: true,
  });
  const [showDialog, setShowDialog] = useState(false);

  const handleAction = (action: ActionType, data?: ActionData) => {
    if (!state.loading && token && payload) {
      setState((prev) => {
        return {
          ...prev,
          loading: true,
        };
      });

      let body = "";
      const path = action === ActionType.UPDATE ? "/v1/update/emote" : `/v1/emotes/${action}`;
      switch (action) {
        case ActionType.UPDATE:
        case ActionType.ADD: {
          if (data?.emoteName) {
            body = JSON.stringify({ name: data.emoteName, emoteId: props.emoteId });
          }
          break;
        }
        case ActionType.REMOVE: {
          body = JSON.stringify({ emoteId: props.emoteId });
          break;
        }
      }

      sendChromeMsg(
        {
          type: MessageType.REQUEST,
          data: { path, method: "POST", body, token },
        },
        (res) => {
          const parsed = res as MessageResponse;
          let resData = parsed.data as { msg?: string };
          if (parsed.data === null) {
            resData = { msg: "something went wrong" };
          }
          setState((prev) => {
            return {
              ...prev,
              loading: false,
              exists:
                action === ActionType.UPDATE
                  ? true
                  : action === ActionType.REMOVE
                  ? !parsed.status
                  : parsed.status,
              name: parsed.status ? data?.emoteName : prev.name,
              msg: resData?.msg,
            };
          });
          if (!resData?.msg) {
            setShowDialog(false);
          }
        }
      );
    }
  };

  const handleDialog = (visiblity: boolean) => {
    if (!state.loading && payload) {
      if (!visiblity) {
        setState((prev) => {
          return {
            ...prev,
            msg: undefined,
          };
        });
      }
      setShowDialog(visiblity);
    }
  };

  useEffect(() => {
    if (payload && token) {
      sendChromeMsg(
        {
          type: MessageType.REQUEST,
          data: { path: `/v1/emotes/${props.emoteId}`, method: "GET", token },
        },
        (res) => {
          const parsed = res as MessageResponse;
          const data = parsed.data as { emoteData: EmoteType | null } | null;
          setState((prev) => {
            return {
              ...prev,
              loading: !parsed.status,
              exists: data?.emoteData !== null,
              name: data?.emoteData?.name,
            };
          });
        }
      );
    }
  }, [payload]);

  return (
    <>
      <div id={v2 ? "new-sevengit-action-btn" : "sevengit-action-btn"} onClick={() => handleDialog(true)}>
        {payload ? (
          !state.loading ? (
            <>
              <p>{!state.exists ? <>ADD TO</> : <>EDIT EMOTE IN</>} 7GIT EMOTE-SET</p>
              {showDialog &&
                createPortal(
                  <EmoteDialog
                    toggle={handleDialog}
                    emoteName={state.name}
                    msg={state.msg}
                    action={handleAction}
                  />,
                  document.body
                )}
            </>
          ) : (
            <p>LOADING...</p>
          )
        ) : (
          <p>YOU ARE NOT LOGGED IN TO 7GIT</p>
        )}
      </div>
    </>
  );
}
