import { readdir } from "fs/promises"
import path from "path"
import { Project } from "ts-morph"

export interface FilesResult {
    name: string
    parentPath: string
    path: string
    analysis: {
        functions:
        { name: string | undefined; params: string[]; returnType: string; lineNumber: number; }[];
        classes: { name: string | undefined; methods: { name: string; params: { name: string; type: string; }[]; returnType: string; lineNumber: number; }[]; properties: { name: string; type: string; }[]; }[];
        imports: { source: string; specifiers: { name: string; isTypeOnly: boolean; }[]; defaultImport: string | null; }[];
        exports: string[];
    }
}
const project = new Project({
    skipAddingFilesFromTsConfig: true,
    skipFileDependencyResolution: true,
    compilerOptions: {
        skipLibCheck: true,
        noResolve: true,
        allowJs: true,
    }
});
async function analyzeFolder(dir: string): Promise<FilesResult[]> {
    const SKIP = [
        // Version control
        ".git", ".svn", ".hg",
        // JavaScript / TypeScript
        "node_modules", "dist", "build", ".next", ".nuxt", ".output", "coverage", ".turbo",
        // Python
        ".venv", "venv", "env", "__pycache__", ".mypy_cache", ".pytest_cache", ".tox", "*.egg-info",
        // Java / Kotlin / Scala
        "target", ".gradle", ".idea", "out",
        // C / C++ / CMake
        "cmake-build-debug", "cmake-build-release",
        // .NET / C#
        "bin", "obj", ".vs",
        // Ruby
        "vendor", ".bundle",
        // Go
        "vendor",
        // Rust
        // ("target" already listed above)
        // PHP
        // ("vendor" already listed above)
        // Dart / Flutter
        ".dart_tool", ".pub-cache",
        // Swift / Xcode
        ".build", "DerivedData", "Pods",
        // Elixir
        "_build", "deps",
        // General
        ".cache", ".tmp", "tmp", "temp", ".DS_Store", "Thumbs.db",
    ];
    const SOURCE_EXTENSIONS = new Set([
        // JavaScript / TypeScript
        ".ts", ".tsx", ".js", ".jsx", ".mts", ".cts", ".mjs", ".cjs",
        // Python
        ".py", ".pyw", ".pyi",
        // Java / Kotlin / Scala
        ".java", ".kt", ".kts", ".scala",
        // C / C++ / Objective-C
        ".c", ".h", ".cpp", ".cxx", ".cc", ".hpp", ".hxx", ".m", ".mm",
        // C#
        ".cs",
        // Go
        ".go",
        // Rust
        ".rs",
        // Ruby
        ".rb", ".erb",
        // PHP
        ".php",
        // Swift
        ".swift",
        // Dart
        ".dart",
        // Lua
        ".lua",
        // Shell
        ".sh", ".bash", ".zsh", ".fish",
        // Elixir / Erlang
        ".ex", ".exs", ".erl",
        // Haskell
        ".hs",
        // R
        ".r", ".R",
        // Perl
        ".pl", ".pm",
        // Zig
        ".zig",
        // Nim
        ".nim",
        // Julia
        ".jl",
        // Web / Markup
        ".html", ".htm", ".css", ".scss", ".sass", ".less", ".vue", ".svelte",
        // Config / Data
        ".json", ".yaml", ".yml", ".toml", ".xml", ".graphql", ".gql",
        // SQL
        ".sql",
        // Markdown / Docs
        ".md", ".mdx",
    ]);
    let results: FilesResult[] = [];
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        if (SKIP.includes(entry.name)) continue;

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            const nested = await analyzeFolder(fullPath);
            results.push(...nested);
        } else if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
            const analysis = await getAnalysis(fullPath);
            results.push({ name: entry.name, parentPath: dir, path: fullPath, analysis });
        }
    }

    return results;
}

async function analyzeFile(path: string): Promise<FilesResult[]> {
    let filesAndFolders: FilesResult[] = []
    let analyze = await getAnalysis(path)
    filesAndFolders.push({
        name: path,
        parentPath: path,
        path: path,
        analysis: analyze
    })
    return filesAndFolders
}
async function getAnalysis(filePath: string) {
    let file = project.addSourceFileAtPath(filePath);
    if (file) {
        file.refreshFromFileSystemSync();
    } else {
        file = project.addSourceFileAtPath(filePath);
    }
    return {
        functions: file.getFunctions().map(f => ({
            name: f.getName(),
            params: f.getParameters().map(p => p.getName()),
            returnType: f.getReturnTypeNode()?.getText() || "unknown",
            lineNumber: f.getStartLineNumber()
        })),
        classes: file.getClasses().map(c => ({
            name: c.getName(),
            methods: c.getMethods().map(m => ({
                name: m.getName(),
                params: m.getParameters().map(p => ({
                    name: p.getName(),
                    type: p.getTypeNode()?.getText() || "unknown"
                })),
                returnType: m.getReturnTypeNode()?.getText() || "unknown",
                lineNumber: m.getStartLineNumber()
            })),
            properties: c.getProperties().map(p => ({
                name: p.getName(),
                type: p.getTypeNode()?.getText() || "unknown"
            }))
        })),
        imports: file.getImportDeclarations().map(i => ({
            source: i.getModuleSpecifierValue(),
            specifiers: i.getNamedImports().map(n => ({
                name: n.getName(),
                isTypeOnly: n.isTypeOnly() || i.isTypeOnly()
            })),
            defaultImport: i.getDefaultImport()?.getText() || null
        })),
        exports: [...file.getExportedDeclarations().keys()]
    };
}

export {
    analyzeFile,
    analyzeFolder
}