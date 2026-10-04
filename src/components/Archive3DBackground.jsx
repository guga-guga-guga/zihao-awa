import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { getArchiveQuality } from '../utils/archiveQuality'

const MODEL_URL = 'assets/archive-cassette.glb'
const CAMERA_FOV = 4
const CAMERA_DISTANCE = 120
const CAMERA_YAW = THREE.MathUtils.degToRad(59)
const CAMERA_ELEVATION = THREE.MathUtils.degToRad(19)

export default function Archive3DBackground({ className = '' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const quality = getArchiveQuality()
    const COLS = quality.cols
    const ROWS = quality.rows
    const FRAME_INTERVAL = quality.frameInterval
    const INSTANCE_INTERVAL = quality.instanceInterval

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: quality.antialias,
      precision: 'mediump',
      powerPreference: 'low-power',
    })
    renderer.setPixelRatio(quality.pixelRatio)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.setClearColor(0x000000, 0)

    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(
      0x050607,
      CAMERA_DISTANCE - 12,
      CAMERA_DISTANCE + 90,
    )

    const cameraAim = new THREE.Vector3(8, 0.6, -4)
    const cameraDirection = new THREE.Vector3(
      -Math.sin(CAMERA_YAW) * Math.cos(CAMERA_ELEVATION),
      Math.sin(CAMERA_ELEVATION),
      Math.cos(CAMERA_YAW) * Math.cos(CAMERA_ELEVATION),
    )
    const cameraAnchor = cameraAim
      .clone()
      .addScaledVector(cameraDirection, CAMERA_DISTANCE)

    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 400)
    camera.position.copy(cameraAnchor)
    camera.lookAt(cameraAim)

    scene.add(new THREE.AmbientLight(0x3a3f55, 1.15))

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.55)
    keyLight.position.set(7, 14, 8)
    scene.add(keyLight)

    const cyanLight = new THREE.PointLight(0x6ee7ff, 2.35, 95, 2)
    cyanLight.position.set(-18, 8, -6)
    scene.add(cyanLight)

    const violetLight = new THREE.PointLight(0xa78bfa, 1.9, 95, 2)
    violetLight.position.set(20, 7, 4)
    scene.add(violetLight)

    const grid = new THREE.GridHelper(280, 140, 0x6ee7ff, 0x1f2a33)
    grid.material.transparent = true
    grid.material.opacity = 0.08
    grid.position.y = -0.02
    scene.add(grid)

    let disposed = false
    let group = null
    let instancedMeshes = []
    let sharedInstanceMatrix = null
    let layoutSpacing = { x: 5.1, z: 0.42 }
    let animationId = 0
    let startTime = performance.now()
    let lastFrame = 0
    let lastInstanceUpdate = 0
    let isVisible = false
    let isPageVisible = !document.hidden
    const mouse = { x: 0, y: 0 }
    const targetMouse = { x: 0, y: 0 }
    const dummy = new THREE.Object3D()

    const setSize = () => {
      const rect = container.getBoundingClientRect()
      const width = Math.max(1, Math.floor(rect.width))
      const height = Math.max(1, Math.floor(rect.height))
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    const buildInstances = (gltf) => {
      const model = gltf.scene
      model.updateMatrixWorld(true)

      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const minY = box.min.y
      const count = COLS * ROWS

      const spacingX = size.x * 1.04
      const spacingZ = Math.max(size.z * 1.55, 0.3)
      layoutSpacing = { x: spacingX, z: spacingZ }

      const meshes = []
      model.traverse((object) => {
        if (object.isMesh) meshes.push(object)
      })

      group = new THREE.Group()
      group.userData.spacingX = spacingX
      group.userData.spacingZ = spacingZ

      const sharedMatrix = new THREE.InstancedBufferAttribute(
        new Float32Array(count * 16),
        16,
      )
      sharedMatrix.setUsage(THREE.DynamicDrawUsage)
      sharedInstanceMatrix = sharedMatrix

      meshes.forEach((mesh) => {
        const geometry = mesh.geometry.clone().applyMatrix4(mesh.matrixWorld)
        geometry.translate(-center.x, -minY, -center.z)

        const baseMaterial = mesh.material
        const material = Array.isArray(baseMaterial)
          ? baseMaterial.map((item) => item.clone())
          : baseMaterial.clone()

        const tintMaterial = (mat) => {
          if (!mat) return
          if (mat.color) mat.color.lerp(new THREE.Color('#0b1016'), 0.34)
          if (mat.emissive) mat.emissive.lerp(new THREE.Color('#0a1b24'), 0.5)
          if (typeof mat.roughness === 'number') {
            mat.roughness = Math.min(1, mat.roughness * 1.08)
          }
          if (typeof mat.metalness === 'number') {
            mat.metalness = Math.min(0.85, mat.metalness + 0.12)
          }
          mat.envMapIntensity = 0.75
        }

        if (Array.isArray(material)) material.forEach(tintMaterial)
        else tintMaterial(material)

        const instance = new THREE.InstancedMesh(geometry, material, count)
        instance.instanceMatrix = sharedMatrix
        instance.castShadow = false
        instance.receiveShadow = false
        instance.frustumCulled = false
        instancedMeshes.push(instance)
        group.add(instance)
      })

      scene.add(group)
    }

    const updateInstances = (time) => {
      if (!instancedMeshes.length) return

      const matrixArray = sharedInstanceMatrix?.array
      const spacingX = group?.userData.spacingX ?? layoutSpacing.x
      const spacingZ = group?.userData.spacingZ ?? layoutSpacing.z
      const focusCol = (COLS - 1) * 0.42
      const focusRow = (ROWS - 1) * 0.38
      const breath = 1 + Math.sin(time * 0.55) * 0.08

      let index = 0
      for (let row = 0; row < ROWS; row += 1) {
        for (let col = 0; col < COLS; col += 1) {
          const x = (col - (COLS - 1) / 2) * spacingX
          const z = (row - (ROWS - 1) / 2) * spacingZ + spacingZ * 8

          const dx = (col - focusCol) / 3.4
          const dz = (row - focusRow) / 6.0
          const distance = Math.sqrt(dx * dx + dz * dz)
          const bump = Math.max(0, 1 - distance)
          const plate = bump * bump * (3 - 2 * bump)
          const lift = plate * 1.85 * breath

          const primary = reduced
            ? 0
            : Math.sin(time * 0.55 + col * 0.52 + row * 0.28) * 0.04
          const travel = reduced
            ? 0
            : Math.sin(time * 0.38 - row * 0.42 + col * 0.12) * 0.035
          const rowWave = reduced
            ? 0
            : Math.cos(time * 0.24 + row * 0.35) * 0.03
          const sway = reduced
            ? 0
            : Math.sin(time * 0.3 + row * 0.22 + col * 0.12) * 0.015
          const zJitter = reduced
            ? 0
            : Math.sin(time * 0.22 + col * 0.5) * 0.06

          dummy.position.set(x, primary + travel + rowWave + lift, z + zJitter)
          dummy.rotation.set(-plate * 0.025, sway, 0)
          dummy.scale.setScalar(1 + plate * 0.03)
          dummy.updateMatrix()

          if (matrixArray) {
            matrixArray.set(dummy.matrix.elements, index * 16)
          }

          index += 1
        }
      }

      if (sharedInstanceMatrix) {
        sharedInstanceMatrix.needsUpdate = true
      }
    }

    const render = () => {
      if (disposed) return

      if (!isVisible || !isPageVisible) {
        animationId = 0
        return
      }

      const now = performance.now()
      if (now - lastFrame < FRAME_INTERVAL) {
        animationId = requestAnimationFrame(render)
        return
      }
      lastFrame = now

      const elapsed = (now - startTime) / 1000
      mouse.x += (targetMouse.x - mouse.x) * 0.05
      mouse.y += (targetMouse.y - mouse.y) * 0.05

      if (reduced) {
        camera.position.copy(cameraAnchor)
      } else {
        camera.position.copy(cameraAnchor)
        camera.position.x += mouse.x * 0.45 + Math.sin(elapsed * 0.045) * 0.35
        camera.position.y += mouse.y * 0.25 + Math.cos(elapsed * 0.05) * 0.2
        camera.position.z += Math.sin(elapsed * 0.04) * 0.45
      }
      camera.lookAt(cameraAim)

      if (group && !reduced) {
        group.position.x = Math.sin(elapsed * 0.055) * 1.0
        group.position.z = Math.cos(elapsed * 0.045) * 0.6
        group.rotation.y = Math.sin(elapsed * 0.032) * 0.008
      } else if (group) {
        group.position.set(0, 0, 0)
        group.rotation.set(0, 0, 0)
      }

      if (now - lastInstanceUpdate > INSTANCE_INTERVAL) {
        updateInstances(elapsed)
        lastInstanceUpdate = now
      }
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(render)
    }

    const start = () => {
      if (animationId === 0 && !disposed) {
        animationId = requestAnimationFrame(render)
      }
    }

    const stop = () => {
      if (animationId !== 0) {
        cancelAnimationFrame(animationId)
        animationId = 0
      }
    }

    const onMouseMove = (event) => {
      const rect = container.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      targetMouse.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      targetMouse.y = ((event.clientY - rect.top) / rect.height - 0.5) * -2
    }

    const onVisibilityChange = () => {
      isPageVisible = !document.hidden
      if (isPageVisible && isVisible) start()
      else stop()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) start()
        else stop()
      },
      { threshold: 0.05 },
    )

    observer.observe(container)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', setSize)
    setSize()

    new GLTFLoader().load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return
        buildInstances(gltf)
        updateInstances(0)
        renderer.render(scene, camera)
        if (isVisible && isPageVisible) start()
      },
      undefined,
      (error) => {
        console.warn('Archive 3D background model failed to load:', error)
      },
    )

    return () => {
      disposed = true
      stop()
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', setSize)

      group?.traverse((object) => {
        if (!object.isInstancedMesh) return
        object.geometry?.dispose()
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material]
        materials.forEach((material) => {
          if (!material) return
          if (material.map) material.map.dispose()
          if (material.normalMap) material.normalMap.dispose()
          if (material.roughnessMap) material.roughnessMap.dispose()
          if (material.metalnessMap) material.metalnessMap.dispose()
          material.dispose()
        })
      })

      grid.geometry.dispose()
      grid.material.dispose()
      renderer.dispose()

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`archive-3d-bg ${className}`.trim()}
      aria-hidden="true"
    />
  )
}