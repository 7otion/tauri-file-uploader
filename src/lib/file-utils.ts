/**
 * File Utilities
 *
 * Helper functions for working with files in Tauri applications using the fs plugin.
 */

import { stat } from '@tauri-apps/plugin-fs';
import type { IFile, FileType } from '../types';

/**
 * MIME type mappings for common file extensions
 */
const MIME_TYPES: Record<string, string> = {
	// Images
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	gif: 'image/gif',
	webp: 'image/webp',
	svg: 'image/svg+xml',
	bmp: 'image/bmp',
	ico: 'image/x-icon',

	// Videos
	mp4: 'video/mp4',
	webm: 'video/webm',
	ogg: 'video/ogg',
	avi: 'video/x-msvideo',
	mov: 'video/quicktime',
	mkv: 'video/x-matroska',

	// Documents
	pdf: 'application/pdf',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	xls: 'application/vnd.ms-excel',
	xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	ppt: 'application/vnd.ms-powerpoint',
	pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	txt: 'text/plain',
	csv: 'text/csv',
	json: 'application/json',
	xml: 'application/xml',

	// Archives
	zip: 'application/zip',
	rar: 'application/x-rar-compressed',
	'7z': 'application/x-7z-compressed',
	tar: 'application/x-tar',
	gz: 'application/gzip',
};

/**
 * Get MIME type from file extension
 */
function getMimeType(extension: string): string {
	return MIME_TYPES[extension.toLowerCase()] || 'application/octet-stream';
}

/**
 * Categorize file by MIME type
 */
function categorizeFileType(mime: string): FileType {
	if (mime.startsWith('image/')) return 'image';
	if (mime.startsWith('video/')) return 'video';
	if (
		mime.startsWith('text/') ||
		mime.includes('document') ||
		mime.includes('pdf') ||
		mime.includes('spreadsheet') ||
		mime.includes('presentation')
	) {
		return 'document';
	}
	return 'other';
}

/**
 * Get file details using Tauri's fs plugin
 *
 * @param filePath - Absolute path to the file
 * @returns File information including metadata
 *
 * @example
 * ```ts
 * const fileInfo = await getFileDetails('/path/to/file.jpg');
 * console.log(fileInfo.name, fileInfo.size, fileInfo.mime);
 * ```
 */
export async function getFileDetails(filePath: string): Promise<IFile> {
	const metadata = await stat(filePath);

	// Extract file name from path
	const pathParts = filePath.replace(/\\/g, '/').split('/');
	const name = pathParts[pathParts.length - 1];

	// Extract extension
	const nameParts = name.split('.');
	const extension =
		nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

	// Determine MIME type and file type
	const mime = getMimeType(extension);
	const file_type = categorizeFileType(mime);

	return {
		path: filePath,
		name,
		size: metadata.size,
		mime,
		extension,
		ctime: metadata.mtime ? new Date(metadata.mtime).getTime() : Date.now(),
		mtime: metadata.mtime ? new Date(metadata.mtime).getTime() : Date.now(),
		file_type,
		is_directory: metadata.isDirectory,
	};
}
