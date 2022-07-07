import { useControls } from "leva";
import * as React from "react";
import * as THREE from "three";
import { HeightGenerator } from "../../lib/generators/HeightGenerator";
import Noise from "../../lib/noise/Noise";

export const DEFAULT_HEIGHT_PARAMS = {
  minRadius: 100_000,
  maxRadius: 100_000 + 1,
};

export const useHeightController = (noise: Noise) => {
  const controllerValues = useControls(
    "height generator",
    // @ts-ignore
    {
      ...DEFAULT_HEIGHT_PARAMS,
      offset: {
        value: {
          x: 0,
          y: 0,
          z: 0,
        },
      },
    }
  );

  const heightGenerator = React.useMemo(
    () =>
      new HeightGenerator({
        ...controllerValues,
        offset: new THREE.Vector3(
          controllerValues.offset.x,
          controllerValues.offset.y,
          controllerValues.offset.z
        ),
        generator: noise,
      }),
    [controllerValues, noise]
  );

  return { heightGenerator, heightParams: controllerValues };
};