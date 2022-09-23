/**
 * Practica2.js
 * 
 * Seminario GPC #2. Practica 2: construir un brazo robotico
 * Autor: Juan Felipe Jaramillo Hernandez
 */

// Modulos necesarios
import * as THREE from "../lib/three.module.js";

// Variables de consenso
let renderer, scene, camera;

// Otras globales
let robot;
let brazo;
let antebrazo;
let mano;
let pinzaIz;
let pinzaDe;

let angulo = 0;
let angulo_restringido = 0;
let translacion = 0;

let aux1 = 0;
let aux2 = 0;

// Acciones
init();
loadScene();
render();

function init()
{
    // Instanciar el motor
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.getElementById('container').appendChild( renderer.domElement );

    // Instanciar la escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0.5,0.5,0.5);

    // Instanciar la camara
    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,500);
    camera.position.set(120,220,100);
    camera.lookAt(0,130,0);
}

function loadScene()
{
    const m_material = new THREE.MeshBasicMaterial( {color:'green', wireframe: true} );
    const s_material = new THREE.MeshBasicMaterial( {color:'blue', wireframe: true} );
    const material = new THREE.MeshBasicMaterial( {color:'red', wireframe: true} );

    // Suelo
    const suelo = new THREE.Mesh( new THREE.PlaneGeometry(1000,1000, 50,50), new THREE.MeshBasicMaterial( {color:'black', wireframe: true} ) );
    suelo.rotation.x = -Math.PI/2;
    scene.add(suelo);

    /////// Base - r=50 h=15
    const base = new THREE.Mesh( new THREE.CylinderGeometry(50,50, 15, 30,1), new THREE.MeshBasicMaterial( {color:'yellow', wireframe: true} ) );

    /////// Brazo - esparrago -> eje -> rotula
    // esparrago - r=20 h=18
    const esparrago = new THREE.Mesh( new THREE.CylinderGeometry(20,20, 18, 15,1), material );
    esparrago.rotation.x = -Math.PI/2;

    // eje - w=18 h=120 depth=12
    const eje = new THREE.Mesh( new THREE.BoxGeometry(18, 120, 12), material );
    eje.position.y = 60;

    // rotula - r=20
    const rotula = new THREE.Mesh( new THREE.SphereGeometry(20, 20, 10) , material );
    rotula.position.y = 120;

    // ensamble del brazo
    brazo = new THREE.Object3D();
    brazo.add( esparrago );
    brazo.add( eje );
    brazo.add( rotula );

    /////// Antebrazo - disco -> nervios -> mano
    // disco - r=22 h=16
    const disco = new THREE.Mesh( new THREE.CylinderGeometry(22,22, 6, 20,1), s_material );
    
    // nervios - w=4 h=80 depth=4
    const nervios1 = new THREE.Mesh( new THREE.BoxGeometry(4, 80, 4), s_material );
    const nervios2 = nervios1.clone();
    const nervios3 = nervios1.clone();
    const nervios4 = nervios1.clone();
    nervios1.position.set(6, 40, 6);
    nervios2.position.set(-6, 40, 6);
    nervios3.position.set(6, 40, -6);
    nervios4.position.set(-6, 40, -6);
    
    // ensamble del antebrazo
    antebrazo = new THREE.Object3D();
    antebrazo.add( disco );
    antebrazo.add( nervios1 );
    antebrazo.add( nervios2 );
    antebrazo.add( nervios3 );
    antebrazo.add( nervios4 );
    antebrazo.position.set( 0.0, 120, 0 );
    
    /////// Mano
    // muneca - r=15 h=40
    const muneca = new THREE.Mesh( new THREE.CylinderGeometry(15,15, 40, 15,1), m_material );
    muneca.rotation.x = -Math.PI/2;

    //// Pinza derecho
    // paralelepipedo - w=19 h=20 depth=4
    const paralelepipedoDe = new THREE.Mesh( new THREE.BoxGeometry(19, 20, 4), m_material );
 
    // pinza - w=19 h_init=20, depth_init=4, h_end=15, depth_end=2
    const malla_dedoDe = new THREE.BufferGeometry();
    const coordenadas = [ // 8vert x3coor x,y,z = 24float
        -9.5, -10, 2,
        9.5, -7.5, 2,
        9.5, 7.5, 2,
        -9.5, 10, 2,
        -9.5, 10, -2,
        9.5, 7.5, 0,
        9.5, -7.5, 0,
        -9.5, -10, -2
    ];
    const indices = [ // 6caras x 2triangulos x3vertices = 36
        0,3,7, 
        7,3,4, 
        0,1,2,
        0,2,3, 
        4,3,2, 
        4,2,5,
        6,7,4, 
        6,4,5, 
        1,5,2,
        1,6,5, 
        7,6,1, 
        7,1,0     
    ];
    const normales = [ // 8vert x3 noramles x3coor x,y,z = 72float
        1,0,0,
        0,1,0,
        0,0,1,
        1,0,0,
        0,1,0,
        0,0,1,
        1,0,0,
        0,1,0,
        0,0,1,
        1,0,0,
        0,1,0,
        0,0,1,
        1,0,0,
        0,1,0,
        0,0,1,
        1,0,0,
        0,1,0,
        0,0,1,
        1,0,0,
        0,1,0,
        0,0,1,
        1,0,0,
        0,1,0,
        0,0,1,     
    ]
    malla_dedoDe.setIndex( indices );
    malla_dedoDe.setAttribute( 'position', new THREE.Float32BufferAttribute(coordenadas,3));
    malla_dedoDe.setAttribute( 'normal', new THREE.Float32BufferAttribute(normales,9));
    malla_dedoDe.computeVertexNormals();

    const dedoDe = new THREE.Mesh( malla_dedoDe, m_material );
    dedoDe.position.x = 19;

    // ensamble de la pinza derecha
    pinzaDe = new THREE.Object3D();
    pinzaDe.add( paralelepipedoDe );
    pinzaDe.add( dedoDe );
    pinzaDe.position.set( 10, 0.0, -10 );

    //// Dedo izquierdo
    const dedoIz = dedoDe.clone();
    dedoIz.applyMatrix4(new THREE.Matrix4().makeScale(1, 1, -1));
    const paralelepipedoIz = paralelepipedoDe.clone();

    // ensamble de la pinza izquierda
    pinzaIz = new THREE.Object3D();
    pinzaIz.add( paralelepipedoIz );
    pinzaIz.add( dedoIz );
    pinzaIz.position.set( 10, 0.0, 10 );

    // ensamble de la mano
    mano = new THREE.Object3D();
    mano.add( muneca );
    mano.add( pinzaDe );
    mano.add( pinzaIz );
    mano.position.set( 0.0, 80, 0 );

    // ensamble del brazo robotico
    antebrazo.add( mano );
    brazo.add( antebrazo );
    robot = new THREE.Object3D();
    robot.add( brazo );
    robot.add( base );
    robot.position.y = 1.5;
 
    // clonacion del brazo estatico
    const robot_static = robot.clone();

    robot.position.set(-250, 1.5, 0);
    scene.add(robot);
    scene.add(robot_static);
    scene.add( new THREE.AxesHelper(220) );
}

function update()
{
    angulo += 0.01;

    if(aux1 == 0)
    {
        angulo_restringido += 0.01;
    }
    else
    {
        angulo_restringido -= 0.01;
    }

    if(aux2 == 0)
    {
        translacion += 0.1;
    }
    else
    {
        translacion -= 0.1;
    }

    robot.rotation.y = angulo;
    brazo.rotation.z = angulo_restringido; // limitar entre 0 y pi/3
    antebrazo.rotation.y = angulo;
    antebrazo.rotation.z = angulo_restringido;
    mano.rotation.z = angulo_restringido;
    pinzaIz.position.z = translacion;
    pinzaDe.position.z = -1*translacion;

    if(angulo_restringido > Math.PI/3)
    {
        aux1 = 1;
    }
    else if(angulo_restringido < -Math.PI/3)
    {
        aux1 = 0;
    }

    if(translacion > 15)
    {
        aux2 = 1;
    }
    else if(translacion < 2)
    {
        aux2 = 0;
    }
}

function render()
{
    requestAnimationFrame(render);
    update();
    renderer.render(scene,camera);
}