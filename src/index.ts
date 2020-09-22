import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 } from "babylonjs"

import { SampleMaterial } from "./Materials/SampleMaterial"

const view = document.getElementById("view") as HTMLCanvasElement
const engine = new Engine(view, true)

const scene = new Scene(engine)

const camera = new ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 3.2,
    2,
    Vector3.Zero(),
    scene)

camera.attachControl(view)

const light = new HemisphericLight(
    "light",
    new Vector3(0, 1, 0),
    scene)

const mesh = MeshBuilder.CreateGround("mesh", {}, scene)

const material =  new SampleMaterial("material", scene)
mesh.material = material

window.addEventListener('resize', function(){ engine.resize();
});

engine.runRenderLoop(() => {
    scene.render();
})
