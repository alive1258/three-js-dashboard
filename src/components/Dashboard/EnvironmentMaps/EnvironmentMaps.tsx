// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
// import Stats from "three/addons/libs/stats.module.js";
// import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// const EnvironmentMaps = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [loading, setLoading] = useState(true);
//   const [modelLoaded, setModelLoaded] = useState(false);
//   const [environmentLoaded, setEnvironmentLoaded] = useState(false);

//   useEffect(() => {
//     if (!containerRef.current) return;

//     // Clear container
//     containerRef.current.innerHTML = "";
//     setLoading(true);

//     // Create scene
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x0d0e12);

//     // Create camera
//     const camera = new THREE.PerspectiveCamera(
//       95,
//       containerRef.current.clientWidth / containerRef.current.clientHeight,
//       0.1,
//       100
//     );
//     camera.position.set(-2, 0.5, 2);

//     // Create renderer
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.0;
//     renderer.setSize(
//       containerRef.current.clientWidth,
//       containerRef.current.clientHeight
//     );
//     renderer.setPixelRatio(window.devicePixelRatio);
//     containerRef.current.appendChild(renderer.domElement);

//     // Create controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;

//     // Lights
//     const directionalLight = new THREE.DirectionalLight(0xebfeff, Math.PI);
//     directionalLight.position.set(1, 0.1, 1);
//     directionalLight.visible = false;
//     scene.add(directionalLight);

//     const ambientLight = new THREE.AmbientLight(0xebfeff, Math.PI / 16);
//     ambientLight.visible = false;
//     scene.add(ambientLight);

//     // Environment maps options
//     const environmentMaps = {
//       "Cube Map (Default)": "cube",
//       "Rustig Koppie": "rustig",
//       "Venice Sunset": "venice",
//       "Spruit Sunrise": "spruit",
//     };

//     let currentEnvironment: THREE.Texture | THREE.CubeTexture | null = null;
//     const data = {
//       environmentMap: "cube",
//       environmentEnabled: true,
//       backgroundEnabled: true,
//       planeVisible: false,
//       mapEnabled: false,
//       environmentIntensity: 1.0,
//       backgroundBlurriness: 0.0,
//       toneMappingExposure: 1.0,
//     };

//     // Material
//     const textureLoader = new THREE.TextureLoader();
//     const gridTexture = textureLoader.load("https://sbcode.net/img/grid.png");
//     gridTexture.colorSpace = THREE.SRGBColorSpace;

//     const material = new THREE.MeshPhysicalMaterial({
//       side: THREE.DoubleSide,
//       envMapIntensity: 0.7,
//       roughness: 0.17,
//       metalness: 0.07,
//       clearcoat: 0.43,
//       iridescence: 1,
//       transmission: 1,
//       thickness: 5.12,
//       ior: 1.78,
//     });

//     // Plane
//     const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material);
//     plane.rotation.x = -Math.PI / 2;
//     plane.position.y = -1;
//     plane.visible = false;
//     scene.add(plane);

//     // Load Suzanne model
//     const loader = new GLTFLoader();
//     let suzanneMesh: THREE.Mesh | null = null;

//     loader.load(
//       "https://sbcode.net/models/suzanne_no_material.glb",
//       (gltf) => {
//         gltf.scene.traverse((child) => {
//           if (child instanceof THREE.Mesh) {
//             child.material = material;
//             suzanneMesh = child;
//           }
//         });
//         scene.add(gltf.scene);
//         setModelLoaded(true);
//       },
//       undefined,
//       (error) => {
//         console.error("Error loading model:", error);
//         setModelLoaded(true);
//       }
//     );

//     // Load environment maps
//     const loadEnvironmentMap = (type: string) => {
//       if (currentEnvironment) {
//         currentEnvironment.dispose();
//       }

