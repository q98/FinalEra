import { ArcRotateCamera, Engine, HemisphericLight, MeshBuilder, Scene, Vector3 } from "babylonjs"
import { AdvancedDynamicTexture } from "babylonjs-gui"
import io from 'socket.io-client'
import { GUI, xAddPos, yAddPos } from "./core/GUI"

    let socket = io('http://104.237.1.23:3000')

    //socket.connect('http://104.237.1.23:3000'); 

    // Add a connect listener
    socket.on('connect',function() {
      console.log('Client has connected to the server!');
    });
    // Add a connect listener
    socket.on('message',function(data) {
      console.log('Received a message from the server!',data);
    });
    // Add a disconnect listener
    socket.on('disconnect',function() {
      console.log('The client has disconnected!');
    });

    // Sends a message to the server via sockets
    function sendMessageToServer(message) {
      socket.send(message);
    };

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
