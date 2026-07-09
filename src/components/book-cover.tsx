'use client'

import { useState } from 'react'
import Image from 'next/image'
import { publicUploadUrl } from '@utils/public-url'

export default function BookCover({
  coverImage,
  title,
  className,
}: {
  coverImage: string | null
  title: string
  className?: string
}) {
  const [hasError, setHasError] = useState(false)
  const src = publicUploadUrl(coverImage)
  const showFallback = !src || hasError

  return (
    <div className={`relative w-full h-full bg-slate-100 dark:bg-slate-700 ${className ?? ''}`}>
      <div className="absolute inset-3 rounded overflow-hidden">
        <Image
          src={showFallback ? '/images/no-cover.png' : src}
          alt={showFallback ? 'Không có ảnh bìa' : title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
          onError={() => setHasError(true)}
        />
      </div>
    </div>
  )
}