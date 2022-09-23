import { PlanetProps } from "@hello-worlds/planets";
import { Tag } from "miniplex";
import { createECS } from "miniplex-react";
import { makeStore } from "statery";
import { Color, Mesh, Vector3 } from "three";


export enum THEMES {
  SCI_FANTASY = "sci-fantasy",
  HARD_SCIFI = "hard-scifi",
  SYNTHWAVE = "synthwave"
}

export type Theme = {
  theme: THEMES
}


export const store = makeStore({ 
  theme: THEMES.SCI_FANTASY,
  screenshotMode: false,
  showPlanetLabels: true
})


export type AstralBody =  {
  position: Vector3;
  rotationSpeed: number;
  children: Entity[];
  offset: Vector3;
  name?: string;
  labelColor?: Color;
} & Partial<PlanetProps>

export type Star = AstralBody & {
  color: Color,
  emissive: Color,
  lightIntensity: number,
  mesh?: Mesh;
  star: Tag;
}

export enum PlANET_TYPES {
  TERRAN = "TERRAN",
  DWARF = "DWARF",
  LUNAR = "LUNAR",
  AREAN = "AREAN",
  VULCAN = "VULCAN"
}

export type Planet = AstralBody & {
  planet: Tag;
  seed: string;
  mesh?: Mesh;
  focused?: boolean;
  type: PlANET_TYPES
}

export type Explorer = {
  explorer: Tag;
  position: Vector3;
  lastUpdateMeta: {
    positions: {
      time: number,
      position: Vector3
    }[];
  };
  connectionId: number;
  mesh?: Mesh;
}

type Entity = Star | Planet | Explorer | Theme;

export const ECS = createECS<Entity>();