/**
 * Dropzone Event Listener
 *
 * Global component that listens to Tauri's drag-and-drop events and routes them
 * to registered dropzones via the DropzoneRegistry.
 *
 * **Usage**: Mount this component once at the root of your application.
 *
 * @module @7otion/tauri-file-uploader/event-listener
 * @requires @tauri-apps/api/event - Tauri event system
 * @requires @7otion/tauri-file-uploader/registry - Dropzone registry singleton
 */

import { useEffect } from 'react';

import { listen } from '@tauri-apps/api/event';

import { dropzoneRegistry } from './lib/dropzone-registry';

/**
 * Global event listener component for Tauri drag-and-drop events.
 * Should be mounted once in your app root (e.g., in App.tsx).
 *
 * Listens to:
 * - tauri://drag-enter
 * - tauri://drag-over
 * - tauri://drag-leave
 * - tauri://drag-drop
 */
export function DropzoneEventListener() {
	useEffect(() => {
		const unlistenFns: (() => void)[] = [];

		const handleHighlight = (event: any) => {
			const { position } = event.payload;
			dropzoneRegistry.clearHighlights();
			dropzoneRegistry.highlightDropzone(position.x, position.y);
		};

		listen('tauri://drag-enter', handleHighlight).then(unlisten =>
			unlistenFns.push(unlisten),
		);
		listen('tauri://drag-over', handleHighlight).then(unlisten =>
			unlistenFns.push(unlisten),
		);
		listen('tauri://drag-leave', () => {
			dropzoneRegistry.clearHighlights();
		}).then(unlisten => unlistenFns.push(unlisten));
		listen('tauri://drag-drop', (event: any) => {
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
