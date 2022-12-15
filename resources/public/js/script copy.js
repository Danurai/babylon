var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

var createScene = function () {
	var scene = new BABYLON.Scene(engine);
	const uvScale = 1;
	
	var camera = new BABYLON.ArcRotateCamera("camera1", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
	
	camera.setPosition(new BABYLON.Vector3(0,7,-12));
	camera.attachControl(canvas, true);
	camera.speed = .25;

	// var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
	// light.intensity = .7;

	const envTex = BABYLON.CubeTexture.CreateFromPrefilteredData("./environment/environment.env", scene);
	scene.environmentTexture = envTex; // Environment Lighting

	scene.createDefaultSkybox(envTex,true);



	var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 10}, scene);
	// const groundMat = new BABYLON.StandardMaterial("groundMat", scene);

	let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 2, segments: 32}, scene);
	ground.material = CreateRockMaterial()


	function CreateRockMaterial() {
		pbr = new BABYLON.PBRMaterial("pbr",scene);
		pbr.roughness=1;
		pbr.albedoTexture = loadTexture("rocks_02", "diff", scene);
		pbr.bumpTexture = loadTexture("rocks_02", "nor", scene);
		pbr.Texture = loadTexture("rocks_02", "ao", scene);

		pbr.useAmbienOcclustionFromMetallicTextureRed = true;
		pbr.useRoughnessFromMetallicTextureGreen = true;
		pbr.useMetallnessFromMetallicTextureBlue = true;

		pbr.metallicTexture = loadTexture("rocks_02","arm",scene)
		pbr.invertNormalMapX = true;
		pbr.invertNormalMapY = true;

		//pbr.roughness = 1;
		return pbr;
	}

	function loadTexture( mat, type, scene ) {
		const texture = new BABYLON.Texture(`./textures/${mat}/${mat}_${type}.jpg`, scene);
		return texture;
	}

	return scene;
};


function CreateEnvironment() {
}


scene = createScene();

engine.runRenderLoop(function () {
	scene.render();
});




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

	
	// let lastMesh = null;
	// let lastMeshColor = null;

	// scene.onPointerMove = function castRay() {
	// 	let ray = scene.createPickingRay(scene.pointerX, scene.pointerY, BABYLON.Matrix.Identity(), camera, false);
	// 	let hit = scene.pickWithRay(ray);

	// 	if (lastMesh !== null) {
	// 		lastMesh.material.diffuseColor = lastMeshColor;
	// 		lastMesh = null;
	// 	}

	// 	if (hit.pickedMesh) {
	// 		lastMesh = hit.pickedMesh;
	// 		lastMeshColor = hit.pickedMesh.material.diffuseColor;
	// 		hit.pickedMesh.material.diffuseColor = BABYLON.Color3.Red();
	// 	}
	// }
	
// Resize
// window.addEventListener("resize", function () {
// 		engine.resize();
// });