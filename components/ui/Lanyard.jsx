// /* eslint-disable react/no-unknown-property */
// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
// import { useGLTF, useTexture } from "@react-three/drei";
// import {
//   BallCollider,
//   CuboidCollider,
//   Physics,
//   RigidBody,
//   useRopeJoint,
//   useSphericalJoint,
// } from "@react-three/rapier";
// import { MeshLineGeometry, MeshLineMaterial } from "meshline";
// import * as THREE from "three";

// extend({ MeshLineGeometry, MeshLineMaterial });
// useGLTF.preload("/card.glb");

// const BLANK_PIXEL =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

// const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
// const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

// export default function Lanyard({
//   position = [0, 0, 30],
//   gravity = [0, -40, 0],
//   fov = 20,
//   transparent = true,
//   frontImage = null,
//   backImage = null,
//   imageFit = "cover",
//   lanyardImage = null,
//   lanyardWidth = 1,
// }) {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const check = () => setIsMobile(window.innerWidth < 768);
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, []);

//   return (
//     <div className="relative w-full h-full">
//       <Canvas
//         camera={{ position, fov }}
//         dpr={1}
//         gl={{
//           alpha: transparent,
//           antialias: false,
//           powerPreference: "low-power",
//           stencil: false,
//         }}
//         onCreated={({ gl }) =>
//           gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
//         }
//         style={{ touchAction: "none" }}
//         frameloop="demand"
//       >
//         <ambientLight intensity={2.5} />
//         <directionalLight position={[5, 5, 5]} intensity={1.5} />
//         <pointLight position={[-3, 2, 4]} intensity={0.8} color="#ffaa55" />

//         <Physics gravity={gravity} timeStep={1 / 30}>
//           <Band
//             isMobile={isMobile}
//             frontImage={frontImage}
//             backImage={backImage}
//             imageFit={imageFit}
//             lanyardImage={lanyardImage}
//             lanyardWidth={lanyardWidth}
//           />
//         </Physics>
//       </Canvas>
//     </div>
//   );
// }

// function Band({
//   isMobile = false,
//   frontImage = null,
//   backImage = null,
//   imageFit = "cover",
//   lanyardImage = null,
//   lanyardWidth = 1,
// }) {
//   const { invalidate } = useThree();

//   const band = useRef();
//   const fixed = useRef();
//   const j1 = useRef();
//   const j2 = useRef();
//   const j3 = useRef();
//   const card = useRef();

//   const vec = useMemo(() => new THREE.Vector3(), []);
//   const ang = useMemo(() => new THREE.Vector3(), []);
//   const rot = useMemo(() => new THREE.Vector3(), []);
//   const dir = useMemo(() => new THREE.Vector3(), []);
//   const lerpedJ1 = useMemo(() => new THREE.Vector3(), []);
//   const lerpedJ2 = useMemo(() => new THREE.Vector3(), []);

//   const segmentProps = {
//     type: "dynamic",
//     canSleep: true,
//     colliders: false,
//     angularDamping: 12,
//     linearDamping: 12,
//   };

//   const { nodes, materials } = useGLTF("/card.glb");
//   const texture = useTexture(lanyardImage || "/lanyard.png");
//   const frontTex = useTexture(frontImage || BLANK_PIXEL);
//   const backTex = useTexture(backImage || BLANK_PIXEL);

//   const cardNode =
//     nodes?.card || Object.values(nodes || {}).find((n) => n?.geometry);
//   const clipNode = nodes?.clip;
//   const clampNode = nodes?.clamp;
//   const baseMaterial =
//     materials?.base || Object.values(materials || {})[0];
//   const metalMaterial =
//     materials?.metal || Object.values(materials || {})[1] || baseMaterial;

//   const cardMap = useMemo(() => {
//     const baseMap = baseMaterial?.map;
//     if (!baseMap) return null;
//     if (!frontImage && !backImage) return baseMap;

