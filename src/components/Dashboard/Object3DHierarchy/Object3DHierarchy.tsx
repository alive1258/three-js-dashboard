import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "dat.gui";

const Object3DHierarchy = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear container
    containerRef.current.innerHTML = "";

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0e12);

    // Add main axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(4, 4, 4);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(8, 0, 0);
    controls.update();
    controls.enableDamping = true;

    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 400);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create hierarchical objects
    // Object1 (Red) - Parent
    const object1 = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 32, 16),
      new THREE.MeshPhongMaterial({ color: 0xff0000 })
    );
    object1.position.set(4, 0, 0);
    scene.add(object1);

    const object1Axes = new THREE.AxesHelper(2);
    object1.add(object1Axes);

    // Object2 (Green) - Child of Object1
    const object2 = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 16),
      new THREE.MeshPhongMaterial({ color: 0x00ff00 })
    );
    object2.position.set(4, 0, 0);
    object1.add(object2);

    const object2Axes = new THREE.AxesHelper(1.5);
    object2.add(object2Axes);

    // Object3 (Blue) - Child of Object2
    const object3 = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 16),
      new THREE.MeshPhongMaterial({ color: 0x0000ff })
    );
    object3.position.set(4, 0, 0);
    object2.add(object3);

    const object3Axes = new THREE.AxesHelper(1);
    object3.add(object3Axes);

    // Add some helper labels/text
    const createLabel = (
      text: string,
      position: THREE.Vector3,
      color: number
    ) => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return null;

      canvas.width = 256;
      canvas.height = 128;
      context.fillStyle = "#000000";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = "24px Arial";
      context.fillStyle = `#${color.toString(16).padStart(6, "0")}`;
      context.textAlign = "center";
      context.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.copy(position);
      sprite.scale.set(2, 1, 1);
      return sprite;
    };

    const label1 = createLabel(
      "Parent (Red)",
      new THREE.Vector3(4, 1.5, 0),
      0xff0000
    );
    const label2 = createLabel(
      "Child (Green)",
      new THREE.Vector3(8, 1.5, 0),
      0x00ff00
    );
    const label3 = createLabel(
      "Grandchild (Blue)",
      new THREE.Vector3(12, 1.5, 0),
      0x0000ff
    );

    if (label1) scene.add(label1);
    if (label2) scene.add(label2);
    if (label3) scene.add(label3);

    // GUI
    const gui = new GUI({ width: 300 });
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "0px";
    gui.domElement.style.right = "10px";
    gui.domElement.style.left = "auto";

    // Object1 folder
    const object1Folder = gui.addFolder("Parent (Red)");
    object1Folder.add(object1.position, "x", -10, 10, 0.01).name("X Position");
    object1Folder.add(object1.position, "y", -10, 10, 0.01).name("Y Position");
    object1Folder.add(object1.position, "z", -10, 10, 0.01).name("Z Position");
    object1Folder
      .add(object1.rotation, "x", 0, Math.PI * 2, 0.01)
      .name("X Rotation");
    object1Folder
      .add(object1.rotation, "y", 0, Math.PI * 2, 0.01)
      .name("Y Rotation");
    object1Folder
      .add(object1.rotation, "z", 0, Math.PI * 2, 0.01)
      .name("Z Rotation");
    object1Folder.add(object1.scale, "x", 0.1, 3, 0.01).name("X Scale");
    object1Folder.add(object1.scale, "y", 0.1, 3, 0.01).name("Y Scale");
    object1Folder.add(object1.scale, "z", 0.1, 3, 0.01).name("Z Scale");
    object1Folder.add(object1, "visible").name("Visible");
    object1Folder.add(object1Axes, "visible").name("Axes Helper");
    object1Folder.open();

    // Object2 folder
    const object2Folder = gui.addFolder("Child (Green)");
    object2Folder.add(object2.position, "x", -10, 10, 0.01).name("X Position");
    object2Folder.add(object2.position, "y", -10, 10, 0.01).name("Y Position");
    object2Folder.add(object2.position, "z", -10, 10, 0.01).name("Z Position");
    object2Folder
      .add(object2.rotation, "x", 0, Math.PI * 2, 0.01)
      .name("X Rotation");
    object2Folder
      .add(object2.rotation, "y", 0, Math.PI * 2, 0.01)
      .name("Y Rotation");
    object2Folder
      .add(object2.rotation, "z", 0, Math.PI * 2, 0.01)
      .name("Z Rotation");
    object2Folder.add(object2.scale, "x", 0.1, 3, 0.01).name("X Scale");
    object2Folder.add(object2.scale, "y", 0.1, 3, 0.01).name("Y Scale");
    object2Folder.add(object2.scale, "z", 0.1, 3, 0.01).name("Z Scale");
    object2Folder.add(object2, "visible").name("Visible");
    object2Folder.add(object2Axes, "visible").name("Axes Helper");
    object2Folder.open();

    // Object3 folder
    const object3Folder = gui.addFolder("Grandchild (Blue)");
    object3Folder.add(object3.position, "x", -10, 10, 0.01).name("X Position");
    object3Folder.add(object3.position, "y", -10, 10, 0.01).name("Y Position");
    object3Folder.add(object3.position, "z", -10, 10, 0.01).name("Z Position");
    object3Folder
      .add(object3.rotation, "x", 0, Math.PI * 2, 0.01)
      .name("X Rotation");
    object3Folder
      .add(object3.rotation, "y", 0, Math.PI * 2, 0.01)
      .name("Y Rotation");
    object3Folder
      .add(object3.rotation, "z", 0, Math.PI * 2, 0.01)
      .name("Z Rotation");
    object3Folder.add(object3.scale, "x", 0.1, 3, 0.01).name("X Scale");
    object3Folder.add(object3.scale, "y", 0.1, 3, 0.01).name("Y Scale");
    object3Folder.add(object3.scale, "z", 0.1, 3, 0.01).name("Z Scale");
    object3Folder.add(object3, "visible").name("Visible");
    object3Folder.add(object3Axes, "visible").name("Axes Helper");
    object3Folder.open();

    // Scene controls folder
    const sceneFolder = gui.addFolder("Scene Controls");
    sceneFolder.add(axesHelper, "visible").name("Main Axes Helper");
    sceneFolder.add(gridHelper, "visible").name("Grid Helper");
    sceneFolder.add(pointLight, "visible").name("Point Light");
    sceneFolder
      .add(ambientLight, "intensity", 0, 1, 0.01)
      .name("Ambient Light");

    // Camera controls
    const cameraFolder = sceneFolder.addFolder("Camera");
    cameraFolder.add(camera.position, "x", -20, 20, 0.1).name("X Position");
    cameraFolder.add(camera.position, "y", -20, 20, 0.1).name("Y Position");
    cameraFolder.add(camera.position, "z", -20, 20, 0.1).name("Z Position");
    cameraFolder.open();

    sceneFolder.open();

    // Auto-rotation controls
    const animationFolder = gui.addFolder("Animation");
    const animationSettings = {
      autoRotate: true,
      rotationSpeed: 1.0,
    };
    animationFolder.add(animationSettings, "autoRotate").name("Auto Rotate");
    animationFolder
      .add(animationSettings, "rotationSpeed", 0, 3, 0.1)
      .name("Rotation Speed");
    animationFolder.open();

    // Reset button
    gui
      .add(
        {
          resetScene: () => {
            // Reset positions
            object1.position.set(4, 0, 0);
            object2.position.set(4, 0, 0);
            object3.position.set(4, 0, 0);

            // Reset rotations
            object1.rotation.set(0, 0, 0);
            object2.rotation.set(0, 0, 0);
            object3.rotation.set(0, 0, 0);

            // Reset scales
            object1.scale.set(1, 1, 1);
            object2.scale.set(1, 1, 1);
            object3.scale.set(1, 1, 1);

            // Reset visibility
            object1.visible = true;
            object2.visible = true;
            object3.visible = true;
            object1Axes.visible = true;
            object2Axes.visible = true;
            object3Axes.visible = true;

            // Reset camera
            camera.position.set(4, 4, 4);
            controls.target.set(8, 0, 0);
            controls.update();

            // Reset animation
            animationSettings.autoRotate = true;
            animationSettings.rotationSpeed = 1.0;

            // Update GUI
            gui.updateDisplay();
          },
        },
        "resetScene"
      )
      .name("Reset Scene");

    // Stats
    const stats = new Stats();
    stats.dom.style.position = "absolute";
    stats.dom.style.top = "0px";
    stats.dom.style.right = "320px";
    containerRef.current.appendChild(stats.dom);

    // Create debug info container
    const debugContainer = document.createElement("div");
    debugContainer.style.position = "absolute";
    debugContainer.style.bottom = "10px";
    debugContainer.style.left = "10px";
    debugContainer.style.background = "rgba(0, 0, 0, 0.7)";
    debugContainer.style.color = "white";
    debugContainer.style.padding = "10px";
    debugContainer.style.borderRadius = "5px";
    debugContainer.style.fontFamily = "monospace";
    debugContainer.style.fontSize = "14px";
    debugContainer.style.lineHeight = "1.4";
    debugContainer.style.zIndex = "100";
    containerRef.current.appendChild(debugContainer);

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;

      camera.aspect =
        containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);

    // Animation vectors
    const object1WorldPosition = new THREE.Vector3();
    const object2WorldPosition = new THREE.Vector3();
    const object3WorldPosition = new THREE.Vector3();

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto-rotate parent if enabled
      if (animationSettings.autoRotate) {
        object1.rotation.y += 0.01 * animationSettings.rotationSpeed;
        object2.rotation.x += 0.005 * animationSettings.rotationSpeed;
        object3.rotation.z += 0.008 * animationSettings.rotationSpeed;
      }

      // Update world positions
      object1.getWorldPosition(object1WorldPosition);
      object2.getWorldPosition(object2WorldPosition);
      object3.getWorldPosition(object3WorldPosition);

      // Update debug info - Fixed: Use proper HTML string with correct line breaks
      debugContainer.innerHTML = `
        <div style="color: #ff0000; font-weight: bold;">Parent (Red)</div>
        Local Pos X: ${object1.position.x.toFixed(2)}<br/>
        World Pos X: ${object1WorldPosition.x.toFixed(2)}<br/>
        World Pos Y: ${object1WorldPosition.y.toFixed(2)}<br/>
        World Pos Z: ${object1WorldPosition.z.toFixed(2)}<br/><br/>
        
        <div style="color: #00ff00; font-weight: bold;">Child (Green)</div>
        Local Pos X: ${object2.position.x.toFixed(2)}<br/>
        World Pos X: ${object2WorldPosition.x.toFixed(2)}<br/>
        World Pos Y: ${object2WorldPosition.y.toFixed(2)}<br/>
        World Pos Z: ${object2WorldPosition.z.toFixed(2)}<br/><br/>
        
        <div style="color: #0000ff; font-weight: bold;">Grandchild (Blue)</div>
        Local Pos X: ${object3.position.x.toFixed(2)}<br/>
        World Pos X: ${object3WorldPosition.x.toFixed(2)}<br/>
        World Pos Y: ${object3WorldPosition.y.toFixed(2)}<br/>
        World Pos Z: ${object3WorldPosition.z.toFixed(2)}<br/><br/>
        
        <div style="font-size: 11px; color: #aaa;">
          • Local position: Relative to parent<br/>
          • World position: Absolute in scene<br/>
          • Child inherits parent transformations
        </div>
      `;

      controls.update();
      renderer.render(scene, camera);
      stats.update();
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      if (gui) {
        gui.destroy();
      }

      if (controls) {
        controls.dispose();
      }

      if (renderer) {
        renderer.dispose();
      }

      // Dispose geometries and materials
      [object1, object2, object3].forEach((mesh) => {
        mesh.geometry?.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });

      // Dispose axes helpers
      [object1Axes, object2Axes, object3Axes, axesHelper, gridHelper].forEach(
        (helper) => {
          helper.geometry?.dispose();
          if (helper.material) {
            if (Array.isArray(helper.material)) {
              helper.material.forEach((material) => material.dispose());
            } else {
              helper.material.dispose();
            }
          }
        }
      );

      // Dispose lights
      [ambientLight, pointLight].forEach((light) => {
        light.dispose();
      });

      // Dispose sprites
      [label1, label2, label3].forEach((label) => {
        if (label) {
          label.material.map?.dispose();
          label.material.dispose();
        }
      });
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          background: "#0d0e12",
          cursor: "grab",
        }}
        onMouseDown={() => {
          if (containerRef.current) {
            containerRef.current.style.cursor = "grabbing";
          }
        }}
        onMouseUp={() => {
          if (containerRef.current) {
            containerRef.current.style.cursor = "grab";
          }
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          padding: "10px",
          borderRadius: "5px",
          zIndex: 100,
          maxWidth: "300px",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0" }}>Three.js Object3D Hierarchy</h3>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong style={{ color: "#ff0000" }}>Red Sphere</strong>: Parent
          object
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong style={{ color: "#00ff00" }}>Green Sphere</strong>: Child of
          Red
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong style={{ color: "#0000ff" }}>Blue Sphere</strong>: Child of
          Green
        </p>
        <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#ffcc00" }}>
          Child objects inherit transformations from parents
        </p>
        <p style={{ margin: "5px 0 0 0", fontSize: "11px", color: "#aaa" }}>
          Move parent → Children follow
          <br />
          Move child → Only that object moves
          <br />
          World position = Local + Parent transforms
        </p>
        <div style={{ marginTop: "10px", fontSize: "10px", color: "#aaa" }}>
          © Three.js Hierarchy Demo. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Object3DHierarchy;
