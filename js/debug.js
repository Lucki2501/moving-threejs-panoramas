"use strict";
import * as THREE from 'three';
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js'

var sky_sphere,ocean_sphere,
    camera,scene,renderer,
    element = document.getElementById('demo'),
    onPointerDownPointerX=0,
    onPointerDownPointerY=0,
    onPointerDownLon=0,
    onPointerDownLat=0,
    fov = 70,
    isUserInteracting = false,
    lon = 0,
    lat = 0,
    phi = 0,
    theta = 0,
    onMouseDownMouseX = 0,
    onMouseDownMouseY = 0,
    onMouseDownLon = 0,
    onMouseDownLat = 0,
    width = 1440, // int || window.innerWidth
    height = 650, // int || window.innerHeight
    ratio = width / height;

var ocean = new THREE.TextureLoader().load('assets/ocean-test2.png')
var oceanAlpha = new THREE.TextureLoader().load('assets/ocean-alpha-2.png')
var sky = new THREE.TextureLoader().load('assets/skybox1.jpg')

const video = document.getElementById( 'video' );
video.play();

const oceanVideo = new THREE.VideoTexture( video );
oceanVideo.format = THREE.RGBAFormat;

const oceanMaskVideo = document.getElementById( 'video2' );
oceanMaskVideo.play();


function init() {
    camera = new THREE.PerspectiveCamera(fov, ratio, 1, 1000);
    scene = new THREE.Scene();

    const controls = new PointerLockControls( camera, document.body );
    
    sky_sphere = new THREE.Mesh(new THREE.SphereGeometry(700, 60, 40).scale( - 1, 1, 1 ), new THREE.MeshBasicMaterial({map: sky}));
    scene.add(sky_sphere);
    
    // Flat texture
    // ocean_sphere = new THREE.Mesh(new THREE.SphereGeometry(600, 60, 40).scale( - 1, 1, 1 ), new THREE.MeshBasicMaterial({map: ocean, alphaMap:oceanAlpha, transparent:true}));
    // scene.add(ocean_sphere);

    // Video texture and flat alpha
    ocean_sphere = new THREE.Mesh(new THREE.SphereGeometry(600, 60, 40).scale( - 1, 1, 1 ), new THREE.MeshBasicMaterial({map: oceanVideo, alphaMap:oceanAlpha, transparent:true}));
    scene.add(ocean_sphere);

    // Video texture and video alpha
    // ???


    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(width, height);
    renderer.setAnimationLoop( animate );
    element.appendChild(renderer.domElement);
    element.addEventListener('click', onDocumentMouseDown, false);
    onWindowResized(null);
}


function onWindowResized(event) {
    renderer.setSize(width, height);
    camera.updateProjectionMatrix();
}


function onDocumentMouseDown(event) {
    event.preventDefault();
    element.addEventListener('mousemove', onDocumentMouseMove, false);
}


function onDocumentMouseMove(event) {
    onPointerDownPointerX = event.clientX;
    onPointerDownPointerY = event.clientY;
    onPointerDownLon = lon;
    onPointerDownLat = lat
    isUserInteracting = true;
    lon = ( onPointerDownPointerX + event.clientX ) * 0.1;
    lat = ( event.clientY + onPointerDownPointerY ) * 0.1;

}


function animate() {
    requestAnimationFrame(animate);
    sky_sphere.rotation.x += 0.000001
    sky_sphere.rotation.y += 0.000001
    ocean_sphere.rotation.y += 0.000001
    render();
}


function render() {
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.MathUtils.degToRad(90 - lat);
    theta = THREE.MathUtils.degToRad(lon);
    camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
    camera.position.y = 100 * Math.cos(phi);
    camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);
    
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}


setTimeout(() => {
  init();animate()
}, 1000);
