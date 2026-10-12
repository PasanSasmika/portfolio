"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Board, { BOARD_H } from "./Board";
import Hub, { BASE_H, type HubHandle } from "./Hub";
import AppKey, { CAP_Y, type AppKeyHandle, type Face } from "./AppKey";
import Cable from "./Cable";
import OutputCard, { OutputHandle } from "./OutputCard";

type KeyDef = {
  pos: [number, number, number];
  cableTo: [number, number, number];
  faces: [Face, Face];
  pulse: string;
};

const E = 3.5; // board half-size

// keys along the two front edges of the board
const KEYS: KeyDef[] = [
  { pos: [-2.8, 0, 4.85], cableTo: [-2.5, 0.25, E], pulse: "#3b82f6",
    faces: [{ kind: "calendar", color: "#3b82f6" }, { kind: "grid", color: "#16a34a" }] },
  { pos: [-1.2, 0, 4.85], cableTo: [-0.9, 0.25, E], pulse: "#f97316",
    faces: [{ kind: "nodes", color: "#f97316" }, { kind: "wave", color: "#e11d48" }] },
  { pos: [0.4, 0, 4.85], cableTo: [0.7, 0.25, E], pulse: "#8b5cf6",
    faces: [{ kind: "pin", color: "#6d28d9" }, { kind: "sync", color: "#10b981" }] },
  { pos: [2.2, 0, 4.55], cableTo: [2.3, 0.25, E], pulse: "#06b6d4",
    faces: [{ kind: "cloud", color: "#0ea5e9" }, { kind: "video", color: "#2563eb" }] },
  { pos: [4.55, 0, 2.2], cableTo: [E, 0.25, 2.3], pulse: "#3b82f6",
    faces: [{ kind: "stack", color: "#2563eb" }, { kind: "chat", color: "#7c3aed" }] },
  { pos: [4.85, 0, 0.4], cableTo: [E, 0.25, 0.7], pulse: "#ef4444",
    faces: [{ kind: "chat", color: "#ef4444" }, { kind: "asterisk", color: "#f4511e" }] },
  { pos: [4.85, 0, -1.2], cableTo: [E, 0.25, -0.9], pulse: "#22c55e",
    faces: [{ kind: "bolt", color: "#0f766e" }, { kind: "cloud", color: "#0284c7" }] },
  { pos: [4.85, 0, -2.8], cableTo: [E, 0.25, -2.5], pulse: "#14b8a6",
    faces: [{ kind: "wave", color: "#155e4b" }, { kind: "nodes", color: "#334155" }] },
];

const HUB_POS: [number, number, number] = [-1, BOARD_H, -1];

export default function World() {
  const hub = useRef<HubHandle>(null!);
  const out = useRef<OutputHandle>(null!);
  const keys = useRef<AppKeyHandle[]>([]);

  useEffect(() => {
    const { lidL, lidR, cube } = hub.current;
    const { arrow, card } = out.current;
    const ks = keys.current;
    const UP = BASE_H + 0.55; // cube centre when raised
    const DOWN = -0.3; // hidden inside the base

    const flip = (tl: gsap.core.Timeline, k: AppKeyHandle, face: 0 | 1, at: number) => {
      tl.to(k.cap.position, { y: CAP_Y + 0.35, duration: 0.2, ease: "power2.out" }, at)
        .to(k.cap.rotation, { x: Math.PI / 2, duration: 0.22, ease: "power2.in" }, at)
        .call(() => k.setFace(face), [], at + 0.22)
        .set(k.cap.rotation, { x: -Math.PI / 2 }, at + 0.22)
        .to(k.cap.rotation, { x: 0, duration: 0.35, ease: "back.out(1.7)" }, at + 0.22)
        .to(k.cap.position, { y: CAP_Y, duration: 0.3, ease: "bounce.out" }, at + 0.35);
    };

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4, defaults: { ease: "power3.inOut" } });

    // 1. lid opens
    tl.to(lidL.position, { x: -1.05, duration: 0.7 }, 0.4)
      .to(lidR.position, { x: 1.05, duration: 0.7 }, 0.4)
      // 2. cube rises
      .set(cube, { visible: true }, 0.9)
      .to(cube.position, { y: UP, duration: 1.0, ease: "back.out(1.4)" }, 0.9)
      // 4. arrow + output card
      .to(arrow.scale, { x: 1, duration: 0.5, ease: "power2.out" }, 3.6)
      .to(card.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: "back.out(1.6)" }, 3.9)
      .from(card.position, { x: 1.3, duration: 0.6, ease: "power3.out" }, 3.9);

    // 3. keys flip to their second app, staggered
    ks.forEach((k, i) => flip(tl, k, 1, 2.0 + i * 0.12));

    // 5. hold, then reverse everything back to the start
    const back = 7.4;
    tl.to(card.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.4, ease: "power2.in" }, back)
      .to(arrow.scale, { x: 0.001, duration: 0.3 }, back + 0.2)
      .to(cube.position, { y: DOWN, duration: 0.8, ease: "power3.in" }, back + 0.4)
      .set(cube, { visible: false }, back + 1.2)
      .to(lidL.position, { x: -0.36, duration: 0.6 }, back + 1.2)
      .to(lidR.position, { x: 0.36, duration: 0.6 }, back + 1.2);
    ks.forEach((k, i) => flip(tl, k, 0, back + 0.4 + i * 0.1));

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <group>
      <Board />
      <Hub ref={hub} position={HUB_POS} />
      <OutputCard ref={out} y={BOARD_H} />

      {KEYS.map((k, i) => {
        const [x, , z] = k.pos;
        // cable leaves the side of the key that faces the board
        const from: [number, number, number] =
          z > E ? [x, 0.16, z - 0.5] : [x - 0.5, 0.16, z];
        return (
          <group key={i}>
            <AppKey ref={(r) => { if (r) keys.current[i] = r; }} position={k.pos} faces={k.faces} />
            <Cable from={from} to={k.cableTo} color={k.pulse} offset={i * 0.17} />
          </group>
        );
      })}
    </group>
  );
}