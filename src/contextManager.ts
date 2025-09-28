import * as fs from "fs/promises";
import * as path from "path";

export class ContextManager {
  private contextsDir: string;

  constructor() {
    this.contextsDir = path.join(process.cwd(), "contexts");
    this.ensureContextsDirExists();
  }

  private async ensureContextsDirExists(): Promise<void> {
    try {
      await fs.mkdir(this.contextsDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create contexts directory:", error);
    }
  }

  private getContextFilePath(name: string): string {
    return path.join(this.contextsDir, `${name}.json`);
  }

  async saveContext(name: string, content: string): Promise<void> {
    const filePath = this.getContextFilePath(name);
    await fs.writeFile(filePath, content, "utf-8");
  }

  async loadContext(name: string): Promise<string | null> {
    const filePath = this.getContextFilePath(name);
    try {
      return await fs.readFile(filePath, "utf-8");
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return null;
      }
      throw error;
    }
  }

  async listContexts(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.contextsDir);
      return files
        .filter((file) => file.endsWith(".json"))
        .map((file) => path.basename(file, ".json"));
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return [];
      }
      throw error;
    }
  }

  async deleteContext(name: string): Promise<void> {
    const filePath = this.getContextFilePath(name);
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        // Context not found, do nothing
        return;
      }
      throw error;
    }
  }
}