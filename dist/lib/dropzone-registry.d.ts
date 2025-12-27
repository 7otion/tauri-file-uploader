export type DropzoneCallback = (filePaths: string[]) => void;
export type HighlightCallback = (active: boolean) => void;
export interface DropzoneEntry {
    ref: React.RefObject<HTMLDivElement>;
    onDrop: DropzoneCallback;
    highlight?: HighlightCallback;
}
export declare class DropzoneRegistry {
    private zones;
    register(id: string, ref: React.RefObject<HTMLDivElement>, onDrop: DropzoneCallback, highlight?: HighlightCallback): void;
    unregister(id: string): void;
    handleDrop(x: number, y: number, filePaths: string[]): void;
    highlightDropzone(x: number, y: number): void;
    clearHighlights(): void;
}
export declare const dropzoneRegistry: DropzoneRegistry;
//# sourceMappingURL=dropzone-registry.d.ts.map