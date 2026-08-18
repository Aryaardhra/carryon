import { logoutUser } from "../api/logoutApi";
let logoutHandler = null;

export const registerLogoutHandler = (handler) => { 
    logoutHandler = handler;
};

export const triggerLogout = async () => {
  try {
    await logoutUser();
    return true;
  } catch (error) {
    console.error(
      "❌ Logout failed:",
      error
    );

    return false;
  }
};