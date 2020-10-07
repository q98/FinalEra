import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 } from "babylonjs"
import { AdvancedDynamicTexture } from "babylonjs-gui"

import { GUI, xAddPos, yAddPos } from "./core/GUI"

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

let adt = AdvancedDynamicTexture.CreateFullscreenUI("UI");
let derp = new GUI(adt)
derp.activateMobile();


scene.onBeforeRenderObservable.add(function () {
    console.log(xAddPos + "<x  :  y>" + yAddPos)
  });
engine.runRenderLoop(() => {
    scene.render();
})