//       if (type === "cube") {
//         // Cube map environment
//         const cubeTextureLoader = new THREE.CubeTextureLoader();
//         cubeTextureLoader.setPath("https://sbcode.net/img/");
//         currentEnvironment = cubeTextureLoader.load([
//           "px.png",
//           "nx.png",
//           "py.png",
//           "ny.png",
//           "pz.png",
//           "nz.png",
//         ]);
//         currentEnvironment.colorSpace = THREE.SRGBColorSpace;

//         if (data.environmentEnabled) {
//           scene.environment = currentEnvironment;
//         }
//         if (data.backgroundEnabled) {
//           scene.background = currentEnvironment;
//         }
//         setEnvironmentLoaded(true);
//       } else {
//         // HDR environment maps
//         const hdrLoader = new RGBELoader();
//         let hdrUrl = "";

//         switch (type) {
//           case "rustig":
//             hdrUrl = "https://sbcode.net/img/rustig_koppie_puresky_1k.hdr";
//             break;
//           case "venice":
//             hdrUrl = "https://sbcode.net/img/venice_sunset_1k.hdr";
//             break;
//           case "spruit":
//             hdrUrl = "https://sbcode.net/img/spruit_sunrise_1k.hdr";
//             break;
//         }

//         hdrLoader.load(
//           hdrUrl,
//           (texture) => {
//             currentEnvironment = texture;
//             currentEnvironment.mapping = THREE.EquirectangularReflectionMapping;
//             currentEnvironment.colorSpace = THREE.SRGBColorSpace;

//             if (data.environmentEnabled) {
//               scene.environment = currentEnvironment;
//             }
//             if (data.backgroundEnabled) {
//               scene.background = currentEnvironment;
//             }
//             setEnvironmentLoaded(true);
//           },
//           undefined,
//           (error) => {
//             console.error("Error loading HDR:", error);
//             setEnvironmentLoaded(true);
//           }
//         );
//       }
//     };

//     // Load initial environment
//     loadEnvironmentMap(data.environmentMap);

//     // GUI
//     const gui = new GUI({ width: 300 });
//     gui.domElement.style.position = "absolute";
//     gui.domElement.style.top = "0px";
//     gui.domElement.style.right = "10px";
//     gui.domElement.style.left = "auto";

//     // Environment folder
//     const environmentFolder = gui.addFolder("Environment");
//     environmentFolder
//       .add(data, "environmentMap", environmentMaps)
//       .onChange((value: string) => {
//         loadEnvironmentMap(value);
//       })
//       .name("Environment Map");

//     environmentFolder
//       .add(data, "environmentEnabled")
//       .onChange((value: boolean) => {
//         if (value && currentEnvironment) {
//           scene.environment = currentEnvironment;
//           directionalLight.visible = false;
//           ambientLight.visible = false;
//         } else {
//           scene.environment = null;
//           directionalLight.visible = true;
//           ambientLight.visible = true;
//         }
//       })
//       .name("Environment Enabled");

//     environmentFolder
//       .add(data, "backgroundEnabled")
//       .onChange((value: boolean) => {
//         if (value && currentEnvironment) {
//           scene.background = currentEnvironment;
//         } else {
//           scene.background = null;
//         }
//       })
//       .name("Background Enabled");

//     environmentFolder
//       .add(data, "environmentIntensity", 0, 2, 0.01)
//       .onChange((value: number) => {
//         scene.environmentIntensity = value;
//       })
//       .name("Environment Intensity");

//     environmentFolder
//       .add(data, "backgroundBlurriness", 0, 1, 0.01)
//       .onChange((value: number) => {
//         scene.backgroundBlurriness = value;
//       })
//       .name("Background Blur");
//     environmentFolder.open();

//     // Renderer folder
//     const rendererFolder = gui.addFolder("Renderer");
//     const toneMappingOptions = {
//       None: THREE.NoToneMapping,
//       Linear: THREE.LinearToneMapping,
//       Reinhard: THREE.ReinhardToneMapping,
//       Cineon: THREE.CineonToneMapping,
//       "ACES Filmic": THREE.ACESFilmicToneMapping,
//     };

