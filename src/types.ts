export type FileType = 'video' | 'image' | 'document' | 'other';

/**
 * File information interface compatible with Tauri's fs plugin stat() output
 */
export interface IFile {
	/** Full path to the file */
	path: string;
	/** File name with extension */
	name: string;
	/** File size in bytes */
	size: number;
	/** MIME type of the file */
	mime: string;
	/** File extension without dot */
	extension: string;
	/** Creation time (Unix timestamp in milliseconds) */
	ctime: number;
	/** Last modified time (Unix timestamp in milliseconds) */
	mtime: number;
	/** Categorized file type */
	file_type: FileType;
	/** Whether this is a directory */
	is_directory: boolean;
}
