/**
 * File Dropzone Component
 *
 * A drag-and-drop file picker component for Tauri applications.
 * Supports both drag-and-drop from file explorer and native file dialog.
 *
 * **Features**:
 * - Drag-and-drop support via Tauri events
 * - Native file picker dialog
 * - File preview with thumbnails for images
 * - Multiple file support
 * - File type filtering
 *
 * @module @7otion/tauri-file-uploader/component
 * @requires @tauri-apps/plugin-dialog - Native file picker
 * @requires @tauri-apps/api/core - File path conversion
 */

import {
	useRef,
	useEffect,
	useState,
	type ComponentType,
	type CSSProperties,
} from 'react';
import { FileIcon, TrashIcon, XIcon } from 'lucide-react';

import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';

import type { IFile } from './types';
import { formatFileSize } from './lib/utils';
import { dropzoneRegistry } from './lib/dropzone-registry';
import type { ButtonComponentProps } from './native-file-input';

/**
 * Default unstyled button component
 */
const DefaultButton: ComponentType<ButtonComponentProps> = ({
	children,
	...props
}) => <button {...props}>{children}</button>;

/**
 * Props for the FileDropzone component
 */
type FileDropzoneProps = {
	/** Unique identifier for this dropzone instance */
	id: string;
	/** Array of currently selected files */
	files: IFile[];
	/** Callback when files are added/removed */
	handleFilesStateChange: (id: string, filePaths: string[]) => void;
	/** Optional file type filters for the native dialog */
	filters?: {
		name: string;
		extensions: string[];
	}[];
	/** Whether the dropzone is disabled */
	disabled?: boolean;
	/** Custom button component to use for actions */
	ButtonComponent?: ComponentType<ButtonComponentProps>;
	/** CSS class for the dropzone container */
	containerClassName?: string;
	/** CSS class for dropzone when hovered during drag */
	hoveredClassName?: string;
	/** CSS class for the empty state container */
	emptyStateClassName?: string;
	/** CSS class for the file grid */
	fileGridClassName?: string;
	/** CSS class for individual file cards */
	fileCardClassName?: string;
	/** Inline styles for the container */
	containerStyle?: CSSProperties;
};

/**
 * Helper function to check if a file is an image
 */
const isImage = (file: IFile) =>
	file.mime.startsWith('image/') ||
	['jpg', 'jpeg', 'png', 'webp', 'ico', 'bmp', 'gif', 'svg'].includes(
		file.extension,
	);

/**
 * FileDropzone Component
 *
 * Provides a drag-and-drop area for file selection in Tauri applications.
 * Automatically registers with the global dropzone registry.
 *
 * @example
 * ```tsx
 * <FileDropzone
 *   id="my-dropzone"
 *   files={files}
 *   handleFilesStateChange={(id, paths) => setFiles(paths)}
 *   filters={[{ name: 'Images', extensions: ['png', 'jpg'] }]}
 *   ButtonComponent={MyCustomButton}
 *   containerClassName="my-dropzone-styles"
 * />
 * ```
 */
