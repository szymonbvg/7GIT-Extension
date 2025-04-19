import { ReactNode } from "react";
import { useVersion } from "../hooks/useVersion";

export default function HideOnMobile(props: { children?: ReactNode }) {
  const { v2 } = useVersion();

  return (
    <>
      {v2 ? (
        <div style={{ display: "flex" }} className="hide-on-mobile">
          {props.children}
        </div>
      ) : (
        <>{props.children}</>
      )}
    </>
  );
}
