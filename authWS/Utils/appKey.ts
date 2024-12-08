const sKey = Deno.env.get("APP_KEY") ?? "";

const encoder = new TextEncoder();
const keyData = encoder.encode(sKey);

const appKey = await crypto.subtle.importKey(
  "raw",
  keyData,
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"]
);

export default appKey;

// https://docs.deno.com/examples/hmac-generate-verify/
