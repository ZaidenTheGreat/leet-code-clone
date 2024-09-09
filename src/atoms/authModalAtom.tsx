import { atom } from "recoil";

type AuthModalState = {
  isOpen: boolean;
  type: "login" | "register" | "forgotPassword";
};

const initialAuthModalState: AuthModalState = {
  isOpen: false,
  type: "login",
};

const authModalState = atom<AuthModalState>({
  key: "authModalState", //unique ID (with respect to other atoms/selectors)
  default: initialAuthModalState, //default value
});

export default authModalState;
