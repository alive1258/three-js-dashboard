import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const Lights = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear container
    containerRef.current.innerHTML = "";

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0e12);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10);
    scene.add(gridHelper);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      95,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
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

    // Create plane
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.MeshStandardMaterial()
    );
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    // Create data object for GUI
    const data = { color: 0x00ff00, lightColor: 0xffffff };

    // Create geometry and meshes with explicit typing
    const geometry = new THREE.IcosahedronGeometry(1, 1);

    // Create materials with explicit types
    const basicMaterial = new THREE.MeshBasicMaterial({ color: data.color });
    const normalMaterial = new THREE.MeshNormalMaterial({ flatShading: true });
    const phongMaterial = new THREE.MeshPhongMaterial({
      color: data.color,
      flatShading: true,
    });
    const standardMaterial = new THREE.MeshStandardMaterial({
      color: data.color,
      flatShading: true,
    });

    // Create meshes
    const meshes = [
      new THREE.Mesh(geometry, basicMaterial),
      new THREE.Mesh(geometry, normalMaterial),
      new THREE.Mesh(geometry, phongMaterial),
      new THREE.Mesh(geometry, standardMaterial),
    ];

    meshes[0].position.set(-3, 1, 0);
    meshes[1].position.set(-1, 1, 0);
    meshes[2].position.set(1, 1, 0);
    meshes[3].position.set(3, 1, 0);

    scene.add(...meshes);

    // Create labels container
    const labelContainer = document.createElement("div");
    labelContainer.style.position = "absolute";
    labelContainer.style.top = "0";
    labelContainer.style.left = "0";
    labelContainer.style.width = "100%";
    labelContainer.style.height = "100%";
    labelContainer.style.pointerEvents = "none";
    labelContainer.style.zIndex = "100";

    const materialNames = [
      "MeshBasicMaterial",
      "MeshNormalMaterial",
      "MeshPhongMaterial",
      "MeshStandardMaterial",
    ];

    const labels: HTMLDivElement[] = [];
    materialNames.forEach((name, index) => {
      const label = document.createElement("div");
      label.className = `label label-${index}`;
      label.textContent = name;
      label.style.position = "absolute";
      label.style.color = "white";
      label.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      label.style.padding = "5px 10px";
      label.style.borderRadius = "3px";
      label.style.fontSize = "14px";
      label.style.fontFamily = "monospace";
      label.style.textAlign = "center";
      label.style.minWidth = "180px";
      labelContainer.appendChild(label);
      labels.push(label);
    });

    containerRef.current.appendChild(labelContainer);

    // Create GUI
    const gui = new GUI({ width: 300 });
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "0px";
    gui.domElement.style.right = "10px";
    gui.domElement.style.left = "auto";

    // #region AmbientLight
    const ambientLight = new THREE.AmbientLight(data.lightColor, Math.PI);
    ambientLight.visible = false;
    scene.add(ambientLight);

    const ambientLightFolder = gui.addFolder("AmbientLight");
    ambientLightFolder.add(ambientLight, "visible");
    ambientLightFolder.addColor(data, "lightColor").onChange(() => {
      ambientLight.color.set(data.lightColor);
    });
    ambientLightFolder.add(ambientLight, "intensity", 0, Math.PI);
    ambientLightFolder.open();
    // #endregion

    // #region DirectionalLight
    const directionalLight = new THREE.DirectionalLight(
      data.lightColor,
      Math.PI
    );
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const directionalLightHelper = new THREE.DirectionalLightHelper(
      directionalLight
    );
    directionalLightHelper.visible = false;
    scene.add(directionalLightHelper);

    const directionalLightFolder = gui.addFolder("DirectionalLight");
    directionalLightFolder.add(directionalLight, "visible");
    directionalLightFolder.addColor(data, "lightColor").onChange(() => {
      directionalLight.color.set(data.lightColor);
    });
    directionalLightFolder.add(directionalLight, "intensity", 0, Math.PI * 10);

    const directionalLightFolderControls =
      directionalLightFolder.addFolder("Controls");
    directionalLightFolderControls
      .add(directionalLight.position, "x", -10, 10, 0.1)
      .onChange(() => {
        directionalLightHelper.update();
      });
    directionalLightFolderControls
      .add(directionalLight.position, "y", -10, 10, 0.1)
      .onChange(() => {
        directionalLightHelper.update();
      });
    directionalLightFolderControls
      .add(directionalLight.position, "z", -10, 10, 0.1)
      .onChange(() => {
        directionalLightHelper.update();
      });
    directionalLightFolderControls
      .add(directionalLightHelper, "visible")
      .name("Helper Visible");
    directionalLightFolderControls.close();
    directionalLightFolder.open();
    // #endregion

    // #region PointLight
    const pointLight = new THREE.PointLight(data.lightColor, Math.PI);
    pointLight.position.set(2, 0, 0);
    pointLight.visible = false;
    scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    pointLightHelper.visible = false;
    scene.add(pointLightHelper);

    const pointLightFolder = gui.addFolder("PointLight");
    pointLightFolder.add(pointLight, "visible");
    pointLightFolder.addColor(data, "lightColor").onChange(() => {
      pointLight.color.set(data.lightColor);
    });
    pointLightFolder.add(pointLight, "intensity", 0, Math.PI * 10);

    const pointLightFolderControls = pointLightFolder.addFolder("Controls");
    pointLightFolderControls
      .add(pointLight.position, "x", -10, 10, 0.1)
      .onChange(() => {
        pointLightHelper.update();
      });
    pointLightFolderControls
      .add(pointLight.position, "y", -10, 10, 0.1)
      .onChange(() => {
        pointLightHelper.update();
      });
    pointLightFolderControls
      .add(pointLight.position, "z", -10, 10, 0.1)
      .onChange(() => {
        pointLightHelper.update();
      });
    pointLightFolderControls
      .add(pointLight, "distance", 0, 20, 0.1)
      .onChange(() => {
        pointLightHelper.update();
      });
    pointLightFolderControls
      .add(pointLight, "decay", 0, 10, 0.1)
      .onChange(() => {
        pointLightHelper.update();
      });
    pointLightFolderControls
      .add(pointLightHelper, "visible")
      .name("Helper Visible");
    pointLightFolderControls.close();
    pointLightFolder.open();
    // #endregion

    // #region SpotLight
    const spotLight = new THREE.SpotLight(data.lightColor, Math.PI);
    spotLight.position.set(3, 2.5, 1);
    spotLight.visible = false;
    scene.add(spotLight);

    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    spotLightHelper.visible = false;
    scene.add(spotLightHelper);

    const spotLightFolder = gui.addFolder("SpotLight");
    spotLightFolder.add(spotLight, "visible");
    spotLightFolder.addColor(data, "lightColor").onChange(() => {
      spotLight.color.set(data.lightColor);
    });
    spotLightFolder.add(spotLight, "intensity", 0, Math.PI * 10);

    const spotLightFolderControls = spotLightFolder.addFolder("Controls");
    spotLightFolderControls
      .add(spotLight.position, "x", -10, 10, 0.1)
      .onChange(() => {
        spotLightHelper.update();
      });
    spotLightFolderControls
      .add(spotLight.position, "y", -10, 10, 0.1)
      .onChange(() => {
        spotLightHelper.update();
      });
    spotLightFolderControls
      .add(spotLight.position, "z", -10, 10, 0.1)
      .onChange(() => {
        spotLightHelper.update();
      });
    spotLightFolderControls
      .add(spotLight, "distance", 0, 20, 0.1)
      .onChange(() => {
        spotLightHelper.update();
      });
    spotLightFolderControls.add(spotLight, "decay", 0, 10, 0.1).onChange(() => {
      spotLightHelper.update();
    });
    spotLightFolderControls.add(spotLight, "angle", 0, 1, 0.01).onChange(() => {
      spotLightHelper.update();
    });
    spotLightFolderControls
      .add(spotLight, "penumbra", 0, 1, 0.01)
      .onChange(() => {
        spotLightHelper.update();
      });
    spotLightFolderControls
      .add(spotLightHelper, "visible")
      .name("Helper Visible");
    spotLightFolderControls.close();
    spotLightFolder.open();
    // #endregion

    // Add material control folders with type-safe approach
    const meshBasicMaterialFolder = gui.addFolder("MeshBasicMaterial");
    meshBasicMaterialFolder.addColor(data, "color").onChange(() => {
      basicMaterial.color.set(data.color);
    });
    // Add wireframe control for BasicMaterial
    meshBasicMaterialFolder.add(basicMaterial, "wireframe");
    meshBasicMaterialFolder.open();

    const meshNormalMaterialFolder = gui.addFolder("MeshNormalMaterial");
    // Use a type assertion to access flatShading
    meshNormalMaterialFolder
      .add(normalMaterial as any, "flatShading")
      .onChange(() => {
        normalMaterial.needsUpdate = true;
      });
    meshNormalMaterialFolder.add(normalMaterial, "wireframe");
    meshNormalMaterialFolder.open();

    const meshPhongMaterialFolder = gui.addFolder("MeshPhongMaterial");
    meshPhongMaterialFolder.addColor(data, "color").onChange(() => {
      phongMaterial.color.set(data.color);
    });
    meshPhongMaterialFolder
      .add(phongMaterial as any, "flatShading")
      .onChange(() => {
        phongMaterial.needsUpdate = true;
      });
    meshPhongMaterialFolder.add(phongMaterial, "wireframe");
    meshPhongMaterialFolder.open();

    const meshStandardMaterialFolder = gui.addFolder("MeshStandardMaterial");
    meshStandardMaterialFolder.addColor(data, "color").onChange(() => {
      standardMaterial.color.set(data.color);
    });
    meshStandardMaterialFolder
      .add(standardMaterial as any, "flatShading")
      .onChange(() => {
        standardMaterial.needsUpdate = true;
      });
    meshStandardMaterialFolder.add(standardMaterial, "wireframe");
    meshStandardMaterialFolder.open();

    // Add grid and plane controls
    const gridFolder = gui.addFolder("Grid");
    gridFolder.add(gridHelper, "visible");
    gridFolder.open();

    const planeFolder = gui.addFolder("Plane");
    planeFolder.add(plane, "visible");
    planeFolder.open();

    // Add camera controls
    const cameraFolder = gui.addFolder("Camera");
    cameraFolder.add(camera.position, "x", -10, 10, 0.1);
    cameraFolder.add(camera.position, "y", -10, 10, 0.1);
    cameraFolder.add(camera.position, "z", -10, 10, 0.1);
    cameraFolder.open();

    // Add a reset button
    gui
      .add(
        {
          resetScene: () => {
            camera.position.set(-1, 4, 2.5);
            controls.reset();

            // Reset mesh positions
            meshes[0].position.set(-3, 1, 0);
            meshes[1].position.set(-1, 1, 0);
            meshes[2].position.set(1, 1, 0);
            meshes[3].position.set(3, 1, 0);

            // Reset mesh rotations
            meshes.forEach((mesh) => {
              mesh.rotation.set(0, 0, 0);
            });

            // Reset lights to default
            ambientLight.color.set(0xffffff);
            ambientLight.intensity = Math.PI;

            directionalLight.color.set(0xffffff);
            directionalLight.intensity = Math.PI;
            directionalLight.position.set(1, 1, 1);

            pointLight.color.set(0xffffff);
            pointLight.intensity = Math.PI;
            pointLight.position.set(2, 0, 0);

            spotLight.color.set(0xffffff);
            spotLight.intensity = Math.PI;
            spotLight.position.set(3, 2.5, 1);

            // Update GUI
            // gui.updateDisplay();
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
    const v = new THREE.Vector3();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto rotate meshes
      meshes.forEach((mesh, index) => {
        mesh.rotation.y += 0.01 * (index + 1);
        mesh.rotation.x += 0.005 * (index + 1);
      });

      // Update label positions
      for (let i = 0; i < meshes.length; i++) {
        v.copy(meshes[i].position);
        v.project(camera);

        const x = ((1 + v.x) / 2) * containerRef.current!.clientWidth - 90;
        const y = ((1 - v.y) / 2) * containerRef.current!.clientHeight;

        if (labels[i]) {
          labels[i].style.left = x + "px";
          labels[i].style.top = y + "px";
        }
      }

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
      [plane, ...meshes].forEach((mesh) => {
        mesh.geometry?.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });

      // Dispose lights
      [ambientLight, directionalLight, pointLight, spotLight].forEach(
        (light) => {
          light.dispose();
        }
      );

      // Dispose materials
      [basicMaterial, normalMaterial, phongMaterial, standardMaterial].forEach(
        (material) => material.dispose()
      );
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
        <h3 style={{ margin: "0 0 10px 0" }}>Three.js Lights Demo</h3>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>AmbientLight:</strong> Even, non-directional light
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>DirectionalLight:</strong> Sun-like parallel rays
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>PointLight:</strong> Light radiating from a point
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>SpotLight:</strong> Cone-shaped directional light
        </p>
        <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#ffcc00" }}>
          Adjust light properties in GUI on right →
        </p>
        <div style={{ marginTop: "10px", fontSize: "10px", color: "#aaa" }}>
          © Three.js Lights Demo. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Lights;
