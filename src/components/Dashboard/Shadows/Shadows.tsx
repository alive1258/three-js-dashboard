import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const Shadows = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear container
    containerRef.current.innerHTML = "";

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0e12);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);

    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(-1, 4, 2.5);

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.type = THREE.PCFShadowMap; // (default)
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // renderer.shadowMap.type = THREE.BasicShadowMap
    // renderer.shadowMap.type = THREE.VSMShadowMap
    renderer.shadowMap.enabled = true;
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
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.receiveShadow = true;
    plane.castShadow = true;
    scene.add(plane);

    // Data object for GUI
    const data = {
      color: 0x00ff00,
      lightColor: 0xffffff,
      shadowMapSizeWidth: 512,
      shadowMapSizeHeight: 512,
      shadowMapType: "PCFShadowMap",
    };

    // Create geometry and meshes
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

    // Enable shadows for all meshes
    meshes.forEach((mesh) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });

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

    // #region Renderer Shadow Settings
    const rendererFolder = gui.addFolder("Renderer Settings");
    const shadowMapTypes = {
      BasicShadowMap: THREE.BasicShadowMap,
      PCFShadowMap: THREE.PCFShadowMap,
      PCFSoftShadowMap: THREE.PCFSoftShadowMap,
      VSMShadowMap: THREE.VSMShadowMap,
    };

    rendererFolder
      .add(data, "shadowMapType", Object.keys(shadowMapTypes))
      .onChange((value: string) => {
        renderer.shadowMap.type =
          shadowMapTypes[value as keyof typeof shadowMapTypes];
      })
      .name("Shadow Map Type");
    rendererFolder.add(renderer.shadowMap, "enabled").name("Shadows Enabled");
    rendererFolder.open();
    // #endregion

    // #region DirectionalLight
    const directionalLight = new THREE.DirectionalLight(
      data.lightColor,
      Math.PI
    );
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0;
    directionalLight.shadow.camera.far = 10;
    directionalLight.shadow.mapSize.width = data.shadowMapSizeWidth;
    directionalLight.shadow.mapSize.height = data.shadowMapSizeHeight;
    scene.add(directionalLight);

    const directionalLightHelper = new THREE.CameraHelper(
      directionalLight.shadow.camera
    );
    directionalLightHelper.visible = false;
    scene.add(directionalLightHelper);

    const directionalLightFolder = gui.addFolder("DirectionalLight");
    directionalLightFolder.add(directionalLight, "visible");
    directionalLightFolder.addColor(data, "lightColor").onChange(() => {
      directionalLight.color.set(data.lightColor);
    });
    directionalLightFolder.add(directionalLight, "intensity", 0, Math.PI * 10);

    const directionalLightControls =
      directionalLightFolder.addFolder("Position");
    directionalLightControls
      .add(directionalLight.position, "x", -10, 10, 0.1)
      .onChange(() => {
        directionalLightHelper.update();
      });
    directionalLightControls
      .add(directionalLight.position, "y", -10, 10, 0.1)
      .onChange(() => {
        directionalLightHelper.update();
      });
    directionalLightControls
      .add(directionalLight.position, "z", -10, 10, 0.1)
      .onChange(() => {
        directionalLightHelper.update();
      });
    directionalLightControls.open();

    directionalLightFolder
      .add(directionalLightHelper, "visible")
      .name("Camera Helper");

    const directionalLightShadowFolder =
      directionalLightFolder.addFolder("Shadow Camera");
    directionalLightShadowFolder
      .add(directionalLight.shadow.camera, "left", -20, -1, 0.1)
      .onChange(() => {
        directionalLight.shadow.camera.updateProjectionMatrix();
        directionalLightHelper.update();
      });
    directionalLightShadowFolder
      .add(directionalLight.shadow.camera, "right", 1, 20, 0.1)
      .onChange(() => {
        directionalLight.shadow.camera.updateProjectionMatrix();
        directionalLightHelper.update();
      });
    directionalLightShadowFolder
      .add(directionalLight.shadow.camera, "top", 1, 20, 0.1)
      .onChange(() => {
        directionalLight.shadow.camera.updateProjectionMatrix();
        directionalLightHelper.update();
      });
    directionalLightShadowFolder
      .add(directionalLight.shadow.camera, "bottom", -20, -1, 0.1)
      .onChange(() => {
        directionalLight.shadow.camera.updateProjectionMatrix();
        directionalLightHelper.update();
      });
    directionalLightShadowFolder
      .add(directionalLight.shadow.camera, "near", 0.1, 50, 0.1)
      .onChange(() => {
        directionalLight.shadow.camera.updateProjectionMatrix();
        directionalLightHelper.update();
      });
    directionalLightShadowFolder
      .add(directionalLight.shadow.camera, "far", 1, 100, 0.1)
      .onChange(() => {
        directionalLight.shadow.camera.updateProjectionMatrix();
        directionalLightHelper.update();
      });

    const directionalLightShadowQuality =
      directionalLightFolder.addFolder("Shadow Quality");
    directionalLightShadowQuality
      .add(data, "shadowMapSizeWidth", [256, 512, 1024, 2048, 4096])
      .onChange(() => {
        directionalLight.shadow.mapSize.width = data.shadowMapSizeWidth;
        directionalLight.shadow.map = null;
      })
      .name("Map Width");
    directionalLightShadowQuality
      .add(data, "shadowMapSizeHeight", [256, 512, 1024, 2048, 4096])
      .onChange(() => {
        directionalLight.shadow.mapSize.height = data.shadowMapSizeHeight;
        directionalLight.shadow.map = null;
      })
      .name("Map Height");
    directionalLightShadowQuality
      .add(directionalLight.shadow, "radius", 1, 10, 1)
      .name("Radius (PCF/VSM)");
    directionalLightShadowQuality
      .add(directionalLight.shadow, "blurSamples", 1, 20, 1)
      .name("Blur Samples (VSM)");

    directionalLightFolder.open();
    // #endregion

    // #region PointLight
    const pointLight = new THREE.PointLight(data.lightColor, Math.PI);
    pointLight.position.set(2, 1, 0);
    pointLight.visible = false;
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = data.shadowMapSizeWidth;
    pointLight.shadow.mapSize.height = data.shadowMapSizeHeight;
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

    const pointLightControls = pointLightFolder.addFolder("Position");
    pointLightControls.add(pointLight.position, "x", -10, 10, 0.1);
    pointLightControls.add(pointLight.position, "y", -10, 10, 0.1);
    pointLightControls.add(pointLight.position, "z", -10, 10, 0.1);

    pointLightFolder.add(pointLight, "distance", 0.01, 20, 0.1);
    pointLightFolder.add(pointLight, "decay", 0, 10, 0.1);
    pointLightFolder.add(pointLightHelper, "visible").name("Helper");

    const pointLightShadowFolder = pointLightFolder.addFolder("Shadow");
    pointLightShadowFolder
      .add(pointLight.shadow.camera, "near", 0.01, 10, 0.01)
      .onChange(() => {
        pointLight.shadow.camera.updateProjectionMatrix();
      });
    pointLightShadowFolder
      .add(pointLight.shadow.camera, "far", 1, 100, 0.1)
      .onChange(() => {
        pointLight.shadow.camera.updateProjectionMatrix();
      });
    pointLightShadowFolder
      .add(data, "shadowMapSizeWidth", [256, 512, 1024, 2048, 4096])
      .onChange(() => {
        pointLight.shadow.mapSize.width = data.shadowMapSizeWidth;
        pointLight.shadow.map = null;
      })
      .name("Map Width");
    pointLightShadowFolder
      .add(data, "shadowMapSizeHeight", [256, 512, 1024, 2048, 4096])
      .onChange(() => {
        pointLight.shadow.mapSize.height = data.shadowMapSizeHeight;
        pointLight.shadow.map = null;
      })
      .name("Map Height");
    pointLightShadowFolder
      .add(pointLight.shadow, "radius", 1, 10, 1)
      .name("Radius (PCF/VSM)");
    pointLightShadowFolder
      .add(pointLight.shadow, "blurSamples", 1, 20, 1)
      .name("Blur Samples (VSM)");

    pointLightFolder.open();
    // #endregion

    // #region SpotLight
    const spotLight = new THREE.SpotLight(data.lightColor, Math.PI);
    spotLight.position.set(3, 2.5, 1);
    spotLight.visible = false;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = data.shadowMapSizeWidth;
    spotLight.shadow.mapSize.height = data.shadowMapSizeHeight;
    scene.add(spotLight);

    const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    spotLightHelper.visible = false;
    scene.add(spotLightHelper);

    const spotLightFolder = gui.addFolder("SpotLight");
    spotLightFolder.add(spotLight, "visible");
    spotLightFolder.addColor(data, "lightColor").onChange(() => {
      spotLight.color.set(data.lightColor);
    });
    spotLightFolder.add(spotLight, "intensity", 0, Math.PI * 10);

    const spotLightControls = spotLightFolder.addFolder("Position");
    spotLightControls
      .add(spotLight.position, "x", -10, 10, 0.1)
      .onChange(() => {
        spotLightHelper.update();
      });
    spotLightControls
      .add(spotLight.position, "y", -10, 10, 0.1)
      .onChange(() => {
        spotLightHelper.update();
      });
    spotLightControls
      .add(spotLight.position, "z", -10, 10, 0.1)
      .onChange(() => {
        spotLightHelper.update();
      });

    spotLightFolder.add(spotLight, "distance", 0.01, 100, 0.1).onChange(() => {
      spotLightHelper.update();
    });
    spotLightFolder.add(spotLight, "decay", 0, 10, 0.1).onChange(() => {
      spotLightHelper.update();
    });
    spotLightFolder
      .add(spotLight, "angle", 0, Math.PI / 2, 0.01)
      .onChange(() => {
        spotLight.shadow.camera.updateProjectionMatrix();
        spotLightHelper.update();
      });
    spotLightFolder.add(spotLight, "penumbra", 0, 1, 0.01).onChange(() => {
      spotLightHelper.update();
    });
    spotLightFolder.add(spotLightHelper, "visible").name("Camera Helper");

    const spotLightShadowFolder = spotLightFolder.addFolder("Shadow");
    spotLightShadowFolder
      .add(spotLight.shadow.camera, "near", 0.01, 10, 0.01)
      .onChange(() => {
        spotLight.shadow.camera.updateProjectionMatrix();
        spotLightHelper.update();
      });
    spotLightShadowFolder
      .add(data, "shadowMapSizeWidth", [256, 512, 1024, 2048, 4096])
      .onChange(() => {
        spotLight.shadow.mapSize.width = data.shadowMapSizeWidth;
        spotLight.shadow.map = null;
      })
      .name("Map Width");
    spotLightShadowFolder
      .add(data, "shadowMapSizeHeight", [256, 512, 1024, 2048, 4096])
      .onChange(() => {
        spotLight.shadow.mapSize.height = data.shadowMapSizeHeight;
        spotLight.shadow.map = null;
      })
      .name("Map Height");
    spotLightShadowFolder
      .add(spotLight.shadow, "radius", 1, 10, 1)
      .name("Radius (PCF/VSM)");
    spotLightShadowFolder
      .add(spotLight.shadow, "blurSamples", 1, 20, 1)
      .name("Blur Samples (VSM)");

    spotLightFolder.open();
    // #endregion

    // Material control folders
    const meshBasicMaterialFolder = gui.addFolder("MeshBasicMaterial");
    meshBasicMaterialFolder.addColor(data, "color").onChange(() => {
      basicMaterial.color.set(data.color);
    });
    meshBasicMaterialFolder.add(basicMaterial, "wireframe");
    meshBasicMaterialFolder.open();

    const meshNormalMaterialFolder = gui.addFolder("MeshNormalMaterial");
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

    // Scene controls
    const sceneFolder = gui.addFolder("Scene");
    sceneFolder.add(plane, "visible").name("Plane Visible");
    sceneFolder.add(plane.material, "wireframe").name("Plane Wireframe");
    sceneFolder.add(gridHelper, "visible").name("Grid Visible");

    // Shadow casting controls
    const shadowCastingFolder = sceneFolder.addFolder("Shadow Casting");
    shadowCastingFolder.add(meshes[0], "castShadow").name("BasicMaterial Cast");
    shadowCastingFolder
      .add(meshes[1], "castShadow")
      .name("NormalMaterial Cast");
    shadowCastingFolder.add(meshes[2], "castShadow").name("PhongMaterial Cast");
    shadowCastingFolder
      .add(meshes[3], "castShadow")
      .name("StandardMaterial Cast");
    shadowCastingFolder.add(plane, "receiveShadow").name("Plane Receive");

    sceneFolder.open();

    // Reset button
    gui
      .add(
        {
          resetScene: () => {
            // Reset camera
            camera.position.set(-1, 4, 2.5);
            controls.reset();

            // Reset light positions
            directionalLight.position.set(1, 1, 1);
            pointLight.position.set(2, 1, 0);
            spotLight.position.set(3, 2.5, 1);

            // Reset light visibility
            directionalLight.visible = true;
            pointLight.visible = false;
            spotLight.visible = false;

            // Reset shadow camera settings
            directionalLight.shadow.camera.left = -5;
            directionalLight.shadow.camera.right = 5;
            directionalLight.shadow.camera.top = 5;
            directionalLight.shadow.camera.bottom = -5;
            directionalLight.shadow.camera.near = 0.1;
            directionalLight.shadow.camera.far = 50;
            directionalLight.shadow.camera.updateProjectionMatrix();

            pointLight.shadow.camera.near = 0.1;
            pointLight.shadow.camera.far = 50;
            pointLight.shadow.camera.updateProjectionMatrix();

            spotLight.shadow.camera.near = 0.1;
            spotLight.shadow.camera.far = 50;
            spotLight.shadow.camera.updateProjectionMatrix();

            // Reset materials
            basicMaterial.color.set(0x00ff00);
            phongMaterial.color.set(0x00ff00);
            standardMaterial.color.set(0x00ff00);

            // Reset mesh positions
            meshes[0].position.set(-3, 1, 0);
            meshes[1].position.set(-1, 1, 0);
            meshes[2].position.set(1, 1, 0);
            meshes[3].position.set(3, 1, 0);

            // Reset mesh rotations
            meshes.forEach((mesh) => mesh.rotation.set(0, 0, 0));

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

      // Dispose materials
      [basicMaterial, normalMaterial, phongMaterial, standardMaterial].forEach(
        (material) => material.dispose()
      );

      // Dispose lights and helpers
      [directionalLight, pointLight, spotLight].forEach((light) => {
        light.dispose();
      });

      [
        directionalLightHelper,
        pointLightHelper,
        spotLightHelper,
        gridHelper,
      ].forEach((helper) => {
        if (helper.dispose) helper.dispose();
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
        <h3 style={{ margin: "0 0 10px 0" }}>Three.js Shadows Demo</h3>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>DirectionalLight</strong>: Parallel shadows (sun-like)
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>PointLight</strong>: Omnidirectional shadows
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
          • <strong>SpotLight</strong>: Cone-shaped shadows
        </p>
        <p
          style={{ margin: "5px 0 5px 0", fontSize: "12px", color: "#ffcc00" }}
        >
          Shadow Map Types:
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "11px" }}>
          • <strong>Basic</strong>: Basic shadows (fastest)
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "11px" }}>
          • <strong>PCF</strong>: Better quality (default)
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "11px" }}>
          • <strong>PCFSoft</strong>: Softer edges
        </p>
        <p style={{ margin: "0 0 5px 0", fontSize: "11px" }}>
          • <strong>VSM</strong>: Variance Shadow Mapping
        </p>
        <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#ffcc00" }}>
          Adjust shadow properties in GUI on right →
        </p>
        <div style={{ marginTop: "10px", fontSize: "10px", color: "#aaa" }}>
          © Three.js Shadows Demo. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default Shadows;
