import { open } from "@tauri-apps/plugin-shell";

export async function openLink(url: string) {
  try {
    const parsed = new URL(url);

    // Allow only https and http (optionally mailto, tel)
    const allowedProtocols = ["https:", "http:"];
    if (!allowedProtocols.includes(parsed.protocol)) {
      throw new Error("Blocked: Disallowed URL protocol");
    }

    await open(url);
  } catch (err) {
    console.error("Failed to openLink: ", err);
  }
}
