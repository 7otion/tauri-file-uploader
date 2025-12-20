/**
 * Native File Input Component
 *
 * A button-based file/folder picker using Tauri's native dialog.
 * Displays the selected file name and size.
 *
 * **Use Cases**:
 * - Single file selection
 * - Folder selection
 * - Form inputs where drag-and-drop is not needed
 *
 * @module @7otion/tauri-file-uploader/native-input
 * @requires @tauri-apps/plugin-dialog - Native file picker dialog
 */

import { useState, type ComponentType, type ButtonHTMLAttributes } from 'react';
import { open, type OpenDialogOptions } from '@tauri-apps/plugin-dialog';

import type { IFile } from './types';
import { formatFileSize } from './lib/utils';
import { getFileDetails } from './lib/file-utils';

/**
 * Props for custom button component
 */
export interface ButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: string;
	children?: React.ReactNode;
}

/**
 * Props for NativeFileInput component
 */
export interface NativeFileInputProps {
	/** Callback when a file is selected. Return true to accept the file. */
	onFileChange: (file: IFile) => Promise<boolean> | boolean;
	/** Title for the file picker dialog */
	dialogTitle?: string;
	/** Array of allowed file extensions (e.g., ['png', 'jpg']) */
	extensionFilter?: string[];
	/** Whether to pick a 'file' or 'folder' */
	mode?: 'file' | 'folder';
	/** Custom button component to render. Receives variant and onClick props. */
	ButtonComponent?: ComponentType<ButtonComponentProps>;
	/** Custom CSS classes for the button */
	buttonClassName?: string;
	/** Variant to pass to custom button (e.g., 'outline', 'primary') */
	buttonVariant?: string;
}

/**
 * Default unstyled button component
 */
const DefaultButton: ComponentType<ButtonComponentProps> = ({
	children,
	...props
}) => <button {...props}>{children}</button>;

/**
 * Native file/folder picker component.
 *
 * @example
 * ```tsx
 * <NativeFileInput
 *   dialogTitle="Select Avatar"
 *   extensionFilter={['png', 'jpg']}
 *   onFileChange={(file) => {
 *     setAvatar(file);
 *     return true;
 *   }}
 *   ButtonComponent={YourButtonComponent}
 *   buttonVariant="outline"
 * />
 * ```
 */
const NativeFileInput = ({
	onFileChange,
	dialogTitle,
	extensionFilter,
	mode = 'file',
	ButtonComponent = DefaultButton,
	buttonClassName = '',
	buttonVariant = 'outline',
}: NativeFileInputProps) => {
	const [currentFile, setCurrentFile] = useState<IFile>();

	const handleButtonClick = async () => {
		const isFolder = mode === 'folder';

		const openFileDialogConfig: OpenDialogOptions = {
			title: dialogTitle ?? (isFolder ? 'Select Folder' : 'Select File'),
			multiple: false,
			directory: isFolder,
		};

		if (!isFolder && extensionFilter) {
			openFileDialogConfig.filters = [
				{
					name: '',
					extensions: extensionFilter,
				},
			];
		}

		const result = await open(openFileDialogConfig);
		if (typeof result !== 'undefined' && result !== null) {
			const fileDetails = await getFileDetails(result);
			const isAccepted = await onFileChange(fileDetails);
			if (isAccepted) {
				setCurrentFile(fileDetails);
			}
		}
	};

	return (
		<ButtonComponent
			className={buttonClassName}
			variant={currentFile ? 'success' : buttonVariant}
			type="button"
			onClick={handleButtonClick}
		>
			<span>{dialogTitle}</span>
			{mode !== 'folder' && currentFile && (
				<span>
					(
					<span
						style={{
							maxWidth: '4rem',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							display: 'inline-block',
						}}
					>
						{currentFile.name}
					</span>
					{!currentFile.is_directory && (
						<span> {formatFileSize(currentFile.size)}</span>
					)}
					)
				</span>
			)}
		</ButtonComponent>
	);
};

export { NativeFileInput };
