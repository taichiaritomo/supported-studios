<template>
  <div class="w-full h-full" ref="globeContainer">
    <div id="webgl"></div>
  </div>
</template>

<script setup>
// import * as THREE from 'three'

const props = defineProps({
  coordinates: {
    type: Array,
    required: true,
  },
})

const globeContainer = ref(null)

onMounted(() => {
  if (process.client) {
    var webglEl = document.getElementById('webgl');

    if (!Detector.webgl) {
      Detector.addGetWebGLMessage(webglEl);
      return;
    }

    const globeContainerWidth = globeContainer.value.offsetWidth
    const globeContainerHeight = globeContainer.value.offsetHeight
    const width = globeContainerWidth,
          height = globeContainerHeight;

    // Earth params
    var radius   = 1,
      segments = 32,
      rotation = 6;  

    var scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xffffff );

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

    var controls = new THREE.TrackballControls(camera);

    const markers = new THREE.Object3D();
    const geometry = new THREE.SphereGeometry(0.02, 32, 32) // new THREE.CircleGeometry(0.02, 32); 
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const markerDistance = 0.02
    const outlineMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );

    props.coordinates.forEach((coordinate) => {
      const marker = new THREE.Mesh(geometry, material)
      var phi   = (90-coordinate.latitude)*(Math.PI/180),
      theta = (coordinate.longitude+180)*(Math.PI/180),
      x = -((radius + markerDistance) * Math.sin(phi)*Math.cos(theta)),
      z = ((radius + markerDistance) * Math.sin(phi)*Math.sin(theta)),
      y = ((radius + markerDistance) * Math.cos(phi));
      marker.position.set(x, y, z)
      markers.add(marker)
      const outlineMesh = new THREE.Mesh( geometry, outlineMaterial );
      outlineMesh.position = marker.position;
      outlineMesh.scale.multiplyScalar(1.2);
      markers.add( outlineMesh );
    })
    scene.add(markers)
    // markers.rotation.x -= 0.01;
    markers.rotation.y -= 0.25;

    webglEl.appendChild(renderer.domElement);

    render();

    function render() {
      controls.update();
      sphere.rotation.y += 0.0005;
      markers.rotation.y += 0.0005;
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    // function createSphere(radius, segments) {
    //   return new THREE.Mesh(
    //     new THREE.SphereGeometry(radius, segments, segments),
    //     new THREE.MeshPhongMaterial({
    //       map:         new THREE.TextureLoader().load('/images/globe/2_no_clouds_4k.jpg'),
    //       bumpMap:     new THREE.TextureLoader().load('/images/globe/elev_bump_4k.jpg'),
    //       bumpScale:   0.005,
    //       specularMap: new THREE.TextureLoader().load('images/globe/water_4k.png'),
    //       specular:    new THREE.Color('grey')
    //     })
    //   );
    // }

    // function createClouds(radius, segments) {
    //   return new THREE.Mesh(
    //     new THREE.SphereGeometry(radius + 0.003, segments, segments),			
    //     new THREE.MeshPhongMaterial({
    //       map:         new THREE.TextureLoader().load('/images/globe/fair_clouds_4k.png'),
    //       transparent: true
    //     })
    //   );		
    // }

    function createSphere(radius, segments) {
      return new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        new THREE.MeshPhongMaterial({
          map:         THREE.ImageUtils.loadTexture('images/globe/2_no_clouds_4k.jpg'),
          bumpMap:     THREE.ImageUtils.loadTexture('images/globe/elev_bump_4k.jpg'),
          bumpScale:   0.005,
          specularMap: THREE.ImageUtils.loadTexture('images/globe/water_4k.png'),
          specular:    new THREE.Color('grey')								
        })
      );
    }
  }
})
</script>