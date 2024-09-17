//@ts-ignore
import * as THREE from '../node_modules/three/build/three.module.js'
//@ts-ignore
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";

// Scene and Camera Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;


// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const orbitControls = new OrbitControls(camera, renderer.domElement)


// Light setup for a material design look (soft shadows and lighting)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Rectangular Monochrome Color Band
const bandGeometry = new THREE.PlaneGeometry(6, 1.5);
const bandMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Monochrome color (grey)
const colorBand = new THREE.Mesh(bandGeometry, bandMaterial);
scene.add(colorBand);

const band1Geometry = new THREE.PlaneGeometry(1.5, 1.5);
const band1Material = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Monochrome color (grey)
const band1 = new THREE.Mesh(band1Geometry, band1Material);
colorBand.add(band1);
band1.position.x -= 3
band1.position.z += 1

const band2Geometry = new THREE.PlaneGeometry(1.5, 1.5);
const band2Material = new THREE.MeshBasicMaterial({ color: 0x333333 }); // Monochrome color (grey)
const band2 = new THREE.Mesh(band2Geometry, band2Material);
band1.add(band2);
band2.position.x = 3/4
band2.position.z += 1

const band3Geometry = new THREE.PlaneGeometry(1.5, 1.5);
const band3Material = new THREE.MeshBasicMaterial({ color: 0x666666 }); // Monochrome color (grey)
const band3 = new THREE.Mesh(band3Geometry, band3Material);
band2.add(band3);
band3.position.x = 3/4
band3.position.z += 1


const band4Geometry = new THREE.PlaneGeometry(1.5, 1.5);
const band4Material = new THREE.MeshBasicMaterial({ color: 0x999999 }); // Monochrome color (grey)
const band4 = new THREE.Mesh(band4Geometry, band4Material);
band3.add(band4);
band4.position.x = 3/4
band4.position.z += 1


// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    // Render the scene
    renderer.render(scene, camera);
}

animate();

// Handle Window Resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})
/*
import * as THREE from '../node_modules/three/build/three.module.js'
import {OrbitControls} from "../node_modules/three/examples/jsm/controls/OrbitControls.js";
*/