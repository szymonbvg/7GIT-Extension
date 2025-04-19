import { createContext } from "react";

export type VersionContextType = {
  v2?: boolean;
};

const VersionContext = createContext<VersionContextType>({});
export default VersionContext;
