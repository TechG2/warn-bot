import fs from "node:fs";
import path from "node:path";

export function getFiles(
  folderPath: string,
  folder: boolean = false
): string[] {
  const foudFiles = fs.readdirSync(folderPath);
  const files: string[] = [];

  foudFiles.forEach((file: string) => {
    const fullPath = path.join(folderPath, file);

    if (folder) {
      if (fs.lstatSync(fullPath).isDirectory()) files.push(fullPath);
    } else {
      if (fs.lstatSync(fullPath).isFile()) files.push(fullPath);
    }
  });

  return files;
}
