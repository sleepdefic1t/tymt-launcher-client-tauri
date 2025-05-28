import { open } from "@tauri-apps/plugin-shell";

export async function openLink(url: string) {
  if (!/^https:\/\//i.test(url)) {
    console.error("Only HTTPS links are allowed.");
    return;
  }
  try {
    await open(url);
  } catch (err) {
    console.error("Failed to open link:", err);
  }
}
