import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState, } from 'react';
import { FileIcon, TrashIcon, XIcon } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import { convertFileSrc } from '@tauri-apps/api/core';
import { formatFileSize } from './lib/utils';
import { dropzoneRegistry } from './lib/dropzone-registry';
const DefaultButton = ({ children, ...props }) => _jsx("button", { ...props, children: children });
const isImage = (file) => file.mime.startsWith('image/') ||
    ['jpg', 'jpeg', 'png', 'webp', 'ico', 'bmp', 'gif', 'svg'].includes(file.extension);
export const FileDropzone = ({ id, files, handleFilesStateChange, filters, disabled = false, ButtonComponent = DefaultButton, containerClassName = '', hoveredClassName = '', emptyStateClassName = '', fileGridClassName = '', fileCardClassName = '', containerStyle, }) => {
    const dropZoneRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    useEffect(() => {
        if (disabled)
            return;
        dropzoneRegistry.unregister(id);
        dropzoneRegistry.register(id, dropZoneRef, newFilePaths => {
            const existingPaths = files.map(f => f.path);
            const mergedPaths = [
                ...existingPaths,
                ...newFilePaths.filter((p) => !existingPaths.includes(p)),
            ];
            handleFilesStateChange(id, mergedPaths);
        }, setIsHovered);
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
                ...openResult.filter((p) => !existingPaths.includes(p)),
            ];
            handleFilesStateChange(id, mergedPaths);
        }
    };
    const handleRemoveFile = (removePath) => {
        const filtered = files
            .filter(f => f.path !== removePath)
            .map(f => f.path);
        handleFilesStateChange(id, filtered);
    };
    const handleReset = () => {
        handleFilesStateChange(id, []);
    };
    const defaultContainerStyle = {
        position: 'relative',
        ...containerStyle,
    };
    const defaultDropzoneStyle = {
        border: '2px dashed #ccc',
        borderRadius: '8px',
        width: '100%',
        minHeight: '150px',
        position: 'relative',
        transition: 'background-color 0.2s',
        backgroundColor: isHovered ? '#f0f0f0' : 'transparent',
    };
    const defaultEmptyStateStyle = {
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
    const defaultFileGridStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        padding: '8px',
    };
    const defaultFileCardStyle = {
        position: 'relative',
    };
    const defaultThumbnailStyle = {
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
    const defaultImageStyle = {
        height: 'auto',
        width: '100%',
        objectFit: 'cover',
        transition: 'transform 0.2s',
        aspectRatio: '1',
    };
    const defaultFileInfoStyle = {
        width: '80px',
        fontSize: '12px',
    };
    return (_jsxs("div", { style: defaultContainerStyle, className: containerClassName, children: [_jsx("div", { style: {
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    display: 'flex',
                    gap: '8px',
                    zIndex: 50,
                }, children: files.length > 0 && (_jsxs(ButtonComponent, { variant: "ghost", type: "button", onClick: handleReset, title: "Clear all", children: [_jsx("span", { children: "Clear All" }), _jsx(TrashIcon, { style: { width: '16px', height: '16px' } })] })) }), _jsx("div", { ref: dropZoneRef, style: defaultDropzoneStyle, className: hoveredClassName && isHovered ? hoveredClassName : '', children: files.length === 0 ? (_jsxs("div", { style: defaultEmptyStateStyle, className: emptyStateClassName, children: [_jsx(FileIcon, { style: { width: '24px', height: '24px' } }), _jsx(ButtonComponent, { variant: "ghost", type: "button", onClick: handleButtonClick, disabled: disabled, children: "Drag & drop files here" })] })) : (_jsx("div", { style: defaultFileGridStyle, className: fileGridClassName, children: files.map((file, index) => (_jsxs("div", { style: defaultFileCardStyle, className: fileCardClassName, children: [_jsx(ButtonComponent, { variant: "outline", type: "button", onClick: () => handleRemoveFile(file.path), title: "Remove", style: {
                                    position: 'absolute',
                                    width: '28px',
                                    height: '28px',
                                    top: 0,
                                    right: 0,
                                    zIndex: 10,
                                    color: '#dc2626',
                                }, children: _jsx(XIcon, { style: {
                                        width: '16px',
                                        height: '16px',
                                    } }) }), _jsx("div", { style: defaultThumbnailStyle, children: isImage(file) ? (_jsx("img", { src: convertFileSrc(file.path), alt: file.name, style: defaultImageStyle })) : (_jsx(FileIcon, { style: {
                                        width: '48px',
                                        height: '48px',
                                        color: '#9ca3af',
                                    } })) }), _jsxs("div", { style: defaultFileInfoStyle, children: [_jsx("div", { style: {
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }, children: file.name }), _jsx("div", { style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }, children: _jsx("p", { style: { color: '#6b7280' }, children: formatFileSize(file.size) }) })] })] }, `${id}_thumb_${index}`))) })) })] }));
};
