export class DropzoneRegistry {
    constructor() {
        this.zones = new Map();
    }
    register(id, ref, onDrop, highlight) {
        this.zones.set(id, { ref, onDrop, highlight });
    }
    unregister(id) {
        this.zones.delete(id);
    }
    handleDrop(x, y, filePaths) {
        for (const { ref, onDrop } of this.zones.values()) {
            const el = ref.current;
            if (el) {
                const rect = el.getBoundingClientRect();
                if (x >= rect.left &&
                    x <= rect.right &&
                    y >= rect.top &&
                    y <= rect.bottom) {
                    onDrop(filePaths);
                    break;
                }
            }
        }
    }
    highlightDropzone(x, y) {
        for (const { ref, highlight } of this.zones.values()) {
            const el = ref.current;
            if (el && highlight) {
                const rect = el.getBoundingClientRect();
                const isInside = x >= rect.left &&
                    x <= rect.right &&
                    y >= rect.top &&
                    y <= rect.bottom;
                highlight(isInside);
            }
        }
    }
    clearHighlights() {
        for (const { highlight } of this.zones.values()) {
            if (highlight)
                highlight(false);
        }
    }
}
export const dropzoneRegistry = new DropzoneRegistry();
