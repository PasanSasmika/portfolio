"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type Props = {
  from: [number, number, number];
  to: [number, number, number];
  color: string; // pulse colour
  offset?: number; // 0..1, so pulses don't move in sync
};

export default function Cable({ from, to, color, offset = 0 }: Props) {
  const pulse = useRef<THREE.Mesh>(null!);

  const curve = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().lerp(b, 0.5);
    mid.y = 0.05; // sag down onto the floor
    return new THREE.CatmullRomCurve3([a, a.clone().lerp(mid, 0.6), mid, b.clone().lerp(mid, 0.4), b]);
  }, [from, to]);

  useFrame(({ clock }) => {
    const t = (clock.elapsedTime * 0.45 + offset) % 1;
    pulse.current.position.copy(curve.getPointAt(t));
    const s = Math.sin(t * Math.PI); // fade in/out at the ends
    pulse.current.scale.setScalar(0.4 + s * 0.6);
  });

  return (
    <group>
      <mesh castShadow>
        <tubeGeometry args={[curve, 96, 0.05, 20, false]} />
        <meshStandardMaterial color="#eceef1" roughness={0.4} />
      </mesh>
      <mesh ref={pulse}>
        <sphereGeometry args={[0.07, 32, 32]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}