import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import ActionButton from "./components/ActionButton";
import AuthWrapper from "./components/AuthWrapper";
import NavElement from "./components/NavElement";

export default function SevenTVApp() {
  const [params, setParams] = useState<string[]>([]);
  const [actionGroup, setActionGroup] = useState<Element | null>(null);
  const [nav, setNav] = useState<Element | null>(null);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setNav(document.querySelector(".nav-content"));
      setActionGroup(document.querySelector(".action-group"));

      const p = window.location.pathname.split("/").filter((i) => i !== "");
      setParams((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(p)) {
          return prev;
        }
        return p;
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <AuthWrapper>
      {nav && createPortal(<NavElement />, nav)}
      {actionGroup &&
        params.length === 2 &&
        params[0] === "emotes" &&
        createPortal(<ActionButton emoteId={params[1]} />, actionGroup)}
    </AuthWrapper>
  );
}
