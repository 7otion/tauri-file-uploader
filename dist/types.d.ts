export type FileType = 'video' | 'image' | 'document' | 'other';
export interface IFile {
    path: string;
    name: string;
    size: number;
    mime: string;
    extension: string;
    ctime: number;
    mtime: number;
    file_type: FileType;
    is_directory: boolean;
}
//# sourceMappingURL=types.d.ts.map