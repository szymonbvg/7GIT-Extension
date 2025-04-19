import { createContext } from "react";
import { Payload } from "../../../structures/Common";

type AuthContextType = {
  token?: string;
  status: boolean;
  payload?: Payload;
};

const AuthContext = createContext<AuthContextType>({
  status: false,
});
export default AuthContext;
