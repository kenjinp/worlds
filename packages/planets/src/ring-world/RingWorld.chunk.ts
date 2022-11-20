import { Matrix4, Vector3 } from "three"
import { BuildChunkInitialParams, ChunkGeneratorProps } from "../chunk/types"
import { tempColor, tempVector3 } from "../utils"

export function buildRingWorldChunk<D>(
  initialParams: BuildChunkInitialParams<D>,
) {
  const colorInputVector = new Vector3()
  const _D = new Vector3()
  const _D1 = new Vector3()
  const _D2 = new Vector3()
  const _P = new Vector3()
  const _H = new Vector3()
  const _W = new Vector3()

  const _N = new Vector3()
  const _N1 = new Vector3()
  const _N2 = new Vector3()
  const _N3 = new Vector3()
  const { heightGenerator, colorGenerator } = initialParams

  return function runBuildChunk(
    params: ChunkGeneratorProps<D> & { height: number },
  ) {
    const positions = []
    const colors = []
    const normals = []
    const tangents = []
    const uvs = []
    const indices: number[] = []

    const localToWorld = new Matrix4().fromArray(params.worldMatrix.elements)
    const worldToLocal = localToWorld.clone().invert()

    const resolution = params.resolution
    const radius = params.radius
    const offset = params.offset
    const width = params.width
    const origin = new Vector3(
      params.origin.x,
      params.origin.y,
      params.origin.z,
    )
    const height = params.height
    const halfW = width / 2
    const halfH = height / 2

    for (let x = 0; x < resolution + 1; x++) {
      const xp = (width * x) / resolution
      for (let y = 0; y < resolution + 1; y++) {
        const yp = (height * y) / resolution

        // Compute position
        _P.set(xp - halfW, yp - halfH, radius)
        _P.add(offset)

        // bend cube into cylinder
        const cylinderLength = Math.sqrt(_P.x * _P.x + _P.z * _P.z)
        // this is esentially normalizing the vector, but without the y component
        _P.divide(tempVector3.set(cylinderLength, 1, cylinderLength))

        // for height offset later
        _D.copy(_P.clone())

        // push out the points across the circle at radius
        _P.multiply(tempVector3.set(radius, 1, radius))

        _P.z -= radius

        _W.copy(_P)
        _W.applyMatrix4(localToWorld)
        const heightInput = _W.clone()
        const terrainHeightOffset = heightGenerator({
          input: heightInput,
          worldPosition: heightInput,
          radius,
          offset,
          width,
          worldMatrix: params.worldMatrix,
          resolution,
          inverted: params.inverted,
          origin: params.origin,
          data: params.data,
        })
        const color = colorGenerator
          ? colorGenerator({
              input: colorInputVector
                .set(_W.x, _W.y, terrainHeightOffset)
                .clone(),
              worldPosition: _W.clone(),
              radius,
              offset,
              width,
              worldMatrix: params.worldMatrix,
              resolution,
              inverted: params.inverted,
              height: terrainHeightOffset,
              origin: params.origin,
              data: params.data,
            })
          : tempColor.set(0xffffff).clone()

        // Perturb height along the "normal", sticking out from the cylinder surface
        const signedTerrainHeightOffset =
          terrainHeightOffset * (params.inverted ? -1 : 1)
        _H.copy(_D)
        _H.multiply(
          tempVector3.set(
            signedTerrainHeightOffset,
            1,
            signedTerrainHeightOffset,
          ),
        )
        _P.setX(_H.x + _P.x)
        _P.setZ(_H.z + _P.z)

        // color has alpha from array
        if ("length" in color) {
          colors.push(...color)
        } else {
          colors.push(color.r, color.g, color.b, 1)
        }
        positions.push(_P.x, _P.y, _P.z)
        normals.push(0, 0, 0)
        tangents.push(1, 0, 0, 1)
        uvs.push(_P.x / 200.0, _P.y / 200.0)
      }
    }

    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution; j++) {
        indices.push(
          i * (resolution + 1) + j,
          (i + 1) * (resolution + 1) + j + 1,
          i * (resolution + 1) + j + 1,
        )
        indices.push(
          (i + 1) * (resolution + 1) + j,
          (i + 1) * (resolution + 1) + j + 1,
          i * (resolution + 1) + j,
        )
      }
    }

    for (let i = 0, n = indices.length; i < n; i += 3) {
      const i1 = indices[i] * 3
      const i2 = indices[i + 1] * 3
      const i3 = indices[i + 2] * 3

      _N1.fromArray(positions, i1)
      _N2.fromArray(positions, i2)
      _N3.fromArray(positions, i3)

      _D1.subVectors(_N3, _N2)
      _D2.subVectors(_N1, _N2)
      _D1.cross(_D2)

      normals[i1] += _D1.x
      normals[i2] += _D1.x
      normals[i3] += _D1.x

      normals[i1 + 1] += _D1.y
      normals[i2 + 1] += _D1.y
      normals[i3 + 1] += _D1.y

      normals[i1 + 2] += _D1.z
      normals[i2 + 2] += _D1.z
      normals[i3 + 2] += _D1.z
    }

    for (let i = 0, n = normals.length; i < n; i += 3) {
      _N.fromArray(normals, i)
      _N.normalize()
      normals[i] = _N.x
      normals[i + 1] = _N.y
      normals[i + 2] = _N.z
    }

    function _Unindex(src: number[], stride: number) {
      const dst = []
      for (let i = 0, n = indices.length; i < n; i += 3) {
        const i1 = indices[i] * stride
        const i2 = indices[i + 1] * stride
        const i3 = indices[i + 2] * stride

        for (let j = 0; j < stride; j++) {
          dst.push(src[i1 + j])
        }
        for (let j = 0; j < stride; j++) {
          dst.push(src[i2 + j])
        }
        for (let j = 0; j < stride; j++) {
          dst.push(src[i3 + j])
        }
      }
      return dst
    }

    const uiPositions = _Unindex(positions, 3)
    const uiColors = _Unindex(colors, 4)
    const uiNormals = _Unindex(normals, 3)
    const uiTangents = _Unindex(tangents, 4)
    const uiUVs = _Unindex(uvs, 2)

    const bytesInFloat32 = 4
    const positionsArray = new Float32Array(
      new SharedArrayBuffer(bytesInFloat32 * uiPositions.length),
    )
    const colorsArray = new Float32Array(
      new SharedArrayBuffer(bytesInFloat32 * uiColors.length),
    )
    const normalsArray = new Float32Array(
      new SharedArrayBuffer(bytesInFloat32 * uiNormals.length),
    )
    const tangentsArray = new Float32Array(
      new SharedArrayBuffer(bytesInFloat32 * uiTangents.length),
    )
    const uvsArray = new Float32Array(
      new SharedArrayBuffer(bytesInFloat32 * uiUVs.length),
    )

    positionsArray.set(uiPositions, 0)
    colorsArray.set(uiColors, 0)
    normalsArray.set(uiNormals, 0)
    uvsArray.set(uiUVs, 0)

    return {
      positions: positionsArray,
      colors: colorsArray,
      uvs: uvsArray,
      normals: normalsArray,
      tangents: tangentsArray,
    }
  }
}
