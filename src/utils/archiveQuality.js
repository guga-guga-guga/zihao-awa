const getDeviceTier = () => {
  if (typeof window === 'undefined') return 'medium'

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const cores = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4

  if (reduced || coarse || cores <= 4 || memory <= 4) return 'low'
  if (cores >= 8 && memory >= 8) return 'high'
  return 'medium'
}

export function getArchiveQuality() {
  const tier = getDeviceTier()
  const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1

  if (tier === 'high') {
    return {
      tier,
      cols: 4,
      rows: 64,
      pixelRatio: Math.min(dpr, 1.5),
      frameInterval: 1000 / 45,
      instanceInterval: 28,
      antialias: false,
    }
  }

  if (tier === 'low') {
    return {
      tier,
      cols: 4,
      rows: 56,
      pixelRatio: 1,
      frameInterval: 1000 / 30,
      instanceInterval: 40,
      antialias: false,
    }
  }

  return {
    tier,
    cols: 4,
    rows: 64,
    pixelRatio: Math.min(dpr, 1.25),
    frameInterval: 1000 / 40,
    instanceInterval: 32,
    antialias: false,
  }
}