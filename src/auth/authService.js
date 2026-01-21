import { auth } from "./firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

export const sendOTP = async (phone) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha",
      { size: "invisible" },
      auth
    );
  }

  return signInWithPhoneNumber(auth, "+91" + phone, window.recaptchaVerifier);
};

export const googleLogin = async () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const exchangeToken = async (firebaseToken) => {
  const res = await fetch("https://api.timebus.in/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firebaseToken })
  });

  return res.json(); // { accessToken, refreshToken }
};
