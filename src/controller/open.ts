import { platform } from "process";
import { exec } from "child_process";
export const open = (path: string) => {
  switch (platform) {
    case "win32":
      exec(`explorer ${path}`);
      break;
    case "darwin":
      exec(`open ${path}`);
      break;
    case "linux":
      exec(`xdg-open ${path}`);
      break;
    default:
      break;
  }
  console.log(path);
};
