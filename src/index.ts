/**
 * @7otion/tauri-file-uploader
 *
 * A lightweight, unstyled file uploader library for React + Tauri applications.
 * Provides drag-and-drop file selection without enforcing any styling.
 *
 * @example
 * ```tsx
 * import {
 *   FileDropzone,
 *   NativeFileInput,
 *   DropzoneEventListener,
 *   getFileDetails
 * } from '@7otion/tauri-file-uploader';
 *
 * // In your App.tsx
 * function App() {
 *   return (
 *     <>
 *       <DropzoneEventListener />
 *       <YourComponents />
 *     </>
 *   );
 * }
 * ```
 */

// Components
export { FileDropzone } from './file-dropzone';
export { NativeFileInput } from './native-file-input';
export { DropzoneEventListener } from './dropzone-event-listener';

// Types
export type { IFile, FileType } from './types';
export type {
	ButtonComponentProps,
	NativeFileInputProps,
} from './native-file-input';

// Utilities
export { formatFileSize } from './lib/utils';
export { getFileDetails } from './lib/file-utils';

// Registry (for advanced usage)
export {
	dropzoneRegistry,
	type DropzoneCallback,
	type HighlightCallback,
	type DropzoneEntry,
} from './lib/dropzone-registry';
