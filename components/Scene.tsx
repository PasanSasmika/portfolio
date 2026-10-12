"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrthographicCamera } from "@react-three/drei";
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
      // always render at 2x+ so edges are supersampled even on 1x screens
      dpr={[2, 3]}
      gl={{ antialias: true, toneMapping: THREE.NeutralToneMapping, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#ffffff"]} />
      <OrthographicCamera makeDefault position={[TARGET.x + 10, 11, TARGET.z + 10]} near={-50} far={200} />
      <CameraRig />

      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        position={[-5, 12, 7]}
        intensity={1.6}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
        shadow-radius={10}
      />
      {/* soft studio reflections, no HDR download needed */}
      <Environment resolution={512}>
        {/* big overhead softbox: gives every bevel a clean highlight */}
        <Lightformer form="rect" intensity={0.8} position={[0, 10, 0]} rotation-x={Math.PI / 2} scale={[16, 16, 1]} />
        <Lightformer form="rect" intensity={2} position={[0, 6, 6]} scale={[12, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-6, 4, 0]} rotation-y={Math.PI / 2} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[6, 4, -2]} rotation-y={-Math.PI / 2} scale={[12, 4, 1]} />
      </Environment>

      {/* wide, blurred grounding shadow under everything */}
      <ContactShadows position={[0.8, 0.004, 0.8]} scale={18} far={1.6} blur={2.2} opacity={0.55} resolution={1024} color="#1b2233" />

      <World />
    </Canvas>
  );
}