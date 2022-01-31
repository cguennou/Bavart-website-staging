//import { GLTFLoader } from 'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/loaders/GLTFLoader.js'

(function() {
    "use strict";

    var container;
    var camera, scene, renderer, composer, controls, clock, mixer;
    var loader, mesh, controls;
    var light1, light2, light3, light4, light;
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    init();
    animate();

    function init() {
        var hero = document.getElementById("hero");
        var container = document.createElement("div");
        container.className = "hero__three-container";
        hero.appendChild( container );

        // camera
        camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 2, 1500 );
        camera.position.z = 300;

        // scene
        scene = new THREE.Scene();
        clock = new THREE.Clock();

        // light
        var lightAmb = new THREE.AmbientLight( 0x959595, .01 );
        lightAmb.castShadow = true;
        scene.add( lightAmb );

        light1 = new THREE.PointLight( 0xffffff, .15, 0, Math.PI / 2, 1  );
        light1.position.set(0, -80, 500);
        light1.castShadow = true;
        light1.shadowDarkness = 0.5;
        scene.add( light1 );
        light2 = new THREE.PointLight( 0xffffff, .35, 0, Math.PI / 2, 1  );
        light2.position.set(0, 500, 0);
        light2.castShadow = true;
        light2.shadowDarkness = 0.5;
        scene.add( light2 );
        light3 = new THREE.PointLight( 0xffffff, .32, 0, Math.PI / 2, 1  );
        light3.position.set(-500, 0, 10);
        light3.castShadow = true;
        light3.shadowDarkness = 0.5;
        scene.add( light3 );
        light4 = new THREE.PointLight( 0xffffff, .2, 0, Math.PI / 2, 1  );
        light4.position.set(500, 0, 10);
        light4.castShadow = true;
        light4.shadowDarkness = 0.5;
        scene.add( light4 );

        var ambientLight = new THREE.AmbientLight( 0xcccccc );
        ambientLight.castShadow = true;
        scene.add( ambientLight );

        var loader = new THREE.GLTFLoader();

        // Load a glTF resource
        loader.load(
	        // resource URL
	        '3d/GirlBuste/scene.gltf',
	        // called when the resource is loaded
	        function ( gltf ) {

                mesh = gltf.scene;
                mesh.scale.set( 200, 200, 200 );
                //mesh.scale.set( 60, 60, 60 );
                //mesh.rotation.y = - Math.PI / 2;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                var box = new THREE.Box3().setFromObject( mesh );
                box.center( mesh.position ); // this re-sets the mesh position
                //mesh.position.multiplyScalar( - 1 );
                mesh.position.multiplyScalar( - 10 );

                var pivot = new THREE.Group();
                scene.add( pivot );
                pivot.add( mesh );

                mixer = new THREE.AnimationMixer( gltf.scene );

                mixer = new THREE.AnimationMixer( gltf.scene );
        
                gltf.animations.forEach( ( clip ) => {
          
                    mixer.clipAction( clip ).play();
          
                });

                //scene.add( mesh );

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
            console.log(THREE.REVISION)

	        },
	        // called when loading has errors
	        function ( error ) {
	        	console.log( 'An error happened' );
	        });

        //
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        renderer.setClearColor( 0x000000, 0 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.8;
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild( renderer.domElement );

        light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
        light.position.set( 0, 1, 0 ); //default; light shining from top
        light.castShadow = true; // default false
        scene.add( light );

        //Set up shadow properties for the light
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 500; // default
        
        //////////////////////////////////////////////////////////////////////////////////
        //		Ground
        //////////////////////////////////////////////////////////////////////////////////

        /*var geometry	= new THREE.BoxGeometry( window.innerWidth * 0.1, window.innerHeight*0.1, 2);
        var texture	= new THREE.TextureLoader().load('images/water.jpg');
        texture.repeat.set( 0.5, 0.8 );
        texture.wrapS	= texture.wrapT = THREE.RepeatWrapping;
        var material	= new THREE.MeshPhongMaterial({
            ambient		: 0x444444,
            color		: 0x66aa66,
            shininess	: 150, 
            specular	: 0x888888,
            flatShading		: THREE.SmoothShading,
            map		: texture
        });
        var ground		= new THREE.Mesh( geometry, material );
        ground.scale.multiplyScalar(3);
        ground.position.y		= -62;
        ground.rotation.x = -Math.PI / 2;
        scene.add( ground );
        ground.castShadow	= false;
        ground.receiveShadow	= true;*/


        //Create a sphere that cast shadows (but does not receive them)
        /*const sphereGeometry = new THREE.SphereGeometry( 232, 232, 232 );
        const sphereMaterial = new THREE.MeshStandardMaterial( { color: 0xff0000 } );
        const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
        sphere.castShadow = true; //default is false
        sphere.receiveShadow = false; //default
        scene.add( sphere );*/

        //Create a plane that receives shadows (but does not cast them)
        /*const planeGeometry = new THREE.PlaneGeometry( 20, 20, 32, 32 );
        const planeMaterial = new THREE.MeshStandardMaterial( { color: 0x00ff00 } )
        const plane = new THREE.Mesh( planeGeometry, planeMaterial );
        plane.receiveShadow = true;
        scene.add( plane );*/

        //
        document.addEventListener( "mousemove", onDocumentMouseMove, false );

        controls = new OrbitControls( camera, renderer.domElement );
        controls.minDistance = 200;
        controls.maxDistance = 1000;
        //controls.enableDamping = true;
        //controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        //controls.target.set(100, 100, 400);

        controls.enablePan = false; 
		controls.enableDamping = true;
		controls.minPolarAngle = 0.8;
		controls.maxPolarAngle = 2.4;
		controls.dampingFactor = 0.07;
		controls.rotateSpeed = 0.07;

        controls.update();
        camera.position.y = 160;
        window.addEventListener( "resize", onWindowResize, false );
        //render();
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

        camera.position.x += ( -mouseX - camera.position.x ) * .5;
        camera.position.y += ( mouseY - camera.position.y ) * .5;

        requestAnimationFrame( animate );
        light.position.x = 1000 * Math.sin(Date.now() / 480);
        light.position.z = 1000 * Math.cos(Date.now() / 480);

        render();

    }

    function render() {
        
        console.log(camera.position.y);
        camera.lookAt( scene.position);
        //camera.position.y = 100;
        var delta = clock.getDelta();
  
        if ( mixer ) mixer.update( delta );
        renderer.render( scene, camera );

    }

})();
