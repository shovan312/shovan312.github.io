//@ts-ignore
import * as THREE from './three/build/three.module.js';
//@ts-ignore
import { OrbitControls } from "./three/examples/jsm/controls/OrbitControls.js";
//@ts-ignore
import { FontLoader } from "./three/examples/jsm/loaders/FontLoader.js";
//@ts-ignore
import { OBJLoader } from "./three/examples/jsm/loaders/OBJLoader.js";
// //@ts-ignore
// import {FBXLoader} from "./three/examples/jsm/loaders/FBXLoader";
//@ts-ignore
import { TextGeometry } from "./three/examples/jsm/geometries/TextGeometry.js";
import { getBallPoints, getCube, getGeometryPoints, getPointMeshArr } from './points.js';
//@ts-ignore
import { MathUtils } from './three/build/three.module.js';
import { morph, rearrangeArr, byR } from './transformations.js';
let container, camera, renderer, controls, sliderPos = 0;
container = document.querySelector('.container');
// Scene and Camera Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
const scene2 = new THREE.Scene();
scene2.background = new THREE.Color(0x111111);
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;
controls = new OrbitControls(camera, container);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight.clone());
scene2.add(ambientLight.clone());
const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(5, 5, 5);
scene.add(pointLight.clone());
scene2.add(pointLight.clone());
initSlider();
// Renderer
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setScissorTest(true);
document.body.appendChild(renderer.domElement);
const clock = new THREE.Clock();
function isMobile() {
    return /Mobi|Android|iPhone/i.test(navigator.userAgent);
}
const manager = new THREE.LoadingManager();
manager.onProgress = function () {
    document.getElementsByClassName('dialog-content')[0].innerHTML = "Loading...";
};
manager.onLoad = function () {
    const dialogText = isMobile() ? "Double tap" : "Press space";
    document.getElementsByClassName('dialog-content')[0].innerHTML = dialogText;
};
// Rectangular Monochrome Color Band
const bandGeometry = new THREE.PlaneGeometry(7.5, 1.5);
const bandMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }); // Monochrome color (grey)
const colorBand = new THREE.Mesh(bandGeometry, bandMaterial);
colorBand.position.y += 2;
scene.add(colorBand);
const band1Geometry = new THREE.BoxGeometry(1.5, 1.5, 0.2);
const band1Material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }); // Monochrome color (grey)
const band1 = new THREE.Mesh(band1Geometry, band1Material);
band1.name = "1";
colorBand.add(band1);
band1.position.x -= 3;
band1.position.z += 0.01;
const band2Geometry = new THREE.BoxGeometry(1.5, 1.5, 0.2);
const band2Material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide }); // Monochrome color (grey)
const band2 = new THREE.Mesh(band2Geometry, band2Material);
band2.name = "2";
band1.add(band2);
band2.position.x = 3 / 2;
const band3Geometry = new THREE.BoxGeometry(1.5, 1.5, 0.2);
const band3Material = new THREE.MeshBasicMaterial({ color: 0x666666, side: THREE.DoubleSide }); // Monochrome color (grey)
const band3 = new THREE.Mesh(band3Geometry, band3Material);
band3.name = "3";
band2.add(band3);
band3.position.x = 3 / 2;
const band4Geometry = new THREE.BoxGeometry(1.5, 1.5, 0.2);
const band4Material = new THREE.MeshBasicMaterial({ color: 0x999999, side: THREE.DoubleSide }); // Monochrome color (grey)
const band4 = new THREE.Mesh(band4Geometry, band4Material);
band4.name = "4";
band3.add(band4);
band4.position.x = 3 / 2;
const band5Geometry = new THREE.BoxGeometry(1.5, 1.5, 0.2);
const band5Material = new THREE.MeshBasicMaterial({ color: 0xbbbbbb, side: THREE.DoubleSide }); // Monochrome color (grey)
const band5 = new THREE.Mesh(band5Geometry, band5Material);
band5.name = "5";
band4.add(band5);
band5.position.x = 3 / 2;
///////
const loader = new FontLoader(manager);
let textMesh1 = new THREE.Mesh();
let textMesh2 = new THREE.Mesh();
loader.load('./dist/fonts/droid/droid_sans_bold.typeface.json', function (response) {
    let font = response;
    let textGeo = new TextGeometry("welcome", {
        font: font,
        size: 200,
        depth: 5,
        curveSegments: 20,
        bevelThickness: 2,
        bevelSize: 3,
        bevelEnabled: true
    });
    textGeo.scale(0.01, 0.01, 0.01);
    textMesh1 = new THREE.Mesh(textGeo, new THREE.MeshBasicMaterial({ color: 0x999999, side: THREE.DoubleSide }));
    textMesh1.position.y += 4;
    textMesh1.position.x -= 5.9;
    scene.add(textMesh1);
    textMesh2 = new THREE.Mesh(textGeo, new THREE.MeshBasicMaterial({ color: 0x00ee00, side: THREE.DoubleSide, wireframe: false }));
    textMesh2.position.y += 4;
    textMesh2.position.x -= 5.9;
    scene2.add(textMesh2);
});
const objLoader = new OBJLoader(manager);
function loadObj(path) {
    return new Promise(function (resolve, reject) {
        var progress = undefined;
        objLoader.load(path, resolve, progress, reject);
    });
}
let handObj = await loadObj('./dist/obj/72-rigged_hand_obj/base.obj');
const objMesh = handObj.children[0];
const mat = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, wireframe: true });
objMesh.material = mat;
objMesh.geometry.center();
objMesh.geometry.scale(7, 7, 7);
objMesh.geometry.rotateZ(-Math.PI / 2);
objMesh.geometry.rotateX(-Math.PI / 2);
objMesh.geometry.rotateY(Math.PI / 2);
objMesh.geometry.translate(0, -4, 0);
scene.add(objMesh.clone());
scene2.add(objMesh.clone());
let catObj = await loadObj('./dist/obj/72-rigged_hand_obj/Cat.obj');
const catMesh = catObj.children[0];
catMesh.geometry.center();
catMesh.geometry.rotateX(-Math.PI / 2);
catMesh.geometry.rotateY(Math.PI / 2);
catMesh.geometry.translate(-5, -10, 0);
catMesh.geometry.scale(0.1, 0.1, 0.1);
// const cubePoints = getCube(20, new THREE.Vector3(0, 0, (-20 / 2)*3), new THREE.Vector3(3, 3, 3));
const cubePoints = getCube(20, new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 3, 3));
cubePoints.posArray = rearrangeArr(cubePoints.posArray, byR);
const ballPoints = getBallPoints(20, 1);
ballPoints.posArray = rearrangeArr(ballPoints.posArray, byR);
const catPoints = getGeometryPoints(catMesh.geometry);
catPoints.posArray = rearrangeArr(catPoints.posArray, byR);
const pointsMesh = getPointMeshArr(cubePoints.posArray, 0.01);
scene.add(pointsMesh);
const pointsMesh2 = getPointMeshArr(cubePoints.posArray, 0.01);
pointsMesh2.geometry.setAttribute('color', new THREE.Float32BufferAttribute(cubePoints.colors, 3));
scene2.add(pointsMesh2);
const cube1 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ color: 0xee0000 }));
const cube2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ color: 0xee00ee }));
const cube3 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ color: 0x0000ee }));
const cube4 = new THREE.Mesh(new THREE.IcosahedronGeometry(2), new THREE.MeshBasicMaterial({ wireframe: true, color: 0x00ee00 }));
const cube5 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial({ color: 0xeeee00 }));
cube1.name = "1";
cube2.name = "2";
cube3.name = "3";
cube4.name = "4";
cube5.name = "5";
scene2.add(cube1);
scene2.add(cube2);
scene2.add(cube3);
scene2.add(cube4);
scene2.add(cube5);
// Handle Window Resizing
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
// Create raycaster and mouse vector
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
// Set up a mouse move event listener
window.addEventListener('mousemove', onMouseMove, false);
const tooltip = document.getElementById('tooltip');
function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    tooltip.style.left = event.clientX + 10 + 'px'; // Offset for better visibility
    tooltip.style.top = event.clientY + 10 + 'px';
    tooltip.style.display = 'none';
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        intersects = intersects.filter((x) => !x.object.isPoints);
    }
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.name == "1") {
            tooltip.style.display = 'block';
            tooltip.innerText = "Blog";
        }
        else if (intersectedObject.name == "2") {
            tooltip.style.display = 'block';
            tooltip.innerText = "Improv";
        }
        else if (intersectedObject.name == "3") {
            tooltip.style.display = 'block';
            tooltip.innerText = "Instagram";
        }
        else if (intersectedObject.name == "4") {
            tooltip.style.display = 'block';
            tooltip.innerText = "Resume";
        }
        else if (intersectedObject.name == "5") {
            tooltip.style.display = 'block';
            tooltip.innerText = "Art Gallery";
        }
        // console.log('Clicked on:', intersectedObject);
    }
}
window.addEventListener('click', onClick, false);
function onClick(event) {
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        intersects = intersects.filter((x) => !x.object.isPoints);
    }
    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.name == "1") {
            let url = "https://shovan312.github.io/blog";
            window.open(url, '_blank');
        }
        else if (intersectedObject.name == "2") {
            let url = "https://shovan312.github.io/improv";
            window.open(url, '_blank');
        }
        else if (intersectedObject.name == "3") {
            let url = "https://www.instagram.com/binary_brushwork/";
            window.open(url, '_blank');
        }
        else if (intersectedObject.name == "4") {
            let url = "https://shovan312.github.io/dist/resume.pdf";
            window.open(url, '_blank');
        }
        else if (intersectedObject.name == "5") {
            let url = "https://shovan312.github.io/gallery";
            window.open(url, '_blank');
        }
        // console.log('Clicked on:', intersectedObject);
    }
}
let spacePressed = false;
let isUserAnimDone = true;
let animStartedAt = 0;
let animIndex = 0;
document.addEventListener('keydown', (e) => keyPressed(e));
function keyPressed(e) {
    if (e.code === "Space") {
        if (isUserAnimDone) {
            document.getElementsByClassName('dialog-content')[0].style.display = "none";
            spacePressed = true;
            animStartedAt = Date.now();
            isUserAnimDone = false;
        }
    }
}
// Animation Loop
function animate() {
    let time = clock.getElapsedTime();
    requestAnimationFrame(animate);
    if (time < 10) {
        camera.position.z = MathUtils.clamp(3 + time, 3, 10);
    }
    pointsMesh.material.size = MathUtils.clamp(0.04 + 0.01 * Math.sin(time), 0.04, 0.05);
    objMesh.geometry.rotateY(0.001);
    objMesh.position.y += 0.001 * Math.sin(time);
    scene.rotateY(-0.0002 * Math.cos(time * 0.7));
    scene2.rotateY(-0.0002 * Math.cos(time * 0.7));
    if (spacePressed) {
        let morphParam = MathUtils.clamp((Date.now() - animStartedAt) / 7000, 0, 1);
        if (animIndex == 0) {
            const cube2cat = morph(cubePoints.posArray, catPoints.posArray, morphParam);
            pointsMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(cube2cat, 3));
        }
        else if (animIndex == 1) {
            const cat2ball = morph(catPoints.posArray, ballPoints.posArray, morphParam);
            pointsMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(cat2ball, 3));
        }
        else if (animIndex == 2) {
            const ball2cube = morph(ballPoints.posArray, cubePoints.posArray, morphParam);
            pointsMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(ball2cube, 3));
        }
        if (morphParam == 1) {
            isUserAnimDone = true;
            spacePressed = false;
            animIndex = (animIndex + 1) % 3;
        }
    }
    if (isUserAnimDone) {
        textMesh1.visible = true;
        colorBand.visible = true;
    }
    else {
        textMesh1.visible = false;
        colorBand.visible = false;
    }
    cube1.position.set(10 * Math.sin(time), 2 * Math.cos(time), 0);
    cube2.position.set(2 * Math.sin(time), 10 * Math.sin(time), 0);
    cube3.position.set(0, 2 * Math.sin(time), 10 * Math.cos(time));
    cube4.rotateX(0.01);
    cube5.position.set(5 * Math.sin(time), 0, 5 * Math.cos(time));
    // Render the scene
    // renderer.render(scene, camera);
    renderer.setScissor(0, 0, sliderPos, window.innerHeight);
    renderer.render(scene2, camera);
    renderer.setScissor(sliderPos, 0, window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
}
animate();
function initSlider() {
    const slider = document.querySelector('.slider');
    function onPointerDown() {
        controls.enabled = false;
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
    }
    function onPointerUp() {
        controls.enabled = true;
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
    }
    function onPointerMove(e) {
        sliderPos = Math.max(0, Math.min(window.innerWidth, e.pageX));
        slider.style.left = sliderPos - (slider.offsetWidth / 2) + 'px';
    }
    slider.style.touchAction = 'none'; // disable touch scroll
    slider.addEventListener('pointerdown', onPointerDown);
}
let lastTouchTime = 0;
const doubleTouchThresholdMax = 300; // Time in milliseconds
const doubleTouchThresholdMin = 50; // Time in milliseconds
window.addEventListener('touchstart', function (event) {
    const currentTime = new Date().getTime();
    // Check if the time between the last touch and this one is within the threshold
    if (currentTime - lastTouchTime < doubleTouchThresholdMax && currentTime - lastTouchTime > doubleTouchThresholdMin) {
        if (isUserAnimDone) {
            document.getElementsByClassName('dialog-content')[0].style.display = "none";
            spacePressed = true;
            animStartedAt = Date.now();
            isUserAnimDone = false;
        }
    }
    // Update the last touch time
    lastTouchTime = currentTime;
});
