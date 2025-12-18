import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "dat.gui";

const Object3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear container
    containerRef.current.innerHTML = "";

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0e12);

    // Add axes helper
    const axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      95,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    // camera.position.set(1, 2, 3);
    camera.position.set(-1, 4, 2.5);

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
    controls.enableDamping = true;

    // Create geometry and material
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshNormalMaterial({ wireframe: true });

    // Create cube
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Create second cube to show transformation difference
    const secondCube = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    );
    secondCube.position.set(3, 0, 0);
    scene.add(secondCube);

    // Create third cube for scale demonstration
    const thirdCube = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    );
    thirdCube.position.set(-3, 0, 0);
    scene.add(thirdCube);

    // Create fourth cube for rotation demonstration
    const fourthCube = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
    );
    fourthCube.position.set(0, 0, 3);
    scene.add(fourthCube);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Stats
    const stats = new Stats();
    stats.dom.style.position = "absolute";
    stats.dom.style.top = "0px";
    stats.dom.style.right = "0px";
    containerRef.current.appendChild(stats.dom);

    // GUI
    const gui = new GUI({ width: 300 });
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "0px";
    gui.domElement.style.right = "10px";
    gui.domElement.style.left = "auto";

    // Main cube folder
    const cubeFolder = gui.addFolder("Cube Properties");
    cubeFolder.add(cube, "visible").name("Visible");

    // Position controls
    const positionFolder = cubeFolder.addFolder("Position");
    positionFolder.add(cube.position, "x", -5, 5, 0.1).name("X Position");
    positionFolder.add(cube.position, "y", -5, 5, 0.1).name("Y Position");
    positionFolder.add(cube.position, "z", -5, 5, 0.1).name("Z Position");
    positionFolder.open();

    // Rotation controls
    const rotationFolder = cubeFolder.addFolder("Rotation");
    rotationFolder
      .add(cube.rotation, "x", 0, Math.PI * 2, 0.01)
      .name("X Rotation");
    rotationFolder
      .add(cube.rotation, "y", 0, Math.PI * 2, 0.01)
      .name("Y Rotation");
    rotationFolder
      .add(cube.rotation, "z", 0, Math.PI * 2, 0.01)
      .name("Z Rotation");
    rotationFolder.open();

    // Scale controls
    const scaleFolder = cubeFolder.addFolder("Scale");
    scaleFolder.add(cube.scale, "x", 0.1, 5, 0.1).name("X Scale");
    scaleFolder.add(cube.scale, "y", 0.1, 5, 0.1).name("Y Scale");
    scaleFolder.add(cube.scale, "z", 0.1, 5, 0.1).name("Z Scale");
    scaleFolder.open();

    // Material controls
    const materialFolder = cubeFolder.addFolder("Material");
    materialFolder.add(material, "wireframe").name("Wireframe");
    materialFolder.open();

    cubeFolder.open();

    // Transformation examples folder
    const examplesFolder = gui.addFolder("Transformation Examples");

    // Position example
    const positionExample = {
      x: 0,
      y: 0,
      z: 0,
    };
    const positionExampleFolder = examplesFolder.addFolder("Position");
    positionExampleFolder
      .add(positionExample, "x", -5, 5, 0.1)
      .onChange((value: number) => {
        secondCube.position.x = value;
      });
    positionExampleFolder
      .add(positionExample, "y", -5, 5, 0.1)
      .onChange((value: number) => {
        secondCube.position.y = value;
      });
    positionExampleFolder
      .add(positionExample, "z", -5, 5, 0.1)
      .onChange((value: number) => {
        secondCube.position.z = value;
      });
    positionExampleFolder.open();

    // Scale example
    const scaleExample = {
      x: 1,
      y: 1,
      z: 1,
    };
    const scaleExampleFolder = examplesFolder.addFolder("Scale");
    scaleExampleFolder
      .add(scaleExample, "x", 0.1, 3, 0.1)
      .onChange((value: number) => {
        thirdCube.scale.x = value;
      });
    scaleExampleFolder
      .add(scaleExample, "y", 0.1, 3, 0.1)
      .onChange((value: number) => {
        thirdCube.scale.y = value;
      });
    scaleExampleFolder
      .add(scaleExample, "z", 0.1, 3, 0.1)
      .onChange((value: number) => {
        thirdCube.scale.z = value;
      });
    scaleExampleFolder.open();

    // Rotation example
    const rotationExample = {
      x: 0,
      y: 0,
      z: 0,
    };
    const rotationExampleFolder = examplesFolder.addFolder("Rotation");
    rotationExampleFolder
      .add(rotationExample, "x", 0, Math.PI * 2, 0.01)
      .onChange((value: number) => {
        fourthCube.rotation.x = value;
      });
    rotationExampleFolder
      .add(rotationExample, "y", 0, Math.PI * 2, 0.01)
      .onChange((value: number) => {
        fourthCube.rotation.y = value;
      });
    rotationExampleFolder
      .add(rotationExample, "z", 0, Math.PI * 2, 0.01)
      .onChange((value: number) => {
        fourthCube.rotation.z = value;
      });
    rotationExampleFolder.open();

    examplesFolder.open();

    // Scene controls
    const sceneFolder = gui.addFolder("Scene Controls");
    sceneFolder.add(axesHelper, "visible").name("Axes Helper");
    sceneFolder.add(gridHelper, "visible").name("Grid Helper");

    // Camera controls
    const cameraFolder = sceneFolder.addFolder("Camera");
    cameraFolder.add(camera.position, "x", -10, 10, 0.1).name("X Position");
    cameraFolder.add(camera.position, "y", -10, 10, 0.1).name("Y Position");
    cameraFolder.add(camera.position, "z", -10, 10, 0.1).name("Z Position");
    cameraFolder.open();

    sceneFolder.open();

    // Reset button
    gui
      .add(
        {
          resetAll: () => {
            // Reset main cube
            cube.position.set(0, 0, 0);
            cube.rotation.set(0, 0, 0);
            cube.scale.set(1, 1, 1);
            cube.visible = true;
            material.wireframe = true;

            // Reset example cubes
            secondCube.position.set(3, 0, 0);
            thirdCube.position.set(-3, 0, 0);
            thirdCube.scale.set(1, 1, 1);
            fourthCube.position.set(0, 0, 3);
            fourthCube.rotation.set(0, 0, 0);

            // Reset camera
            camera.position.set(1, 2, 3);
            controls.reset();

            // Reset GUI values
            positionExample.x = 0;
            positionExample.y = 0;
            positionExample.z = 0;
            scaleExample.x = 1;
            scaleExample.y = 1;
            scaleExample.z = 1;
            rotationExample.x = 0;
            rotationExample.y = 0;
            rotationExample.z = 0;

            // Update GUI
            gui.updateDisplay();
          },
        },
        "resetAll"
      )
      .name("Reset All");

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

    // Animation
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto-rotate example cubes slightly for demonstration
      secondCube.rotation.y += 0.01;
      thirdCube.rotation.x += 0.01;
      fourthCube.rotation.z += 0.01;

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
      [cube, secondCube, thirdCube, fourthCube].forEach((mesh) => {
        mesh.geometry?.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
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
        <h3 style={{ margin: "0 0 10px 0" }}>
          Three.js Object3D Transformations
        </h3>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>Position</strong> (Red Cube): Moves object in 3D space
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>Rotation</strong> (Blue Cube): Rotates around axes (radians)
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>Scale</strong> (Green Cube): Resizes along axes
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>White Cube</strong>: Combined transformations demo
        </p>
        <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#ffcc00" }}>
          Use GUI to manipulate object properties →
        </p>
        <div style={{ marginTop: "10px", fontSize: "10px", color: "#aaa" }}>
          Axes: <span style={{ color: "#ff0000" }}>X (Red)</span>,{" "}
          <span style={{ color: "#00ff00" }}>Y (Green)</span>,{" "}
          <span style={{ color: "#0000ff" }}>Z (Blue)</span>
        </div>
        <div style={{ marginTop: "10px", fontSize: "10px", color: "#aaa" }}>
          © Three.js Transformations Demo. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Object3D;
