//import { GLTFLoader } from 'https://cdn.rawgit.com/mrdoob/three.js/master/examples/js/loaders/GLTFLoader.js'

(function() {
    "use strict";

    var container;
    var camera, scene, renderer, composer, controls, clock, mixer, sprite;
    var loader, mesh, controls;
    var light1, light2, light3, light4, light;
    var mouseX = 0, mouseY = 0;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    // Number

    const canvas = document.getElementById("number");
    const ctx = canvas.getContext("2d");
    const x = 32;
    const y = 32;
    const radius = 30;
    const startAngle = 0;
    const endAngle = Math.PI * 2;

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.fill();

    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.stroke();

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("1", x, y);

    const annotation = document.querySelector(".annotation");
    let spriteBehindObject;

    init();
    animate();

    function init() {
        var hero = document.getElementById("hero");
        var container = document.createElement("div");
        container.className = "hero__three-container";
        hero.appendChild( container );

        // camera
        camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 1500 );
        camera.position.z = 250;

        // scene
        scene = new THREE.Scene();
        clock = new THREE.Clock();

        // light
        var lightAmb = new THREE.AmbientLight( 0x959595, 2 );
        scene.add( lightAmb );

        light1 = new THREE.PointLight( 0xffffff, .15, 0, Math.PI / 2, 1  );
        light1.position.set(0, -80, 500);
        light1.castShadow = true;
        scene.add( light1 );
        light2 = new THREE.PointLight( 0xffffff, .35, 0, Math.PI / 2, 1  );
        light2.position.set(0, 500, 0);
        light2.castShadow = true;
        scene.add( light2 );
        light3 = new THREE.PointLight( 0xffffff, .32, 0, Math.PI / 2, 1  );
        light3.position.set(-500, 0, 10);
        light3.castShadow = true;
        scene.add( light3 );
        light4 = new THREE.PointLight( 0xffffff, .2, 0, Math.PI / 2, 1  );
        light4.position.set(500, 0, 10);
        light4.castShadow = true;
        scene.add( light4 );

        light = new THREE.DirectionalLight( 0xffffff, 1, 100 );
        light.position.set( 0, 1, 0 ); //default; light shining from top
        light.castShadow = true; // default false
        scene.add( light );

        //Set up shadow properties for the light
        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.5; // default
        light.shadow.camera.far = 500; // default*/

        var loader = new THREE.GLTFLoader();

        // Load a glTF resource
        loader.load(
	        // resource URL
	        '3d/GirlBuste/scene.gltf',
	        // called when the resource is loaded
	        function ( gltf ) {

                mesh = gltf.scene;
                mesh.scale.set( 200, 200, 200 );

                var box = new THREE.Box3().setFromObject( mesh );
                box.center( mesh.position ); // this re-sets the mesh position
                mesh.position.multiplyScalar( - 10 );

                mesh.traverse( function ( child ) {

                    if ( child.isMesh ) {
            
                        child.castShadow = true;
                        //child.receiveShadow = true;
                    }
                });

                var pivot = new THREE.Group();
                scene.add( pivot );
                pivot.add( mesh );

                mixer = new THREE.AnimationMixer( gltf.scene );
        
                gltf.animations.forEach( ( clip ) => {
                    mixer.clipAction( clip ).play();
                });

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
            console.log(THREE.REVISION)

	        },
	        // called when loading has errors
	        function ( error ) {
	        	console.log( 'An error happened' );
	        });

        // Sprite

        const numberTexture = new THREE.CanvasTexture(
            document.querySelector("#number")
        );

        const spriteMaterial = new THREE.SpriteMaterial({
            map: numberTexture,
            alphaTest: 0.5,
            transparent: true,
            depthTest: false,
            depthWrite: false
        });

        sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(20, -10, 3);
        sprite.scale.set(60, 60, 1);

        scene.add(sprite);
        
        //Render

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        renderer.setClearColor( 0x000000, 0 );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.8;

        container.appendChild( renderer.domElement );

        //document.addEventListener( "mousemove", onDocumentMouseMove, false );
        //document.addEventListener( "touchmove", onDocumentTouchMove , false );

        //Controls

        controls = new OrbitControls( camera, renderer.domElement );
        controls.minDistance = 220;
        controls.maxDistance = 1000;
        controls.enableZoom = true;

        controls.enablePan = false; 
		controls.enableDamping = true;
		controls.minPolarAngle = 0.8;
		controls.maxPolarAngle = 2.4;
		controls.dampingFactor = 0.07;
		controls.rotateSpeed = 0.75;
        controls.enableRotate = true;
        controls.enabled = true;

        controls.update();
        camera.position.y = 80;
        camera.position.x = 50;
        window.addEventListener( "resize", onWindowResize, false );
    }

    
    function onDocumentMouseMove( event ) {
        mouseX = ( event.clientX - windowHalfX ) / 4;
        mouseY = ( event.clientY - windowHalfY ) / 4;
    }

    function onDocumentTouchMove( event ) {
        mouseX = ( event.clientX - windowHalfX ) / 4;
        mouseY = ( event.clientY - windowHalfY ) / 4;
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

        //camera.position.x += ( -mouseX - camera.position.x ) * .5;
        //camera.position.y += ( mouseY - camera.position.y ) * .5;

        requestAnimationFrame( animate );
        light.position.x = 1000 * Math.sin(Date.now() / 480);
        light.position.z = 1000 * Math.cos(Date.now() / 480);

        render();

    }

    function render() {
        camera.lookAt( scene.position);
        var delta = clock.getDelta();
  
        if ( mixer ) mixer.update( delta );
        renderer.render( scene, camera );

        updateAnnotationOpacity();
        updateScreenPosition();
    }

    function updateAnnotationOpacity() {
        const meshDistance = camera.position.distanceTo(mesh.position);
        const spriteDistance = camera.position.distanceTo(sprite.position);
        spriteBehindObject = spriteDistance > meshDistance;
        sprite.material.opacity = spriteBehindObject ? 0.25 : 1;
    
        // Do you want a number that changes size according to its position?
        // Comment out the following line and the `::before` pseudo-element.
        sprite.material.opacity = 0;
    }
    
    function updateScreenPosition() {
        const vector = new THREE.Vector3(20, -10, 3);
        const canvas = renderer.domElement;
    
        vector.project(camera);
    
        vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
        vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));
    
        annotation.style.top = `${vector.y}px`;
        annotation.style.left = `${vector.x}px`;
        annotation.style.opacity = spriteBehindObject ? 0.25 : 1;
    }

})();
