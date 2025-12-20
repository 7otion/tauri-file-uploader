/**
 * Dropzone Registry
 *
 * Centralized registry for managing multiple file dropzones in a Tauri application.
 * This allows the global Tauri drag-and-drop events to be routed to the correct
 * dropzone component based on cursor position.
 *
 * @module @tauri-file-dropzone/registry
 */

export type DropzoneCallback = (filePaths: string[]) => void;
export type HighlightCallback = (active: boolean) => void;

export interface DropzoneEntry {
	ref: React.RefObject<HTMLDivElement>;
	onDrop: DropzoneCallback;
	highlight?: HighlightCallback;
}

/**
 * Registry for managing multiple dropzone areas.
 * Singleton pattern ensures all dropzones share the same registry.
 */
export class DropzoneRegistry {
	private zones = new Map<string, DropzoneEntry>();

	/**
	 * Register a dropzone with the registry.
	 * @param id - Unique identifier for the dropzone
	 * @param ref - React ref to the dropzone DOM element
	 * @param onDrop - Callback to handle dropped files
	 * @param highlight - Optional callback to handle hover state
	 */
	register(
		id: string,
		ref: React.RefObject<HTMLDivElement>,
		onDrop: DropzoneCallback,
		highlight?: HighlightCallback,
	) {
		this.zones.set(id, { ref, onDrop, highlight });
	}

	/**
	 * Remove a dropzone from the registry.
	 * @param id - Unique identifier of the dropzone to remove
	 */
	unregister(id: string) {
		this.zones.delete(id);
	}

	/**
	 * Handle file drop at specific coordinates.
	 * Finds the dropzone at the given position and triggers its callback.
	 * @param x - X coordinate of drop position
	 * @param y - Y coordinate of drop position
	 * @param filePaths - Array of file paths that were dropped
	 */
	handleDrop(x: number, y: number, filePaths: string[]) {
		for (const { ref, onDrop } of this.zones.values()) {
			const el = ref.current;
			if (el) {
				const rect = el.getBoundingClientRect();
				if (
					x >= rect.left &&
					x <= rect.right &&
					y >= rect.top &&
					y <= rect.bottom
				) {
					onDrop(filePaths);
					break;
				}
			}
		}
	}

	/**
	 * Highlight the dropzone at specific coordinates.
	 * Used to provide visual feedback during drag operations.
	 * @param x - X coordinate
	 * @param y - Y coordinate
	 */
	highlightDropzone(x: number, y: number) {
		for (const { ref, highlight } of this.zones.values()) {
			const el = ref.current;
			if (el && highlight) {
				const rect = el.getBoundingClientRect();
				const isInside =
					x >= rect.left &&
					x <= rect.right &&
					y >= rect.top &&
					y <= rect.bottom;
				highlight(isInside);
			}
		}
	}

	/**
	 * Clear all active highlights across all dropzones.
	 * Called when drag operation ends or leaves the window.
	 */
	clearHighlights() {
		for (const { highlight } of this.zones.values()) {
			if (highlight) highlight(false);
		}
	}
}

/**
 * Global singleton instance of the dropzone registry.
 * Import and use this instance throughout your application.
 */
export const dropzoneRegistry = new DropzoneRegistry();
