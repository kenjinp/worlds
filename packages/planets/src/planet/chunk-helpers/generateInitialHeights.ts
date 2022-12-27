import { Vector3 } from "three"
import {
  ChunkGeneratorProps,
  ColorGenerator,
  HeightGenerator,
} from "../../chunk/types"
import { tempColor } from "../../utils"

const _D = new Vector3()

const _P = new Vector3()

const _H = new Vector3()
const _W = new Vector3()
// const _S = new Vector3()
const _C = new Vector3()

const colorInputVector = new Vector3()

export interface GenerateInitialHeightsProps<D> extends ChunkGeneratorProps<D> {
  heightGenerator: HeightGenerator<D>
  colorGenerator?: ColorGenerator<D>
}

;<T>(x: T) => x

export const generateInitialHeights = <D>(
  params: GenerateInitialHeightsProps<D>,
) => {
  const {
    // resolution,
    radius,
    worldMatrix,
    offset,
    width,
    origin,
    data,
    inverted,
    heightGenerator,
    colorGenerator,
  } = params

  const localToWorld = worldMatrix
  const half = width / 2
  const resolution = params.resolution + 2
  const effectiveResolution = resolution - 2

  const positions = []
  const colors = []
  const coords = []
  const up = []

  for (let x = -1; x <= effectiveResolution + 1; x++) {
    const xp = (width * x) / effectiveResolution
    for (let y = -1; y <= effectiveResolution + 1; y++) {
      const yp = (width * y) / effectiveResolution

      _P.set(xp - half, yp - half, radius)
      _P.add(offset)
      _P.normalize()
      _D.copy(_P)
      _P.multiplyScalar(radius)
      _P.z -= radius

      // Compute a world space position to sample noise
      _W.copy(_P)
      _W.applyMatrix4(localToWorld)

      // Compute position
      // _P.set(xp - half, yp - half, radius)
      // _P.add(offset)
      // _P.normalize()
      // _D.copy(_P)
      // _D.transformDirection(localToWorld)

      // _P.multiplyScalar(radius)
      // _P.z -= radius

      // // Keep the absolute world space position to sample noise
      // _W.copy(_P)
      // _W.applyMatrix4(localToWorld)

      // Move the position relative to the origin
      // _P.sub(origin)

      // Purturb height along z-vector
      const heightInput = _W.clone()
      const height = heightGenerator({
        input: heightInput,
        worldPosition: heightInput,
        radius,
        offset,
        width,
        worldMatrix,
        resolution,
        origin,
        inverted,
        data,
      })
      const color = colorGenerator
        ? colorGenerator({
            input: colorInputVector.set(_W.x, _W.y, height).clone(),
            worldPosition: _W.clone(),
            radius,
            offset,
            width,
            worldMatrix: params.worldMatrix,
            resolution,
            inverted: params.inverted,
            origin: params.origin,
            height,
            data: params.data,
          })
        : tempColor.set(0xffffff).clone()

      // color has alpha from array
      if ("length" in color) {
        colors.push(...color)
      } else {
        colors.push(color.r, color.g, color.b, 1)
      }

      _H.copy(_D)
      _H.multiplyScalar(height * (params.inverted ? -1 : 1))
      _P.add(_H)

      positions.push(_P.x, _P.y, _P.z)

      _C.copy(_W)
      _C.add(_H)
      coords.push(_C.x, _C.y, _C.z)

      // _S.set(_W.x, _W.y, height)

      up.push(_D.x, _D.y, _D.z)
    }
  }

  return {
    positions,
    colors,
    coords,
    up,
  }
}
