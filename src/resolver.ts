import { crypto, extname } from "./deps.ts";

export const jsify = (file: string) => {
  return file.replace(extname(file), ".js");
};

export const tsify = (file: string) => {
  return file.replace(extname(file), ".ts");
};

export const jsxify = (file: string) => {
  return file.replace(extname(file), ".jsx");
};

export const tsxify = (file: string) => {
  return file.replace(extname(file), ".tsx");
};

export const isValidURL = (url: string) => {
  try {
    return new URL(url);
  } catch (_e) {
    return false;
  }
};

export const hashFile = (url: string) => {
  // strip query params from hashing
  url = url.split("?")[0];
  const msgUint8 = new TextEncoder().encode(url);
  const hashBuffer = crypto.subtle.digestSync("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );
  return hashHex;
};

export function stripTrailingSlash(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}
