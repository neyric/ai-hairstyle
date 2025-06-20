import clsx from "clsx";
import React, { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";

type PossibleRef<T> = React.Ref<T> | undefined;
type RefCleanup<T> = ReturnType<React.RefCallback<T>>;

function assignRef<T>(ref: PossibleRef<T>, value: T): RefCleanup<T> {
  if (typeof ref === "function") {
    return ref(value);
  } else if (typeof ref === "object" && ref !== null && "current" in ref) {
    ref.current = value;
  }
}

export interface DropzoneFile {
  file: File;
  validType: boolean;
  validSize: boolean;
}
export interface DropzoneProps {
  multiple?: boolean;
  disabled?: boolean;
  onFilesAccepted: (files: DropzoneFile[]) => void;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  openRef?: React.ForwardedRef<() => void | undefined>;
}

export const Dropzone = ({
  disabled,
  openRef,
  multiple = true,
  onFilesAccepted,
  maxFileSize = 100, // Default max 100mb file size
  acceptedFileTypes = ["image/jpeg", "image/png", "image/webp"],
  children,
}: React.PropsWithChildren<DropzoneProps>) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFiles = (fileList: FileList) => {
    if (disabled) return;
    const list = Array.from(fileList).slice(0, multiple ? fileList.length : 1);

    const filesArray = list.map<DropzoneFile>((file) => {
      const validType =
        acceptedFileTypes.length === 0 || acceptedFileTypes.includes(file.type);
      const validSize = file.size <= maxFileSize * 1024 * 1024;

      return { file, validSize, validType };
    });

    if (filesArray.length > 0) {
      onFilesAccepted(filesArray);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click();
    }
  };

  assignRef(openRef, openFileDialog);

  const acceptString = acceptedFileTypes.join(",");

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept={acceptString}
        multiple={multiple}
        className="hidden"
      />

      <div
        className={clsx(
          "cursor-pointer transition-colors duration-200",
          "card bg-base-100 card-border border-base-300 card-sm",
          "data-[dragging=true]:bg-base-300"
        )}
        data-dragging={isDragging}
        onClick={openFileDialog}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="card-body items-center justify-center max-sm:py-6 py-8">
          {children}
        </div>
      </div>
    </>
  );
};
