/**
 *  escenaBasica.js
 * 
 *  Seminario GP2: Escena basica con geometrias predefinidas, transformaciones y objetos importados
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js";
import {GLTFLoader} from "../lib/GLTFLoader.module.js";

// Variables de consenso
let renderer, scene, camera;

// Otras globales
let esferaCubo;
let angulo = 0;

// Acciones
init();
loadScene();
render();

function init()
{
    // Instanciar el motor
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById( "container" ).appendChild( renderer.domElement ); // esto es el canvas

    // Instanciar la escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5, 0.5, 0.5);

    // Instanciar la camara
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 100);
    camera.position.set(0.5, 2, 7);
    camera.lookAt(0, 1, 0);
}

function loadScene();
{
    const material = new THREE.MeshBasicMaterial( {color: "yellow", wireframe: true} );

    // Suelo
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(10, 10, 10, 10), material );
    suelo.rotation.x = -Math.PI/2;
    scene.add(suelo);
}

function render()
{
    requestAnimationFrame(render);
    renderer.render(scene,camera);
}