//     rendererFolder
//       .add(renderer, "toneMapping", toneMappingOptions)
//       .onChange(() => {
//         renderer.toneMapping =
//           toneMappingOptions[
//             renderer.toneMapping as unknown as keyof typeof toneMappingOptions
//           ];
//       })
//       .name("Tone Mapping");

//     rendererFolder
//       .add(data, "toneMappingExposure", 0, 2, 0.01)
//       .onChange((value: number) => {
//         renderer.toneMappingExposure = value;
//       })
//       .name("Exposure");
//     rendererFolder.open();

//     // Material folder
//     const materialFolder = gui.addFolder("MeshPhysicalMaterial");
//     materialFolder
//       .add(material, "envMapIntensity", 0, 1.0, 0.01)
//       .onChange(() => {
//         if (!material.envMap && currentEnvironment) {
//           material.envMap = currentEnvironment;
//         }
//       })
//       .name("Env Map Intensity");

//     materialFolder.add(material, "roughness", 0, 1.0, 0.01).name("Roughness");
//     materialFolder.add(material, "metalness", 0, 1.0, 0.01).name("Metalness");
//     materialFolder.add(material, "clearcoat", 0, 1.0, 0.01).name("Clearcoat");
//     materialFolder
//       .add(material, "iridescence", 0, 1.0, 0.01)
//       .name("Iridescence");
//     materialFolder
//       .add(material, "transmission", 0, 1.0, 0.01)
//       .name("Transmission");
//     materialFolder.add(material, "thickness", 0, 10.0, 0.01).name("Thickness");
//     materialFolder.add(material, "ior", 1.0, 2.333, 0.01).name("IOR");

//     // Color picker for base color
//     const colorData = { color: 0xffffff };
//     materialFolder
//       .addColor(colorData, "color")
//       .onChange(() => {
//         material.color.set(colorData.color);
//       })
//       .name("Base Color");

//     materialFolder.open();

//     // Scene folder
//     const sceneFolder = gui.addFolder("Scene");
//     sceneFolder
//       .add(data, "planeVisible")
//       .onChange((value: boolean) => {
//         plane.visible = value;
//       })
//       .name("Show Plane");

//     sceneFolder
//       .add(data, "mapEnabled")
//       .onChange((value: boolean) => {
//         if (value) {
//           material.map = gridTexture;
//         } else {
//           material.map = null;
//         }
//         material.needsUpdate = true;
//       })
//       .name("Grid Texture");

//     // Light controls
//     const lightFolder = sceneFolder.addFolder("Lights");
//     lightFolder.add(directionalLight, "visible").name("Directional Light");
//     lightFolder
//       .add(directionalLight, "intensity", 0, 10, 0.1)
//       .name("Dir. Intensity");
//     lightFolder.add(ambientLight, "visible").name("Ambient Light");
//     lightFolder
//       .add(ambientLight, "intensity", 0, 5, 0.1)
//       .name("Amb. Intensity");
//     lightFolder.open();

//     sceneFolder.open();

//     // Reset button
//     gui
//       .add(
//         {
//           resetAll: () => {
//             // Reset material properties
//             material.envMapIntensity = 0.7;
//             material.roughness = 0.17;
//             material.metalness = 0.07;
//             material.clearcoat = 0.43;
//             material.iridescence = 1;
//             material.transmission = 1;
//             material.thickness = 5.12;
//             material.ior = 1.78;
//             material.color.set(0xffffff);
//             material.map = null;
//             material.needsUpdate = true;

//             // Reset scene properties
//             data.environmentMap = "cube";
//             data.environmentEnabled = true;
//             data.backgroundEnabled = true;
//             data.planeVisible = false;
//             data.mapEnabled = false;
//             data.environmentIntensity = 1.0;
//             data.backgroundBlurriness = 0.0;
//             data.toneMappingExposure = 1.0;

