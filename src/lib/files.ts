import { readdir } from "fs/promises"
import path from "path"
import { Project, SyntaxKind } from "ts-morph"

export interface FilesResult {
    name: string
    parentPath: string
    path: string
    analysis: {
        functions:
        { name: string | undefined; params: string[]; returnType: string; lineNumber: number; }[];
        classes: (string | undefined)[];
        imports: string[];
        exports: MapIterator<string>;
    }
}
async function analyzeFolder(dir: string): Promise<FilesResult[]> {
    let filesAndFolders: FilesResult[] = []

    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        if (entry.isDirectory()) {
            await analyzeFolder(path.join(dir, entry.name))
        } else {
            const fullPath = path.join(dir, entry.name)
            let analyze = await getAnalysis(fullPath)
            filesAndFolders.push({
                name: entry.name,
                parentPath: dir,
                path: fullPath,
                analysis: analyze
            })
        }

    }
    return filesAndFolders
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
    const project = new Project({
        skipAddingFilesFromTsConfig: true,
        skipFileDependencyResolution: true,  // 👈 stops it from following imports
        compilerOptions: {
            skipLibCheck: true,                 // 👈 skip type checking
            noResolve: true,                    // 👈 don't resolve modules
            allowJs: true,
        }
    });
    const file = project.addSourceFileAtPath(filePath);
    return {
        functions: file.getFunctions().map(f => ({
            name: f.getName(),
            params: f.getParameters().map(p => p.getName()),
            returnType: f.getReturnTypeNode()?.getText() || "unknown",
            lineNumber: f.getStartLineNumber()
        })),
        classes: file.getClasses().map(c => c.getName()),
        imports: file.getImportDeclarations().map(i => i.getModuleSpecifierValue()),
        exports: file.getExportedDeclarations().keys()
    };
}

export {
    analyzeFile,
    analyzeFolder
}