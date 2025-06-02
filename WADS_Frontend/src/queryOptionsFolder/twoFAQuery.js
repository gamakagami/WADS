import { useMutation } from "@tanstack/react-query";
import { enable2fa, verify2fa, disable2fa } from "../api/twoFactor";

export function useEnable2FA(token) {
  return useMutation({
    mutationFn: () => enable2fa(token),
  });
}

export function useVerify2FA(token) {
  return useMutation({
    mutationFn: (userData) => verify2fa(token, userData) ,
  });
}

export function useDisable2FA(token) {
  return useMutation({
    mutationFn: () => disable2fa(token),
  });
}