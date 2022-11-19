import {
  ChunkGenerator3Initializer,
  ColorArrayWithAlpha,
  createThreadedPlanetWorker,
} from "@hello-worlds/planets"
import { Color } from "three"
import { match } from "ts-pattern"
import { cloud, dwarf, ocean, simple, strange, terra } from "./generators"
import { PlANET_TYPES } from "./WorldBuilder.state"

export type ThreadParams = {
  seed: string
  type: PlANET_TYPES
  seaLevel?: number
}

const heightGenerator: ChunkGenerator3Initializer<
  ThreadParams,
  number
> = props => {
  const {
    data: { type },
  } = props
  const generator = match(type)
    .with(PlANET_TYPES.TERRAN, () => terra.heightGenerator)
    .with(PlANET_TYPES.DWARF, () => dwarf.heightGenerator)
    .with(PlANET_TYPES.CLOUD, () => cloud.heightGenerator)
    .with(PlANET_TYPES.OCEAN, () => ocean.heightGenerator)
    .with(PlANET_TYPES.STRANGE, () => strange.heightGenerator)
    .otherwise(() => simple.heightGenerator)
  return generator(props)
}

const colorGenerator: ChunkGenerator3Initializer<
  ThreadParams,
  Color | ColorArrayWithAlpha
> = props => {
  const {
    data: { type },
  } = props
  const generator = match(type)
    .with(PlANET_TYPES.TERRAN, () => terra.colorGenerator)
    .with(PlANET_TYPES.DWARF, () => dwarf.colorGenerator)
    .with(PlANET_TYPES.CLOUD, () => cloud.colorGenerator)
    .with(PlANET_TYPES.OCEAN, () => ocean.colorGenerator)
    .with(PlANET_TYPES.STRANGE, () => strange.colorGenerator)
    .otherwise(() => simple.colorGenerator)
  return generator(props)
}

createThreadedPlanetWorker<ThreadParams>({
  heightGenerator,
  colorGenerator,
})
