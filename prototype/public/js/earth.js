// Created by Bjorn Sandvik - thematicmapping.org
(function () {

	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth,
		height = window.innerHeight;

	// Earth params
	var radius   = 1,
		segments = 32,
		rotation = 6;  

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 3.5;

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	scene.add(new THREE.AmbientLight(0x333333));

	var light = new THREE.DirectionalLight(0xffffff, 0.4);
	light.position.set(50,1,5);
	scene.add(light);

	var light = new THREE.DirectionalLight(0xffffff, 0.4);
	light.position.set(5,1,50);
	scene.add(light);

	var light = new THREE.DirectionalLight(0xffffff, 0.4);
	light.position.set(-50,-1,-1);
	scene.add(light);

	var light = new THREE.DirectionalLight(0xffffff, 0.4);
	light.position.set(-1,-1,-50);
	scene.add(light);

	var light = new THREE.DirectionalLight(0xffffff, 0.4);
	light.position.set(-1,-50,-1);
	scene.add(light);

	var light = new THREE.DirectionalLight(0xffffff, 0.4);
	light.position.set(1,50,1);
	scene.add(light);

    var sphere = createSphere(radius, segments);
	sphere.rotation.y = rotation; 
	scene.add(sphere)

    var clouds = createClouds(radius, segments);
	clouds.rotation.y = rotation;
	scene.add(clouds)




	var controls = new THREE.TrackballControls(camera);

	webglEl.appendChild(renderer.domElement);

	render();

	function render() {
		controls.update();
		sphere.rotation.y += 0.0005;
		clouds.rotation.y += 0.0005;		
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function createSphere(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('/images/globe/2_no_clouds_4k.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('/images/globe/elev_bump_4k.jpg'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('images/globe/water_4k.png'),
				specular:    new THREE.Color('grey')
			})
		);
	}

	function createClouds(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('/images/globe/fair_clouds_4k.png'),
				transparent: true
			})
		);		
	}




}());