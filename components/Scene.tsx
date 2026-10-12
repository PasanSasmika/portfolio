"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer, OrthographicCamera } from "@react-three/drei";
import World from "./World";

const TARGET = new THREE.Vector3(0.9, 0.4, 0.9);

/** Keeps the isometric view centred and sized to the window */
function CameraRig() {
  const { camera, size } = useThree();
  useEffect(() => {
    camera.lookAt(TARGET);
    (camera as THREE.OrthographicCamera).zoom = Math.min(size.width / 14, size.height / 9.5);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export default function Scene() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, toneMapping: THREE.NeutralToneMapping }}
    >
      <color attach="background" args={["#ffffff"]} />
      <OrthographicCamera makeDefault position={[TARGET.x + 10, 11, TARGET.z + 10]} near={-50} far={200} />
      <CameraRig />

      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        position={[-5, 12, 7]}
        intensity={1.8}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0004}
        shadow-radius={6}
      />
      {/* soft studio reflections, no HDR download needed */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2} position={[0, 6, 6]} scale={[12, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-6, 4, 0]} rotation-y={Math.PI / 2} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[6, 4, -2]} rotation-y={-Math.PI / 2} scale={[12, 4, 1]} />
      </Environment>

      <World />
    </Canvas>
  );
}