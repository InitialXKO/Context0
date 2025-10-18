import * as fs from "fs/promises";
import * as path from "path";

export interface ContextManagerOptions {
  rootDir?: string;
  contextsDir?: string;
}

export class ContextManager {
  private contextsDir: string;
  private ready: Promise<void>;

  constructor(options: ContextManagerOptions = {}) {
    const baseDir = options.rootDir ? path.resolve(options.rootDir) : process.cwd();
    this.contextsDir = options.contextsDir
      ? path.resolve(options.contextsDir)
      : path.join(baseDir, "contexts");
    this.ready = this.ensureContextsDirExists();
  }

  private async ensureContextsDirExists(): Promise<void> {
    try {
      await fs.mkdir(this.contextsDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create contexts directory:", error);
      throw error;
    }
  }

  private async ensureReady(): Promise<void> {
    await this.ready;
  }

  private getContextFilePath(name: string): string {
    return path.join(this.contextsDir, `${name}.json`);
  }

  async saveContext(name: string, content: string): Promise<void> {
    await this.ensureReady();
    const filePath = this.getContextFilePath(name);
    await fs.writeFile(filePath, content, "utf-8");
  }

  async loadContext(name: string): Promise<string | null> {
    await this.ensureReady();
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
    await this.ensureReady();
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
    await this.ensureReady();
    const filePath = this.getContextFilePath(name);
    try {
      await fs.unlink(filePath);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        return;
      }
      throw error;
    }
  }

  getContextsDirectory(): string {
    return this.contextsDir;
  }
}
