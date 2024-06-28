import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/Addons.js'

let scene, camera, renderer;

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight();
  scene.add(ambientLight);

  const controls = new OrbitControls(camera, renderer.domElement)
  camera.position.z = 5;
  controls.enablePan = true;
  controls.update();

  loadModel();
  animate();
}

function loadModel() {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  dracoLoader.preload();

  const loader = new OBJLoader();
  
  loader.load('/models/BP_BFV.obj', function (obj) {
    obj.scale.setScalar(0.005)
    obj.traverse(function (node){
      //console.log(node)
      if(node.isMesh){
        console.log(node.material)
        for (const item in node.material){
          let name = node.material[item].name.split("/").pop()
          name = name.slice(name.length / 2, name.length)
          if (name[0] == "_"){
            name = name.substring(1)
          }
          console.log(name)
          const lodTexture = new THREE.TextureLoader().load(`/textures/${name}.png`)
          const material0 = new THREE.MeshPhysicalMaterial({
          map:lodTexture,
          })
          node.material[item] = material0
        }
      }
    })
    scene.add(obj)
  })
}


function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
