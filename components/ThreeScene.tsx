import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AppMode, ModelType, PartSelection } from '../types';

interface ThreeSceneProps {
    mode: AppMode;
    modelType: ModelType;
    onPartClick: (part: PartSelection) => void;
}

export const ThreeScene: React.FC<ThreeSceneProps> = ({ mode, modelType, onPartClick }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const mainObjectRef = useRef<THREE.Group | null>(null);
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const requestRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(5, 4, 6);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        rendererRef.current = renderer;
        container.appendChild(renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
        dirLight.position.set(5, 10, 7);
        dirLight.castShadow = true;
        scene.add(dirLight);

        const orangeLight = new THREE.PointLight(0xFF6600, 0.5, 10);
        orangeLight.position.set(-2, 2, -2);
        scene.add(orangeLight);

        const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
        gridHelper.position.y = -2;
        scene.add(gridHelper);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controlsRef.current = controls;

        const onDoubleClick = (event: MouseEvent) => {
            if (!rendererRef.current || !cameraRef.current) return;
            
            const rect = rendererRef.current.domElement.getBoundingClientRect();
            mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.current.setFromCamera(mouse.current, cameraRef.current);
            
            if (mainObjectRef.current) {
                const intersects = raycaster.current.intersectObjects(mainObjectRef.current.children);
                if (intersects.length > 0) {
                    const object = intersects[0].object as THREE.Mesh;
                    const oldHex = (object.material as THREE.MeshStandardMaterial).color.getHex();
                    
                    // Flash effect
                    (object.material as THREE.MeshStandardMaterial).color.setHex(0xFFFFFF);
                    setTimeout(() => {
                        (object.material as THREE.MeshStandardMaterial).color.setHex(oldHex);
                    }, 150);

                    if (onPartClick) {
                        onPartClick({
                            name: object.name || 'Componente Desconhecido',
                            timestamp: Date.now()
                        });
                    }
                }
            }
        };

        renderer.domElement.addEventListener('dblclick', onDoubleClick);

        const animate = () => {
            requestRef.current = requestAnimationFrame(animate);
            if (controlsRef.current) controlsRef.current.update();
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();

        const handleResize = () => {
            if (!container || !cameraRef.current || !rendererRef.current) return;
            cameraRef.current.aspect = container.clientWidth / container.clientHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(container.clientWidth, container.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(requestRef.current);
            window.removeEventListener('resize', handleResize);
            if (rendererRef.current) {
                rendererRef.current.domElement.removeEventListener('dblclick', onDoubleClick);
                if (rendererRef.current.domElement.parentElement) {
                    rendererRef.current.domElement.parentElement.removeChild(rendererRef.current.domElement);
                }
                rendererRef.current.dispose();
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Rebuild Model when type changes
    useEffect(() => {
        if (!sceneRef.current) return;

        const scene = sceneRef.current;
        const objName = "MainObject";
        const existing = scene.getObjectByName(objName);
        if (existing) scene.remove(existing);

        const mainObject = new THREE.Group();
        mainObject.name = objName;
        mainObjectRef.current = mainObject;

        const STARA_ORANGE = 0xFF6600;
        const materialMain = new THREE.MeshStandardMaterial({ color: STARA_ORANGE, roughness: 0.3, metalness: 0.6 });
        const materialDark = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.7, metalness: 0.2 });

        if (modelType === 'gear') {
            // GEAR MODEL
            const disk = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 32), materialMain);
            disk.rotation.x = Math.PI / 2;
            disk.castShadow = true;
            disk.name = "Disco de Fricção";
            mainObject.add(disk);

            const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 16), materialDark);
            axle.rotation.x = Math.PI / 2;
            axle.name = "Eixo Principal";
            mainObject.add(axle);

            const toothGeo = new THREE.BoxGeometry(0.6, 0.6, 0.5);
            for(let i=0; i<12; i++) {
                const angle = (i / 12) * Math.PI * 2;
                const tooth = new THREE.Mesh(toothGeo, materialMain);
                tooth.position.set(Math.cos(angle) * 2.1, Math.sin(angle) * 2.1, 0);
                tooth.rotation.z = angle;
                tooth.castShadow = true;
                tooth.name = `Dente da Engrenagem #${i+1}`;
                mainObject.add(tooth);
            }
        } else {
            // PUMP MODULE (Default)
            const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 4, 32), materialMain);
            cylinder.rotation.z = Math.PI / 2;
            cylinder.castShadow = true; cylinder.receiveShadow = true;
            cylinder.name = "Cilindro de Pressão";
            mainObject.add(cylinder);

            const boxGeo = new THREE.BoxGeometry(1.5, 2.5, 2.5);
            const boxLeft = new THREE.Mesh(boxGeo, materialMain);
            boxLeft.position.x = -2; boxLeft.castShadow = true;
            boxLeft.name = "Câmara de Entrada";
            mainObject.add(boxLeft);

            const boxRight = new THREE.Mesh(boxGeo, materialMain);
            boxRight.position.x = 2; boxRight.castShadow = true;
            boxRight.name = "Câmara de Saída";
            mainObject.add(boxRight);

            const boltGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
            const createBolts = (xPos: number) => {
                const positions = [[0.8, 0.8], [0.8, -0.8], [-0.8, 0.8], [-0.8, -0.8]];
                positions.forEach((pos, idx) => {
                    const bolt = new THREE.Mesh(boltGeo, materialDark);
                    bolt.rotation.z = Math.PI / 2;
                    bolt.position.set(xPos > 0 ? xPos + 0.8 : xPos - 0.8, pos[0], pos[1]);
                    bolt.name = `Parafuso de Fixação ${xPos > 0 ? 'Dir' : 'Esq'} #${idx+1}`;
                    mainObject.add(bolt);
                });
            };
            createBolts(2); createBolts(-2);
        }

        scene.add(mainObject);

    }, [modelType]);

    return (
        <div id="canvas-container" ref={containerRef} className="w-full h-full relative cursor-default" style={{ background: 'radial-gradient(circle at center, #2d3748 0%, #111827 80%)' }}>
        </div>
    );
};