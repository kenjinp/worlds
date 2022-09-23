import * as React from 'react';
import { Mesh } from 'three';
import { SUN_RADIUS } from './WorldBuilder.math';
import { ECS, Star } from './WorldBuilder.state';

export const StarRender = React.forwardRef<Mesh, Star>(({
  position,
  radius = SUN_RADIUS,
  color,
  emissive,
  lightIntensity
}, ref) => {

  console.log("star render!", {position, color})

  return (
    <mesh ref={ref} position={position}>
      <directionalLight color={emissive} intensity={lightIntensity} castShadow />
      <sphereGeometry args={[radius, 32, 16]}></sphereGeometry>
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={40.0}
      />
    </mesh>
  );
});

export const Stars: React.FC = () => {
  const { entities: stars } = ECS.useArchetype("star")
  return (
    <ECS.Entities entities={stars}>
      {(entity) => {
        console.log({ sun: entity })
        return (
          // <ECS.Component name="mesh" key={entity.name}>
            <StarRender {...entity} />
          // </ECS.Component>
        )
      }}
    </ECS.Entities>
  )
}