export const FileDropzone = ({
	id,
	files,
	handleFilesStateChange,
	filters,
	disabled = false,
	ButtonComponent = DefaultButton,
	containerClassName = '',
	hoveredClassName = '',
	emptyStateClassName = '',
	fileGridClassName = '',
	fileCardClassName = '',
	containerStyle,
}: FileDropzoneProps) => {
	const dropZoneRef = useRef<HTMLDivElement>(null);
	const [isHovered, setIsHovered] = useState(false);

	useEffect(() => {
		if (disabled) return;
		dropzoneRegistry.unregister(id);
		dropzoneRegistry.register(
			id,
			dropZoneRef,
			newFilePaths => {
				const existingPaths = files.map(f => f.path);
				const mergedPaths = [
					...existingPaths,
					...newFilePaths.filter(
						(p: string) => !existingPaths.includes(p),
					),
				];
				handleFilesStateChange(id, mergedPaths);
			},
			setIsHovered,
		);
		return () => {
			dropzoneRegistry.unregister(id);
		};
	}, [
		id,
		handleFilesStateChange,
		files,
		setIsHovered,
		dropZoneRef,
		disabled,
	]);

	const handleButtonClick = async () => {
		const openResult = await open({
			title: 'Select Files',
			multiple: true,
			directory: false,
			filters,
		});

		if (openResult && openResult.length > 0) {
			const existingPaths = files.map(f => f.path);
			const mergedPaths = [
				...existingPaths,
				...openResult.filter((p: string) => !existingPaths.includes(p)),
			];
			handleFilesStateChange(id, mergedPaths);
		}
	};

	const handleRemoveFile = (removePath: string) => {
		const filtered = files
			.filter(f => f.path !== removePath)
			.map(f => f.path);
		handleFilesStateChange(id, filtered);
	};

	const handleReset = () => {
		handleFilesStateChange(id, []);
	};

	// Default styles
	const defaultContainerStyle: CSSProperties = {
		position: 'relative',
		...containerStyle,
	};

	const defaultDropzoneStyle: CSSProperties = {
		border: '2px dashed #ccc',
		borderRadius: '8px',
		width: '100%',
		minHeight: '150px',
		position: 'relative',
		transition: 'background-color 0.2s',
		backgroundColor: isHovered ? '#f0f0f0' : 'transparent',
	};

	const defaultEmptyStateStyle: CSSProperties = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		textAlign: 'center',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		gap: '12px',
	};

	const defaultFileGridStyle: CSSProperties = {
		display: 'flex',
		flexWrap: 'wrap',
		gap: '16px',
		alignItems: 'center',
		height: '100%',
		width: '100%',
		padding: '8px',
	};

	const defaultFileCardStyle: CSSProperties = {
		position: 'relative',
	};

	const defaultThumbnailStyle: CSSProperties = {
		overflow: 'hidden',
		borderRadius: '6px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f5f5f5',
		aspectRatio: '1',
		width: '80px',
		height: '80px',
	};

	const defaultImageStyle: CSSProperties = {
		height: 'auto',
		width: '100%',
		objectFit: 'cover',
		transition: 'transform 0.2s',
		aspectRatio: '1',
	};

	const defaultFileInfoStyle: CSSProperties = {
		width: '80px',
		fontSize: '12px',
	};

	return (
		<div style={defaultContainerStyle} className={containerClassName}>
			<div
				style={{
					position: 'absolute',
					top: '8px',
					right: '8px',
					display: 'flex',
					gap: '8px',
					zIndex: 50,
				}}
			>
				{files.length > 0 && (
					<ButtonComponent
						variant="ghost"
						type="button"
						onClick={handleReset}
						title="Clear all"
					>
						<span>Clear All</span>
						<TrashIcon style={{ width: '16px', height: '16px' }} />
					</ButtonComponent>
				)}
			</div>
			<div
				ref={dropZoneRef}
				style={defaultDropzoneStyle}
				className={
					hoveredClassName && isHovered ? hoveredClassName : ''
				}
			>
				{files.length === 0 ? (
					<div
						style={defaultEmptyStateStyle}
						className={emptyStateClassName}
					>
						<FileIcon style={{ width: '24px', height: '24px' }} />
						<ButtonComponent
							variant="ghost"
							type="button"
							onClick={handleButtonClick}
							disabled={disabled}
						>
							Drag & drop files here
						</ButtonComponent>
					</div>
				) : (
					<div
						style={defaultFileGridStyle}
						className={fileGridClassName}
					>
						{files.map((file, index) => (
							<div
								style={defaultFileCardStyle}
								className={fileCardClassName}
								key={`${id}_thumb_${index}`}
							>
								<ButtonComponent
									variant="outline"
									type="button"
									onClick={() => handleRemoveFile(file.path)}
									title="Remove"
									style={{
										position: 'absolute',
										width: '28px',
										height: '28px',
										top: 0,
										right: 0,
										zIndex: 10,
										color: '#dc2626',
									}}
								>
									<XIcon
										style={{
											width: '16px',
											height: '16px',
										}}
									/>
								</ButtonComponent>
								<div style={defaultThumbnailStyle}>
									{isImage(file) ? (
										<img
											src={convertFileSrc(file.path)}
											alt={file.name}
											style={defaultImageStyle}
										/>
									) : (
										<FileIcon
											style={{
												width: '48px',
												height: '48px',
												color: '#9ca3af',
											}}
										/>
									)}
								</div>
								<div style={defaultFileInfoStyle}>
									<div
										style={{
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											whiteSpace: 'nowrap',
										}}
									>
										{file.name}
									</div>
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
										}}
									>
										<p style={{ color: '#6b7280' }}>
											{formatFileSize(file.size)}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
