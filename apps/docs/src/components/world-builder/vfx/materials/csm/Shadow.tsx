import { useFrame, useThree } from "@react-three/fiber"
import { usePlanet } from "@site/../../packages/react/dist/esm"
import * as React from "react"
import { PCFSoftShadowMap, PerspectiveCamera, Vector3 } from "three"
import CSM from "three-csm"
import { AU } from "../../../WorldBuilder.math"

export const Shadow: React.FC<
  React.PropsWithChildren<{
    cascades?: number
    shadowMapSize?: number
    normalizedLightDirection?: Vector3
  }>
> = ({
  children,
  cascades = 16,
  shadowMapSize = 2048,
  normalizedLightDirection = new Vector3()
    .subVectors(new Vector3(0, 0, 0), new Vector3(-1, 0, 1).multiplyScalar(AU))
    .normalize(),
}) => {
  const planet = usePlanet()
  const camera = useThree(store => store.camera) as PerspectiveCamera
  const scene = useThree(store => store.scene)
  const gl = useThree(store => store.gl)
  const [csm] = React.useState<CSM>(
    new CSM({
      cascades,
      shadowMapSize,
      lightDirection: normalizedLightDirection,
      camera: camera,
      parent: scene,
      lightFar: camera.far,
      shadowFar: camera.far,
      lightMargin: AU / 1_000,
      lightIntensity: 0.2,
      maxFar: camera.far,
      mode: "logarithmic",
      shadowBias: 0,
    }),
  )
  React.useEffect(() => {
    gl.shadowMap.enabled = true
    gl.shadowMap.type = PCFSoftShadowMap
    if (planet.material) {
      csm.fade = true
      csm.setupMaterial(planet.material)
      for (var i = 0; i < csm.lights.length; i++) {
        csm.lights[i].shadow.camera.far = camera.far
        csm.lights[i].shadow.camera.updateProjectionMatrix()
      }
    }
  }, [planet, csm, gl])

  useFrame(() => {
    csm.update()
  })

  return <>{children}</>
}
