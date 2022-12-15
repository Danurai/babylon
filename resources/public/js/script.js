var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var camera;
const tile_columns = 9;
const tile_rows = 3;
const tilemap = {
	"1A":  {"position": "-1", "def": 0},
	"2A":  {"position": "-1", "def": 3},
	"3A":  {"position": "-1", "def": -1},
	"4A":  {"position": "-1", "def": 3},
	"5A":  {"position": "9",  "def": 1},
	"6A":  {"position": "10", "def": 1},
	"7A":  {"position": "20", "def": 2},
	"8A":  {"position": "19", "def": 2},
	"9A":  {"position": "-1", "def": 3},
	"10A": {"position": "1",  "def": 1},
	"11A": {"position": "0",  "def": 1},
	"12A": {"position": "8",  "def": 1},
	"13A": {"position": "22", "def": 0},
	"14A": {"position": "21", "def": 0},
	"15A": {"position": "23", "def": 0},
	"16A": {"position": "-1", "def": 3},
	"17A": {"position": "-1", "def": 0},
	"18A": {"position": "-1", "def": 0},
	"1B":  {"position": "17", "def": 1},
	"2B":  {"position": "18", "def": 2},
	"3B":  {"position": "26", "def": 0},
	"4B":  {"position": "4",  "def": 0},
	"5B":  {"position": "2",  "def": 1},
	"6B":  {"position": "6",  "def": 1},
	"7B":  {"position": "11", "def": 1},
	"8B":  {"position": "7",  "def": 1},
	"9B":  {"position": "12", "def": 0},
	"10B": {"position": "5",  "def": 0},
	"11B": {"position": "13", "def": 0},
	"12B": {"position": "14", "def": 0},
	"13B": {"position": "15", "def": 1},
	"14B": {"position": "16", "def": 1},
	"15B": {"position": "24", "def": 2},
	"16B": {"position": "25", "def": 2},
	"17B": {"position": "3",  "def": 3},
	"18B": {"position": "3",  "def": 3}
}

var createScene = function () {
	var scene = new BABYLON.Scene(engine);
	const uvScale = 1;
	
	camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
	
	camera.setPosition(new BABYLON.Vector3(0,10,-15));
	camera.attachControl(canvas, true);
	camera.speed = .25;

	var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = .7;

	let i = 4;

	const map = [
		["","17B","7A","4B"],
		["2B","13B","12B","5B"],
		["16B","3B","8A","11B"],
		["6A","","",""]
	]
	map.forEach((mapy,idy) => {
		mapy.forEach((mapx, idx) => {
			if (mapx !== "") {
				let tilen = tilemap[mapx].position;
				if (tilen > -1)	addTile(tilen, idx, idy, scene);
			}
		});
	});
		
	return scene;
};

function addTile(tilen, idx, idy, scene) {
	const faceUV = new Array(6);
	for(let i=0; i<6; i++) {faceUV[i]=new BABYLON.Vector4(0,0,0,0);}
	let tilex = (tilen % tile_columns)
	let tiley = 2 - Math.floor(tilen / tile_columns)
	faceUV[4] = new BABYLON.Vector4(tilex / tile_columns, tiley / tile_rows, (tilex + 1) / tile_columns, (tiley + 1) / tile_rows);

	let tile = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 5, depth: 5, faceUV: faceUV}, scene);
	tile.position.x = 2.5 + ((idx - 2) * 5);
	tile.position.z = (idy - 2 + ((idx % 2)/2)) * -5 
	tile.rotation.y = (Math.PI/2)
	
	const material = new BABYLON.StandardMaterial("tm", scene);
	const texture = new BABYLON.Texture("./img/resources3.jpg", scene);
	material.diffuseTexture = texture;
	tile.material = material;
	
}
var scene = createScene();

engine.runRenderLoop(function () {
	scene.render();
});


let lastMesh = null;
let lastMeshColor = null;

scene.onPointerMove = function castRay() {
	let ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera, false);
	let hit = scene.pickWithRay(ray);

	if (lastMesh !== null) {
		lastMesh.material.diffuseColor = lastMeshColor;
		lastMesh = null;
	}

	if (hit.pickedMesh) {
		lastMesh = hit.pickedMesh;
		lastMeshColor = hit.pickedMesh.material.diffuseColor;
		hit.pickedMesh.material.diffuseColor = BABYLON.Color3.Red();
		// hit.pickedMesh.material.diffuseColor = new BABYLON.Color3(1,1,1);
	}
}



	// Our built-in 'sphere' shape.
	// for (let i=0; i<5; i++) {
	// 	let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
	// 	let spherematerial = new BABYLON.StandardMaterial("Ground Material", scene);
	// 	sphere.material = spherematerial;
	// 	sphere.material.diffuseColor = BABYLON.Color3.Green();

	// 	sphere.position.y = Math.floor((Math.random() * 10)) - 5;
	// 	sphere.position.x = Math.floor((Math.random() * 10)) - 5;
	// 	sphere.position.z = Math.floor((Math.random() * 10)) - 5;
	// }

	

	
// Resize
// window.addEventListener("resize", function () {
// 		engine.resize();
// });