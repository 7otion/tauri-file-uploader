A lightweight, unstyled file uploader component library for React + Tauri applications.

## ✨ Key Features

- **🎨 Completely Unstyled**: No CSS dependencies, no enforced styling
- **🔧 Customizable**: Inject your own button components and styles
- **📦 Lightweight**: Minimal dependencies (only lucide-react for icons)
- **🔒 Type-Safe**: Full TypeScript support
- **🎯 Tauri Native**: Uses Tauri's fs plugin for file operations

# Usage Example

## Installation

```bash
bun add https://github.com/7otion/tauri-file-uploader
```

Make sure you have the required Tauri plugins installed:

```bash
bun run tauri add dialog
bun run tauri add fs
```

## Basic Setup

### 1. Add the Event Listener (Required)

In your app's root component (e.g., `App.tsx`), add the `DropzoneEventListener`:

```tsx
import { DropzoneEventListener } from '@7otion/tauri-file-uploader';

function App() {
  return (
    <>
      <DropzoneEventListener />
      {/* Your app components */}
    </>
  );
}
```

### 2. Using FileDropzone

```tsx
import { useState, useEffect } from 'react';
import { FileDropzone, getFileDetails, type IFile } from '@7otion/tauri-file-uploader';

// Optional: Your custom button component
const MyButton = ({ children, onClick, variant, ...props }) => (
  <button 
    onClick={onClick}
    className={`btn btn-${variant}`}
    {...props}
  >
    {children}
  </button>
);

function MyComponent() {
  const [files, setFiles] = useState<IFile[]>([]);

  const handleFilesChange = async (id: string, filePaths: string[]) => {
    // Convert file paths to IFile objects
    const fileDetails = await Promise.all(
      filePaths.map(path => getFileDetails(path))
    );
    setFiles(fileDetails);
  };

  return (
    <FileDropzone
      id="my-dropzone"
      files={files}
      handleFilesStateChange={handleFilesChange}
      filters={[
        { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp'] }
      ]}
      ButtonComponent={MyButton}  // Optional: use your own button
      containerClassName="custom-dropzone"  // Optional: add custom classes
      hoveredClassName="dropzone-hover"  // Optional: hover state class
    />
  );
}
```

### 3. Using NativeFileInput

```tsx
import { useState } from 'react';
import { NativeFileInput, type IFile } from '@7otion/tauri-file-uploader';

function MyForm() {
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);

  const handleFileSelect = async (file: IFile) => {
    setSelectedFile(file);
    return true;  // Return true to accept the file
  };

  return (
    <NativeFileInput
      dialogTitle="Select Profile Picture"
      extensionFilter={['png', 'jpg']}
      onFileChange={handleFileSelect}
      ButtonComponent={MyButton}  // Optional
      buttonVariant="outline"
    />
  );
}
```

## Styling

This library is completely unstyled by default. You have several options for styling:

### Option 1: Use inline styles (default)
The components come with minimal inline styles. You can override them with CSS classes.

### Option 2: Use CSS classes
Pass className props to customize appearance:

```tsx
<FileDropzone
  containerClassName="w-full max-w-2xl mx-auto"
  hoveredClassName="bg-blue-50 border-blue-500"
  fileGridClassName="grid grid-cols-4 gap-4"
  fileCardClassName="rounded-lg shadow-md"
/>
```

### Option 3: Use custom button component
Inject your own button component from your UI library:

```tsx
import { Button } from '@/components/ui/button';  // shadcn/ui

<FileDropzone
  ButtonComponent={Button}
  // ...
/>
```

## TypeScript Support

All exports are fully typed:

```typescript
import type {
  IFile,
  FileType,
  ButtonComponentProps,
  NativeFileInputProps,
  DropzoneCallback,
  DropzoneEntry
} from '@7otion/tauri-file-uploader';
```

## Advanced: Direct File Details

If you need file details without the UI components:

```tsx
import { getFileDetails } from '@7otion/tauri-file-uploader';

const fileInfo = await getFileDetails('/path/to/file.jpg');
console.log(fileInfo.name, fileInfo.size, fileInfo.mime);
```

## Permissions

Don't forget to configure Tauri permissions in your `capabilities` file:

```json
{
  "permissions": [
    "dialog:default",
    "fs:default",
    {
      "identifier": "fs:allow-stat",
      "allow": [{ "path": "**" }]
    }
  ]
}
```