//             // Reset renderer
//             renderer.toneMapping = THREE.ACESFilmicToneMapping;
//             renderer.toneMappingExposure = 1.0;

//             // Reset lights
//             directionalLight.visible = false;
//             ambientLight.visible = false;

//             // Reset camera
//             camera.position.set(-2, 0.5, 2);
//             controls.reset();

//             // Reload environment
//             loadEnvironmentMap(data.environmentMap);

//             // Update GUI
//             // gui.updateDisplay();
//           },
//         },
//         "resetAll"
//       )
//       .name("Reset All");

//     // Stats
//     const stats = new Stats();
//     stats.dom.style.position = "absolute";
//     stats.dom.style.top = "0px";
//     stats.dom.style.right = "320px";
//     containerRef.current.appendChild(stats.dom);

//     // Handle resize
//     const handleResize = () => {
//       if (!containerRef.current) return;

//       camera.aspect =
//         containerRef.current.clientWidth / containerRef.current.clientHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(
//         containerRef.current.clientWidth,
//         containerRef.current.clientHeight
//       );
//     };

//     window.addEventListener("resize", handleResize);

//     // Animation
//     let animationFrameId: number;

//     const animate = () => {
//       animationFrameId = requestAnimationFrame(animate);

//       // Rotate Suzanne if loaded
//       if (suzanneMesh) {
//         suzanneMesh.rotation.y += 0.01;
//       }

//       controls.update();
//       renderer.render(scene, camera);
//       stats.update();

//       // Update loading state
//       if (modelLoaded && environmentLoaded && loading) {
//         setLoading(false);
//       }
//     };

//     animate();

//     // Cleanup
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       cancelAnimationFrame(animationFrameId);

//       if (gui) {
//         gui.destroy();
//       }

//       if (controls) {
//         controls.dispose();
//       }

//       if (renderer) {
//         renderer.dispose();
//       }

//       // Dispose textures
//       if (currentEnvironment) {
//         currentEnvironment.dispose();
//       }
//       gridTexture.dispose();

//       // Dispose materials
//       material.dispose();

//       // Dispose geometries
//       plane.geometry.dispose();
//     };
//   }, []);

//   return (
//     <div style={{ width: "100%", height: "100vh", position: "relative" }}>
//       <div
//         ref={containerRef}
//         style={{
//           width: "100%",
//           height: "100%",
//           position: "relative",
//           overflow: "hidden",
//           background: "#0d0e12",
//           cursor: "grab",
//         }}
//         onMouseDown={() => {
//           if (containerRef.current) {
//             containerRef.current.style.cursor = "grabbing";
//           }
//         }}
//         onMouseUp={() => {
//           if (containerRef.current) {
//             containerRef.current.style.cursor = "grab";
//           }
//         }}
//       />

