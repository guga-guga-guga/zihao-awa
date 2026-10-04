import { useEffect, useMemo, useState } from 'react'

const collectImages = (projects) => {
  const seen = new Set()
  const list = []

  projects.forEach((project) => {
    const images = project.media?.length
      ? project.media.flatMap((item) => {
          if (item.type === 'image') return [item.src]
          if (item.type === 'video' && item.poster) return [item.poster]
          return []
        })
      : project.images?.length
        ? project.images
        : [project.image]
    images.forEach((src) => {
      if (!src || seen.has(src)) return
      seen.add(src)
      list.push(src)
    })
    if (project.poster && !seen.has(project.poster)) {
      seen.add(project.poster)
      list.push(project.poster)
    }
  })

  return list
}

export default function useArchivePreload(projects, enabled) {
  const images = useMemo(() => collectImages(projects), [projects])
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!enabled) return undefined

    if (images.length === 0) {
      setProgress(1)
      setDone(true)
      return undefined
    }

    let cancelled = false
    let loaded = 0

    setProgress(0)
    setDone(false)

    const markLoaded = () => {
      if (cancelled) return
      loaded += 1
      setProgress(loaded / images.length)
      if (loaded >= images.length) setDone(true)
    }

    images.forEach((src) => {
      const image = new Image()
      const webp = src.replace(/\.png$/, '.webp')

      image.onload = markLoaded
      image.onerror = () => {
        const fallback = new Image()
        fallback.onload = markLoaded
        fallback.onerror = markLoaded
        fallback.src = src
      }

      image.src = webp
    })

    return () => {
      cancelled = true
    }
  }, [images, enabled])

  return { progress, done }
}