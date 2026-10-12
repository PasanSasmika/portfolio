"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { labelTexture, logoTexture, plateTexture } from "@/lib/textures";

export type HubHandle = {
  lidL: THREE.Group;
  lidR: THREE.Group;
  cube: THREE.Group;
};

const DARK = "#2a2b30";
const BASE_H = 0.35;

function Vents({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-0.16, 0, 0.16].map((z) => (
        <RoundedBox key={z} args={[0.5, 0.04, 0.07]} radius={0.02} position={[0, 0, z]}>
          <meshStandardMaterial color="#55565c" roughness={0.4} />
        </RoundedBox>
      ))}
    </group>
  );
}

const Hub = forwardRef<HubHandle, { position: [number, number, number] }>(function Hub({ position }, ref) {
  const lidL = useRef<THREE.Group>(null!);
  const lidR = useRef<THREE.Group>(null!);
  const cube = useRef<THREE.Group>(null!);

  useImperativeHandle(ref, () => ({ lidL: lidL.current, lidR: lidR.current, cube: cube.current }));

  const logo = useMemo(() => logoTexture(), []);
  const label = useMemo(() => labelTexture("Workflows"), []);
  const plate = useMemo(() => plateTexture(), []);

  return (
    <group position={position}>
      {/* base */}
      <RoundedBox args={[2.8, BASE_H, 2.8]} radius={0.1} smoothness={5} position={[0, BASE_H / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={DARK} roughness={0.45} metalness={0.1} />
      </RoundedBox>
      {/* dark opening under the lid */}
      <mesh rotation-x={-Math.PI / 2} position={[0, BASE_H + 0.002, 0]}>
        <planeGeometry args={[1.42, 1.42]} />
        <meshStandardMaterial color="#0d0d10" roughness={0.9} />
      </mesh>

      <Vents position={[-1.0, BASE_H + 0.02, -1.0]} />
      <Vents position={[1.0, BASE_H + 0.02, 1.0]} />

      {/* small icon plate on the front */}
      <group position={[0, BASE_H + 0.03, 1.08]}>
        <RoundedBox args={[0.5, 0.05, 0.5]} radius={0.04} castShadow>
          <meshStandardMaterial color="#1c1d21" roughness={0.4} />
        </RoundedBox>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.026, 0]}>
          <planeGeometry args={[0.42, 0.42]} />
          <meshStandardMaterial map={plate} roughness={0.5} />
        </mesh>
      </group>

      {/* sliding lid halves */}
      <group ref={lidL} position={[-0.36, BASE_H + 0.035, 0]}>
        <RoundedBox args={[0.72, 0.07, 1.44]} radius={0.03} castShadow receiveShadow>
          <meshStandardMaterial color="#323338" roughness={0.4} />
        </RoundedBox>
      </group>
      <group ref={lidR} position={[0.36, BASE_H + 0.035, 0]}>
        <RoundedBox args={[0.72, 0.07, 1.44]} radius={0.03} castShadow receiveShadow>
          <meshStandardMaterial color="#323338" roughness={0.4} />
        </RoundedBox>
      </group>

      {/* rising "Workflows" cube */}
      <group ref={cube} position={[0, -0.3, 0]} visible={false}>
        <RoundedBox args={[1.3, 1.1, 1.3]} radius={0.08} smoothness={5} castShadow receiveShadow>
          <meshStandardMaterial color="#1c1d21" roughness={0.4} metalness={0.1} />
        </RoundedBox>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.552, 0]}>
          <planeGeometry args={[1.14, 1.14]} />
          <meshStandardMaterial map={logo} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0, 0.652]}>
          <planeGeometry args={[1.14, 0.98]} />
          <meshStandardMaterial map={label} roughness={0.45} />
        </mesh>
      </group>
    </group>
  );
});

export default Hub;
export { BASE_H };