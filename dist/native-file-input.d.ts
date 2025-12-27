import { type ComponentType, type ButtonHTMLAttributes } from 'react';
import type { IFile } from './types';
export interface ButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: string;
    children?: React.ReactNode;
}
export interface NativeFileInputProps {
    onFileChange: (file: IFile) => Promise<boolean> | boolean;
    dialogTitle?: string;
    extensionFilter?: string[];
    mode?: 'file' | 'folder';
    ButtonComponent?: ComponentType<ButtonComponentProps>;
    buttonClassName?: string;
    buttonVariant?: string;
}
declare const NativeFileInput: ({ onFileChange, dialogTitle, extensionFilter, mode, ButtonComponent, buttonClassName, buttonVariant, }: NativeFileInputProps) => import("react/jsx-runtime").JSX.Element;
export { NativeFileInput };
//# sourceMappingURL=native-file-input.d.ts.map