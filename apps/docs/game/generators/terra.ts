import {
  ChunkGenerator3Initializer,
  ColorGeneratorInitializer,
  Lerp,
  LinearSpline,
  Noise,
  remap,
} from "@hello-worlds/planets"
import { Color } from "three"
import { ThreadParams } from "../WorldBuilder.worker"

export const heightGenerator: ChunkGenerator3Initializer<
  ThreadParams,
  number
> = ({ data: { seed, type }, radius }) => {
  const mountains = new Noise({
    seed: "blip",
    height: 20_000,
    scale: radius / 75,
  })

  const noise = new Noise({
    seed: "blarp",
    height: 10_000,
    scale: radius / 3,
  })

  const warp = new Noise({
    octaves: 8,
    seed: "apple", // <-important
    height: 10000.0,
    scale: radius / 2,
  })

  const mask = new Noise({
    seed: "mask",
    height: 10_000,
    scale: radius,
  })

  const maskh = new Noise({
    octaves: 1,
    seed: "mask",
    height: 1,
    scale: radius,
  })

  return ({ input }) => {
    const w = warp.get(input.x, input.y, input.z)
    const m = mountains.get(input.x + w, input.y + w, input.z + w)
    const n = noise.get(input.x + w, input.y + w, input.z + w)
    const msk = mask.get(input.x + w, input.y + w, input.z + w)
    const mskh = maskh.get(input.x + w, input.y + w, input.z + w)
    return msk + (n + m) * mskh * (n / 100)
  }
}

const oceanColor = new Color(0x2b65ec)

const colorLerp: Lerp<THREE.Color> = (
  t: number,
  p0: THREE.Color,
  p1: THREE.Color,
) => {
  const c = p0.clone()
  return c.lerp(p1, t)
}

const colorSpline = new LinearSpline<THREE.Color>(colorLerp)
const white = new Color(0xffffff)

// Temp / Aridity
colorSpline.addPoint(0.0, new Color(0x37a726))
colorSpline.addPoint(0.05, new Color(0x214711))
colorSpline.addPoint(0.4, new Color(0x526b48))
colorSpline.addPoint(0.9, new Color(0xab7916))
colorSpline.addPoint(1.0, new Color(0xbab3a2))
export const colorGenerator: ColorGeneratorInitializer<ThreadParams> = ({
  radius,
}) => {
  const warp = new Noise({
    octaves: 8,
    seed: "apple", // <-important
    height: 10000.0,
    scale: radius / 2,
  })

  return ({ height, input }) => {
    const warpedHeight = height + warp.getFromVector(input)
    // return white
    return warpedHeight > 0
      ? colorSpline.get(remap(height, 0, 5_000, 0, 1))
      : oceanColor
  }
}