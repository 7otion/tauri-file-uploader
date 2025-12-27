import { type ComponentType, type CSSProperties } from 'react';
import type { IFile } from './types';
import type { ButtonComponentProps } from './native-file-input';
type FileDropzoneProps = {
    id: string;
    files: IFile[];
    handleFilesStateChange: (id: string, filePaths: string[]) => void;
    filters?: {
        name: string;
        extensions: string[];
    }[];
    disabled?: boolean;
    ButtonComponent?: ComponentType<ButtonComponentProps>;
    containerClassName?: string;
    hoveredClassName?: string;
    emptyStateClassName?: string;
    fileGridClassName?: string;
    fileCardClassName?: string;
    containerStyle?: CSSProperties;
};
export declare const FileDropzone: ({ id, files, handleFilesStateChange, filters, disabled, ButtonComponent, containerClassName, hoveredClassName, emptyStateClassName, fileGridClassName, fileCardClassName, containerStyle, }: FileDropzoneProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=file-dropzone.d.ts.map