//     const baseImg = baseMap.image;
//     if (!baseImg?.width || !baseImg?.height) return baseMap;

//     const W = baseImg.width;
//     const H = baseImg.height;
//     const canvas = document.createElement("canvas");
//     canvas.width = W;
//     canvas.height = H;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return baseMap;

//     ctx.drawImage(baseImg, 0, 0, W, H);

//     const drawFitted = (img, rect) => {
//       if (!img?.width || !img?.height) return;
//       const rx = rect.x * W;
//       const ry = rect.y * H;
//       const rw = rect.w * W;
//       const rh = rect.h * H;
//       const pick = imageFit === "contain" ? Math.min : Math.max;
//       const scale = pick(rw / img.width, rh / img.height);
//       const dw = img.width * scale;
//       const dh = img.height * scale;
//       const dx = rx + (rw - dw) / 2;
//       const dy = ry + (rh - dh) / 2;
//       ctx.save();
//       ctx.beginPath();
//       ctx.rect(rx, ry, rw, rh);
//       ctx.clip();
//       ctx.drawImage(img, dx, dy, dw, dh);
//       ctx.restore();
//     };

//     if (frontImage && frontTex?.image?.width)
//       drawFitted(frontTex.image, FRONT_UV_RECT);
//     if (backImage && backTex?.image?.width)
//       drawFitted(backTex.image, BACK_UV_RECT);

//     const composite = new THREE.CanvasTexture(canvas);
//     composite.colorSpace = THREE.SRGBColorSpace;
//     composite.flipY = baseMap.flipY ?? true;
//     composite.anisotropy = 1;
//     composite.needsUpdate = true;
//     return composite;
//   }, [frontImage, backImage, imageFit, frontTex, backTex, baseMaterial]);

//   const curve = useMemo(
//     () =>
//       new THREE.CatmullRomCurve3([
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//         new THREE.Vector3(),
//       ]),
//     []
//   );

//   const [dragged, drag] = useState(false);
//   const [hovered, hover] = useState(false);

//   useRopeJoint(fixed, j1, [
//     [0, 0, 0],
//     [0, 0, 0],
//     1,
//   ]);
//   useRopeJoint(j1, j2, [
//     [0, 0, 0],
//     [0, 0, 0],
//     1,
//   ]);
//   useRopeJoint(j2, j3, [
//     [0, 0, 0],
//     [0, 0, 0],
//     1,
//   ]);
//   useSphericalJoint(j3, card, [
//     [0, 0, 0],
//     [0, 1.5, 0],
//   ]);

//   useEffect(() => {
//     if (hovered) {
//       document.body.style.cursor = dragged ? "grabbing" : "grab";
//       return () => {
//         document.body.style.cursor = "auto";
//       };
//     }
//   }, [hovered, dragged]);

//   useEffect(() => {
//     const t = setTimeout(() => invalidate(), 50);
//     return () => clearTimeout(t);
//   }, [invalidate]);

//   useFrame((state, delta) => {
//     let needsRender = false;

//     if (dragged) {
//       vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
//       dir.copy(vec).sub(state.camera.position).normalize();
//       vec.add(dir.multiplyScalar(state.camera.position.length()));
//       [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());

//       const maxReach = 6;
//       const targetX = vec.x - dragged.x;
//       const targetY = vec.y - dragged.y;
//       const targetZ = vec.z - dragged.z;
//       const distFromAnchor = Math.hypot(targetX, targetY - 4, targetZ);
//       const scale = distFromAnchor > maxReach ? maxReach / distFromAnchor : 1;

//       card.current?.setNextKinematicTranslation({
//         x: targetX * scale,
//         y: 4 + (targetY - 4) * scale,
//         z: targetZ * scale,
//       });
//       needsRender = true;
//     }

//     if (fixed.current) {
//       const j1Body = j1.current;
//       const j2Body = j2.current;