//       <div
//         style={{
//           position: "absolute",
//           top: "10px",
//           left: "10px",
//           background: "rgba(0, 0, 0, 0.7)",
//           color: "white",
//           padding: "10px",
//           borderRadius: "5px",
//           zIndex: 100,
//           maxWidth: "300px",
//         }}
//       >
//         <h3 style={{ margin: "0 0 10px 0" }}>Three.js Environment Maps</h3>
//         <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
//           • <strong>Environment Maps</strong>: Provide realistic lighting and
//           reflections
//         </p>
//         <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
//           • <strong>Cube Maps</strong>: 6 images for skybox
//         </p>
//         <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
//           • <strong>HDR/EXR Maps</strong>: High dynamic range for realistic
//           lighting
//         </p>
//         <p style={{ margin: "0 0 5px 0", fontSize: "12px" }}>
//           • <strong>MeshPhysicalMaterial</strong>: Advanced PBR material with
//           transmission, iridescence, clearcoat
//         </p>
//         <p style={{ margin: "10px 0 0 0", fontSize: "12px", color: "#ffcc00" }}>
//           Try different environment maps and material properties →
//         </p>
//         <div style={{ marginTop: "10px", fontSize: "10px", color: "#aaa" }}>
//           Suzanne model with MeshPhysicalMaterial
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EnvironmentMaps;

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import Stats from "three/addons/libs/stats.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const EnvironmentMaps = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedHDR, setSelectedHDR] = useState("venice");

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear container
    containerRef.current.innerHTML = "";

    // Create scene
    const scene = new THREE.Scene();

    // Available HDR environments
    const hdrOptions = {
      rustig: "https://sbcode.net/img/rustig_koppie_puresky_1k.hdr",
      venice: "https://sbcode.net/img/venice_sunset_1k.hdr",
      spruit: "https://sbcode.net/img/spruit_sunrise_1k.hdr",
    };

    let environmentTexture: THREE.DataTexture;

    // Function to load HDR environment
    const loadHDR = (hdrType: string) => {
      const hdrUrl = hdrOptions[hdrType as keyof typeof hdrOptions];

      // Dispose previous texture if exists
      if (environmentTexture) {
        environmentTexture.dispose();
      }

      new RGBELoader().load(hdrUrl, (texture) => {
        environmentTexture = texture;
        environmentTexture.mapping = THREE.EquirectangularReflectionMapping;

        // Update scene environment and background if enabled
        if (data.environment) {
          scene.environment = environmentTexture;
        }
        if (data.background) {
          scene.background = environmentTexture;
        }

        scene.environmentIntensity = 1;
      });
    };

    // Load initial HDR
    loadHDR(selectedHDR);

    // Lights
    const directionallight = new THREE.DirectionalLight(0xebfeff, Math.PI);
    directionallight.position.set(1, 0.1, 1);
    directionallight.visible = false;
    scene.add(directionallight);

    const ambientLight = new THREE.AmbientLight(0xebfeff, Math.PI / 16);
    ambientLight.visible = false;
    scene.add(ambientLight);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(-2, 0.5, 2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

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

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Texture
    const texture = new THREE.TextureLoader().load(
      "https://sbcode.net/img/grid.png"
    );
    texture.colorSpace = THREE.SRGBColorSpace;

    // Material
    const material = new THREE.MeshPhysicalMaterial();
    material.side = THREE.DoubleSide;

    // Plane
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    plane.visible = false;
    scene.add(plane);

    // Load Suzanne model
    new GLTFLoader().load(
      "https://sbcode.net/models/suzanne_no_material.glb",
      (gltf) => {
        gltf.scene.traverse((child) => {
          (child as THREE.Mesh).material = material;
        });
        scene.add(gltf.scene);
      }
    );

    // GUI Data
    const data = {
      environment: true,
      background: true,
      mapEnabled: false,
      planeVisible: false,
      hdrType: selectedHDR,
    };

    // Create radio button container
    const radioContainer = document.createElement("div");
    radioContainer.style.position = "absolute";
    radioContainer.style.top = "10px";
    radioContainer.style.left = "10px";
    radioContainer.style.background = "rgba(0, 0, 0, 0.7)";
    radioContainer.style.color = "white";
    radioContainer.style.padding = "15px";
    radioContainer.style.borderRadius = "5px";
    radioContainer.style.zIndex = "100";
    radioContainer.style.display = "flex";
    radioContainer.style.flexDirection = "column";
    radioContainer.style.gap = "10px";

    const radioTitle = document.createElement("div");
    radioTitle.textContent = "HDR Environment Maps";
    radioTitle.style.fontWeight = "bold";
    radioTitle.style.marginBottom = "5px";
    radioContainer.appendChild(radioTitle);

    // Create radio buttons
    const hdrLabels = {
      rustig: "Rustig Koppie",
      venice: "Venice Sunset",
      spruit: "Spruit Sunrise",
    };

    Object.entries(hdrLabels).forEach(([value, label]) => {
      const radioWrapper = document.createElement("div");
      radioWrapper.style.display = "flex";
      radioWrapper.style.alignItems = "center";
      radioWrapper.style.gap = "8px";

      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "hdrSelection";
      radioInput.value = value;
      radioInput.id = `hdr-${value}`;
      radioInput.checked = value === selectedHDR;
      radioInput.style.cursor = "pointer";

      radioInput.addEventListener("change", () => {
        if (radioInput.checked) {
          data.hdrType = value;
          setSelectedHDR(value);
          loadHDR(value);

          // Update scene if environment/background are enabled
          if (data.environment) {
            scene.environment = environmentTexture;
          }
          if (data.background) {
            scene.background = environmentTexture;
          }
        }
      });

      const radioLabel = document.createElement("label");
      radioLabel.htmlFor = `hdr-${value}`;
      radioLabel.textContent = label;
      radioLabel.style.cursor = "pointer";
      radioLabel.style.fontSize = "14px";

      radioWrapper.appendChild(radioInput);
      radioWrapper.appendChild(radioLabel);
      radioContainer.appendChild(radioWrapper);
    });

    containerRef.current.appendChild(radioContainer);

    // GUI
    const gui = new GUI();
    gui.domElement.style.position = "absolute";
    gui.domElement.style.top = "0px";
    gui.domElement.style.right = "10px";
    gui.domElement.style.left = "auto";

    gui.add(data, "environment").onChange(() => {
      if (data.environment) {
        scene.environment = environmentTexture;
        directionallight.visible = false;
        ambientLight.visible = false;
      } else {
        scene.environment = null;
        directionallight.visible = true;
        ambientLight.visible = true;
      }
    });

    gui.add(scene, "environmentIntensity", 0, 2, 0.01);

    gui.add(renderer, "toneMappingExposure", 0, 2, 0.01);

    gui.add(data, "background").onChange(() => {
      if (data.background) {
        scene.background = environmentTexture;
      } else {
        scene.background = null;
      }
    });

    gui.add(scene, "backgroundBlurriness", 0, 1, 0.01);

    gui.add(data, "mapEnabled").onChange(() => {
      if (data.mapEnabled) {
        material.map = texture;
      } else {
        material.map = null;
      }
      material.needsUpdate = true;
    });

    gui.add(data, "planeVisible").onChange((v: boolean) => {
      plane.visible = v;
    });

    const materialFolder = gui.addFolder("meshPhysicalMaterial");
    materialFolder
      .add(material, "envMapIntensity", 0, 1.0, 0.01)
      .onChange(() => {
        if (!material.envMap) {
          material.envMap = scene.environment;
        }
      });
    materialFolder.add(material, "roughness", 0, 1.0, 0.01);
    materialFolder.add(material, "metalness", 0, 1.0, 0.01);
    materialFolder.add(material, "clearcoat", 0, 1.0, 0.01);
    materialFolder.add(material, "iridescence", 0, 1.0, 0.01);
    materialFolder.add(material, "transmission", 0, 1.0, 0.01);
    materialFolder.add(material, "thickness", 0, 10.0, 0.01);
    materialFolder.add(material, "ior", 1.0, 2.333, 0.01);
    materialFolder.close();

    // Stats
    const stats = new Stats();
    stats.dom.style.position = "absolute";
    stats.dom.style.top = "0px";
    stats.dom.style.right = "320px";
    containerRef.current.appendChild(stats.dom);

    // Animation
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

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

      // Dispose textures
      if (environmentTexture) {
        environmentTexture.dispose();
      }
      texture.dispose();

      // Dispose materials
      material.dispose();

      // Dispose geometries
      plane.geometry.dispose();
    };
  }, [selectedHDR]);

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
        }}
      />
    </div>
  );
};

export default EnvironmentMaps;
