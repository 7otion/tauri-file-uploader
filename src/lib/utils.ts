/**
 * Format file size in bytes to human-readable format
 * @param sizeInBytes - File size in bytes
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export const formatFileSize = (sizeInBytes: number): string => {
	if (sizeInBytes === 0) return '0 Bytes';

	const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
	const sizeIndex = Math.floor(Math.log(sizeInBytes) / Math.log(1024));

	const size = (sizeInBytes / Math.pow(1024, sizeIndex)).toFixed(2);
	return `${size} ${units[sizeIndex]}`;
};
