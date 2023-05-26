'use client'

import { ChangeEvent, useState } from 'react'

export default function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null)

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files) {
      return
    }

    const previewURL = URL.createObjectURL(files[0])

    setPreview(previewURL)
  }

  return (
    <>
      <input
        onChange={onFileSelected}
        type="file"
        name="cover"
        id="cover"
        accept="image/*"
        className="invisible h-0 w-0"
      />

      {preview && (
        // eslint is disabled because the next image is not needed in this implementation
        // eslint-disable-next-line
        <img
          src={preview}
          alt=""
          className="aspect-video w-full rounded-lg object-cover"
        />
      )}
    </>
  )
}
