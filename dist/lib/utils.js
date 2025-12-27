export const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes === 0)
        return '0 Bytes';
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const sizeIndex = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    const size = (sizeInBytes / Math.pow(1024, sizeIndex)).toFixed(2);
    return `${size} ${units[sizeIndex]}`;
};
