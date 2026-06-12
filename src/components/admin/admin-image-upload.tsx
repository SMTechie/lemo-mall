"use client";

import { DragEvent, useRef, useState } from "react";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type StoredImage = {
  id: string;
  url: string;
  filename: string;
};

export function AdminImageUpload({
  name,
  initialImages = [],
  multiple = false
}: {
  name: string;
  initialImages?: string[];
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<StoredImage[]>(
    initialImages.map((url, index) => ({ id: `${index}-${url}`, url, filename: `Image ${index + 1}` }))
  );
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;

    const body = new FormData();
    for (const file of files) body.append("files", file);

    setUploading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/images", {
        method: "POST",
        body
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Image upload failed.");
        return;
      }

      const uploaded = data.images as StoredImage[];
      setImages((current) => (multiple ? [...current, ...uploaded] : uploaded.slice(0, 1)));
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void uploadFiles(event.dataTransfer.files);
  }

  const formValues = multiple ? images : images.slice(0, 1);

  return (
    <div className="grid gap-3">
      {formValues.map((image) => (
        <input key={image.id} type="hidden" name={name} value={image.url} />
      ))}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        multiple={multiple}
        className="hidden"
        onChange={(event) => {
          if (event.target.files) void uploadFiles(event.target.files);
        }}
      />
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`grid min-h-36 place-items-center rounded-md border border-dashed p-4 text-center transition-colors ${
          dragging ? "border-primary bg-primary/10" : "bg-muted/30"
        }`}
      >
        <div className="grid justify-items-center gap-3">
          {uploading ? <Loader2 className="h-7 w-7 animate-spin text-primary" /> : <Upload className="h-7 w-7 text-primary" />}
          <div>
            <p className="text-sm font-medium">{multiple ? "Drop product images here" : "Drop image here"}</p>
            <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP, GIF or AVIF. Max 5MB each.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
            <ImageIcon className="h-4 w-4" />
            {multiple ? "Choose images" : "Choose image"}
          </Button>
        </div>
      </div>

      {images.length ? (
        <div className="grid gap-2 sm:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="relative overflow-hidden rounded-md border bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt="" className="aspect-[4/3] w-full object-cover" />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={() => setImages((current) => current.filter((entry) => entry.id !== image.id))}
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
