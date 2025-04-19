import { ReactNode } from "react";
import VersionContext, { VersionContextType } from "../contexts/VersionContext";

type VersionProviderProps = {
  children?: ReactNode;
} & VersionContextType;

export default function VersionProvider(props: VersionProviderProps) {
  return <VersionContext.Provider value={{ v2: props.v2 }}>{props.children}</VersionContext.Provider>;
}
