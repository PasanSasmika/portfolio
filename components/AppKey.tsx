"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import { iconTexture, type IconKind } from "@/lib/textures";

export type AppKeyHandle = {
  cap: THREE.Group;
  setFace: (i: 0 | 1) => void;
};

export type Face = { kind: IconKind; color: string };

type Props = {
  position: [number, number, number];
  faces: [Face, Face];
};

export const CAP_Y = 0.46;

const AppKey = forwardRef<AppKeyHandle, Props>(function AppKey({ position, faces }, ref) {
  const cap = useRef<THREE.Group>(null!);
  const mat = useRef<THREE.MeshStandardMaterial>(null!);

  const textures = useMemo(
    (): [THREE.Texture, THREE.Texture] => [
      iconTexture(faces[0].kind, faces[0].color),
      iconTexture(faces[1].kind, faces[1].color),
    ],
    [faces]
  );

  useImperativeHandle(ref, () => ({
    cap: cap.current,
    setFace: (i) => {
      mat.current.map = textures[i];
      mat.current.needsUpdate = true;
    },
  }));

  return (
    <group position={position}>
      {/* socket */}
      <RoundedBox args={[1.1, 0.32, 1.1]} radius={0.1} smoothness={5} position={[0, 0.16, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#222327" roughness={0.45} />
      </RoundedBox>
      {/* key cap (this is what flips) */}
      <group ref={cap} position={[0, CAP_Y, 0]}>
        <RoundedBox args={[0.88, 0.26, 0.88]} radius={0.09} smoothness={5} castShadow receiveShadow>
          <meshStandardMaterial color="#2b2c31" roughness={0.4} />
        </RoundedBox>
        <mesh rotation-x={-Math.PI / 2} position={[0, 0.132, 0]}>
          <planeGeometry args={[0.74, 0.74]} />
          <meshStandardMaterial ref={mat} map={textures[0]} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
});

export default AppKey;