//       if (j1Body) {
//         if (!j1Body.lerped) j1Body.lerped = lerpedJ1.copy(j1Body.translation());
//         const d1 = j1Body.lerped.distanceTo(j1Body.translation());
//         if (d1 > 0.005) {
//           j1Body.lerped.lerp(j1Body.translation(), delta * (2 + d1 * 8));
//           needsRender = true;
//         }
//       }

//       if (j2Body) {
//         if (!j2Body.lerped) j2Body.lerped = lerpedJ2.copy(j2Body.translation());
//         const d2 = j2Body.lerped.distanceTo(j2Body.translation());
//         if (d2 > 0.005) {
//           j2Body.lerped.lerp(j2Body.translation(), delta * (2 + d2 * 8));
//           needsRender = true;
//         }
//       }

//       if (needsRender || dragged) {
//         curve.points[0].copy(j3.current.translation());
//         curve.points[1].copy(j2Body?.lerped || j2Body.translation());
//         curve.points[2].copy(j1Body?.lerped || j1Body.translation());
//         curve.points[3].copy(fixed.current.translation());
//         band.current.geometry.setPoints(curve.getPoints(8));

//         ang.copy(card.current.angvel());
//         rot.copy(card.current.rotation());
//         card.current.setAngvel({
//           x: ang.x,
//           y: ang.y - rot.y * 0.25,
//           z: ang.z,
//         });
//       }

//       const anyAwake =
//         !card.current?.isSleeping() ||
//         !j3.current?.isSleeping() ||
//         !j2.current?.isSleeping() ||
//         !j1.current?.isSleeping();

//       if (anyAwake || dragged) {
//         needsRender = true;
//       }
//     }

//     if (needsRender) {
//       invalidate();
//     }
//   });

//   curve.curveType = "chordal";
//   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

//   if (!cardNode) return null;

//   return (
//     <>
//       <group position={[0, 4, 0]}>
//         <RigidBody ref={fixed} {...segmentProps} type="fixed" />
//         <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>
//         <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>
//         <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
//           <BallCollider args={[0.1]} />
//         </RigidBody>
//         <RigidBody
//           position={[2, 0, 0]}
//           ref={card}
//           {...segmentProps}
//           type={dragged ? "kinematicPosition" : "dynamic"}
//         >
//           <CuboidCollider args={[0.8, 1.125, 0.01]} />
//           <group
//             scale={2.25}
//             position={[0, -1.2, -0.05]}
//             onPointerOver={() => hover(true)}
//             onPointerOut={() => hover(false)}
//             onPointerUp={(e) => {
//               e.target.releasePointerCapture(e.pointerId);
//               drag(false);
//             }}
//             onPointerDown={(e) => {
//               e.stopPropagation();
//               e.target.setPointerCapture(e.pointerId);
//               drag(
//                 new THREE.Vector3().copy(
//                   e.point.sub(vec.copy(card.current.translation()))
//                 )
//               );
//             }}
//           >
//             <mesh geometry={cardNode.geometry}>
//               <meshPhysicalMaterial
//                 map={cardMap}
//                 clearcoat={0.1}
//                 clearcoatRoughness={0.5}
//                 roughness={0.9}
//                 metalness={0.3}
//               />
//             </mesh>
//             {clipNode && (
//               <mesh
//                 geometry={clipNode.geometry}
//                 material={metalMaterial}
//                 material-roughness={0.3}
//               />
//             )}
//             {clampNode && (
//               <mesh geometry={clampNode.geometry} material={metalMaterial} />
//             )}
//           </group>
//         </RigidBody>
//       </group>
//       <mesh ref={band}>
//         <meshLineGeometry />
//         <meshLineMaterial
//           color="white"
//           depthTest={false}
//           resolution={[300, 300]}
//           useMap
//           map={texture}
//           repeat={[-3, 1]}
//           lineWidth={lanyardWidth}
//         />
//       </mesh>
//     </>
//   );
// }