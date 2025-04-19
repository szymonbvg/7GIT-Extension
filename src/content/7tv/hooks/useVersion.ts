import { useContext } from "react";
import VersionContext from "../contexts/VersionContext";

export function useVersion() {
  const version = useContext(VersionContext);
  return version;
}
