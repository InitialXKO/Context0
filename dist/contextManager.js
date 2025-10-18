"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextManager = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class ContextManager {
    constructor(options = {}) {
        const baseDir = options.rootDir ? path.resolve(options.rootDir) : process.cwd();
        this.contextsDir = options.contextsDir
            ? path.resolve(options.contextsDir)
            : path.join(baseDir, "contexts");
        this.ready = this.ensureContextsDirExists();
    }
    async ensureContextsDirExists() {
        try {
            await fs.mkdir(this.contextsDir, { recursive: true });
        }
        catch (error) {
            console.error("Failed to create contexts directory:", error);
            throw error;
        }
    }
    async ensureReady() {
        await this.ready;
    }
    getContextFilePath(name) {
        return path.join(this.contextsDir, `${name}.json`);
    }
    async saveContext(name, content) {
        await this.ensureReady();
        const filePath = this.getContextFilePath(name);
        await fs.writeFile(filePath, content, "utf-8");
    }
    async loadContext(name) {
        await this.ensureReady();
        const filePath = this.getContextFilePath(name);
        try {
            return await fs.readFile(filePath, "utf-8");
        }
        catch (error) {
            if (error.code === "ENOENT") {
                return null;
            }
            throw error;
        }
    }
    async listContexts() {
        await this.ensureReady();
        try {
            const files = await fs.readdir(this.contextsDir);
            return files
                .filter((file) => file.endsWith(".json"))
                .map((file) => path.basename(file, ".json"));
        }
        catch (error) {
            if (error.code === "ENOENT") {
                return [];
            }
            throw error;
        }
    }
    async deleteContext(name) {
        await this.ensureReady();
        const filePath = this.getContextFilePath(name);
        try {
            await fs.unlink(filePath);
        }
        catch (error) {
            if (error.code === "ENOENT") {
                return;
            }
            throw error;
        }
    }
    getContextsDirectory() {
        return this.contextsDir;
    }
}
exports.ContextManager = ContextManager;
