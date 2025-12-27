import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { open } from '@tauri-apps/plugin-dialog';
import { formatFileSize } from './lib/utils';
import { getFileDetails } from './lib/file-utils';
const DefaultButton = ({ children, ...props }) => _jsx("button", { ...props, children: children });
const NativeFileInput = ({ onFileChange, dialogTitle, extensionFilter, mode = 'file', ButtonComponent = DefaultButton, buttonClassName = '', buttonVariant = 'outline', }) => {
    const [currentFile, setCurrentFile] = useState();
    const handleButtonClick = async () => {
        const isFolder = mode === 'folder';
        const openFileDialogConfig = {
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
    return (_jsxs(ButtonComponent, { className: buttonClassName, variant: currentFile ? 'success' : buttonVariant, type: "button", onClick: handleButtonClick, children: [_jsx("span", { children: dialogTitle }), mode !== 'folder' && currentFile && (_jsxs("span", { children: ["(", _jsx("span", { style: {
                            maxWidth: '4rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                        }, children: currentFile.name }), !currentFile.is_directory && (_jsxs("span", { children: [" ", formatFileSize(currentFile.size)] })), ")"] }))] }));
};
export { NativeFileInput };
