//import { GLTFLoader } from 'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/loaders/GLTFLoader.js'

(function() {
    "use strict";

    var container;

    var camera, scene, renderer, composer, controls;

    var loader, mesh;

    var light1, light2, light3, light4;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    //animate();

    function init() {
        var hero = document.getElementById("hero");
        var container = document.createElement("div");
        container.className = "hero__three-container";
        hero.appendChild( container );

        // camera
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1500 );
        camera.position.z = 400;

        // scene
        scene = new THREE.Scene();

        // light
        var light = new THREE.AmbientLight( 0x959595, .01 );
        scene.add( light );

        light1 = new THREE.PointLight( 0xffffff, .15, 0, Math.PI / 2, 1  );
        light1.position.set(0, -80, 500);
        scene.add( light1 );
        light2 = new THREE.PointLight( 0xffffff, .35, 0, Math.PI / 2, 1  );
        light2.position.set(0, 500, 0);
        scene.add( light2 );
        light3 = new THREE.PointLight( 0xffffff, .32, 0, Math.PI / 2, 1  );
        light3.position.set(-500, 0, 10);
        scene.add( light3 );
        light4 = new THREE.PointLight( 0xffffff, .2, 0, Math.PI / 2, 1  );
        light4.position.set(500, 0, 10);
        scene.add( light4 );

        
        // objects
        //loader = new THREE.JSONLoader();
        var loader = new THREE.GLTFLoader();
        /*loader.load( '3d/deer.js', function ( geometry ) {
            mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial( { color: 0xffffff, overdraw: 0.5 } ) );
            mesh.position.y = 20;
            mesh.scale.set(2.9,2.9,2.9);
            scene.add( mesh );
        } );*/

        // Load a glTF resource
        loader.load(
	        // resource URL
	        'https://cdn.jsdelivr.net/gh/siouxcitizen/3DModel@a1c2e47550ca20de421f6d779229f66efab07830/yuusha.gltf',
	        // called when the resource is loaded
	        function ( gltf ) {

                mesh = gltf.scene;
                mesh.scale.set( 10, 10, 10 );
                scene.add( mesh );

                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // THREE.Group
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object

            },
	        // called while loading is progressing
	        function ( xhr ) {

		    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            console.log(xhr.loaded);
            console.log(xhr.total);

	        },
	        // called when loading has errors
	        function ( error ) {

	        	console.log( 'An error happened' );

	        });

        //
        renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.setClearColor( 0x000000, 0 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.gammaOutput = true;
        container.appendChild( renderer.domElement );

        //
        //document.addEventListener( "mousemove", onDocumentMouseMove, false );
        //window.addEventListener( "resize", onWindowResize, false );
    }

    function onDocumentMouseMove( event ) {
        mouseX = ( event.clientX - windowHalfX ) / 4;
        mouseY = ( event.clientY - windowHalfY ) / 4;
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

        camera.position.x += ( -mouseX - camera.position.x ) * .03;
        camera.position.y += ( mouseY - 80 - camera.position.y ) * .03;

        requestAnimationFrame( animate );

        render();

    }

    function render() {
        
        camera.lookAt( scene.position );
        renderer.render( scene, camera );

    }

})();
