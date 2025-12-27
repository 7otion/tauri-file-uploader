import { stat } from '@tauri-apps/plugin-fs';
const MIME_TYPES = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    ico: 'image/x-icon',
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogg: 'video/ogg',
    avi: 'video/x-msvideo',
    mov: 'video/quicktime',
    mkv: 'video/x-matroska',
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
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',
};
function getMimeType(extension) {
    return MIME_TYPES[extension.toLowerCase()] || 'application/octet-stream';
}
function categorizeFileType(mime) {
    if (mime.startsWith('image/'))
        return 'image';
    if (mime.startsWith('video/'))
        return 'video';
    if (mime.startsWith('text/') ||
        mime.includes('document') ||
        mime.includes('pdf') ||
        mime.includes('spreadsheet') ||
        mime.includes('presentation')) {
        return 'document';
    }
    return 'other';
}
export async function getFileDetails(filePath) {
    const metadata = await stat(filePath);
    const pathParts = filePath.replace(/\\/g, '/').split('/');
    const name = pathParts[pathParts.length - 1];
    const nameParts = name.split('.');
    const extension = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
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
