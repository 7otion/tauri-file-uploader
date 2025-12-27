import { useEffect } from 'react';
import { listen } from '@tauri-apps/api/event';
import { dropzoneRegistry } from './lib/dropzone-registry';
export function DropzoneEventListener() {
    useEffect(() => {
        const unlistenFns = [];
        const handleHighlight = (event) => {
            const { position } = event.payload;
            dropzoneRegistry.clearHighlights();
            dropzoneRegistry.highlightDropzone(position.x, position.y);
        };
        listen('tauri://drag-enter', handleHighlight).then(unlisten => unlistenFns.push(unlisten));
        listen('tauri://drag-over', handleHighlight).then(unlisten => unlistenFns.push(unlisten));
        listen('tauri://drag-leave', () => {
            dropzoneRegistry.clearHighlights();
        }).then(unlisten => unlistenFns.push(unlisten));
        listen('tauri://drag-drop', (event) => {
            const { position, paths } = event.payload;
            dropzoneRegistry.handleDrop(position.x, position.y, paths || []);
            dropzoneRegistry.clearHighlights();
        }).then(unlisten => unlistenFns.push(unlisten));
        return () => {
            unlistenFns.forEach(fn => fn());
        };
    }, []);
    return null;
}
