import * as BABYLON from "babylonjs"
import * as GUI from 'babylonjs-gui';
import { mobileUI } from './GUI/mobileUI';
import * as Materials from 'babylonjs-materials';
//import * as BABYLON from '@babylonjs/core/Legacy/legacy';



const ybotURL = 'https://raw.githubusercontent.com/TheNosiriN/Babylon-Assets/master/ybot.babylon';




//animations
var skeleton = null;

var idleAnim = null;
var walkAnim = null;
var runAnim = null;
var sprintAnim = null;

//variables
var animationBlend = 0.005;
var mouseSensitivity = 0.005;
var cameraSpeed = 0.0075;
var walkSpeed = 0.001;
var runSpeed = 0.005;
var sprintSpeed = 0.008;
var gravity = new BABYLON.Vector3(0, -0.5, 0);

//in-game changed variables
var speed = 0;
var vsp = 0;
var mouseX = 0, mouseY = 0;
var mouseMin = -35, mouseMax = 45;


    const view = document.getElementById("view") as HTMLCanvasElement
    const engine = new BABYLON.Engine(view, true)
    const scene = new BABYLON.Scene(engine)
    scene.collisionsEnabled = true;
    let adt = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    //scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

    scene.fogEnabled = true;
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
	scene.fogDensity = 0.01;
    scene.fogColor = new BABYLON.Color3(0.8, 0.9, 1.0);
    //scene.clearColor = scene.fogColor;

    var camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0,0,0), scene);
    camera.inputs.clear();
    camera.minZ = 0;

    var hemLight = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	hemLight.intensity = 0.7;
	hemLight.specular = BABYLON.Color3.Black();

    var dirLight = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
    dirLight.position = new BABYLON.Vector3(0, 130, 130);


    // Shadows
    var shadowGenerator = new BABYLON.ShadowGenerator(3072, dirLight);
    shadowGenerator.usePercentageCloserFiltering = true;


        var ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 6000, height: 6000}, scene);
    ground.material = new Materials.GridMaterial("groundMaterial", scene);
    ground.material['majorUnitFrequency'] = 8;
	ground.material['minorUnitVisibility'] = 0.45;
    ground.material['mainColor'] = new BABYLON.Color3(0.47, 0.45, 0.45);
	ground.material['lineColor'] = new BABYLON.Color3(0, 0, 0);


    var addShadows = function(mesh){
        mesh.receiveShadows = true;
        shadowGenerator.addShadowCaster(mesh);
    }

    //tps
    const dsm = new BABYLON.DeviceSourceManager(engine);
    var deltaTime = 0;

    //character nodes
    var main = new BABYLON.Mesh("parent", scene);
    var target = new BABYLON.TransformNode("target", scene, true);
    var character = new BABYLON.Mesh("character", scene);


    var thirdPersonCamera = {
        middle: {
            position: new BABYLON.Vector3(0, 1.35, -5),
            fov: 0.8,
            mouseMin: -5,
            mouseMax: 45
        },
        leftRun: {
            position: new BABYLON.Vector3(0.7, 1.35, -4),
            fov: 0.8,
            mouseMin: -35,
            mouseMax: 45
        },
        rightRun: {
            position: new BABYLON.Vector3(-0.7, 1.35, -4),
            fov: 0.8,
            mouseMin: -35,
            mouseMax: 45
        },
        far: {
            position: new BABYLON.Vector3(0, 1.5, -6),
            fov: 1.5,
            mouseMin: -5,
            mouseMax: 45
        }
    };

    function switchCamera(type){
        camera.position = type.position.divide(camera.parent['scaling']);
        camera.fov = type.fov;
        mouseMin = type.mouseMin,
        mouseMax = type.mouseMax
    }

     //character
    engine.displayLoadingUI();
    
    BABYLON.SceneLoader.ImportMesh("", "", ybotURL, scene, function (newMeshes, particleSystems, skeletons)
    {
        skeleton = skeletons[0];
        var body = newMeshes[1];
        var joints = newMeshes[0];
        body.scaling = new BABYLON.Vector3(0.01, 0.01, 0.01);
        body.rotation.y = BABYLON.Tools.ToRadians(180);
        joints.parent = body;
        body.parent = character;
        body.material = new BABYLON.StandardMaterial("character", scene);
        joints.material = new BABYLON.StandardMaterial("joints", scene);
        body.material['diffuseColor'] = new BABYLON.Color3(0.81, 0.24, 0.24);
        joints.material['emissiveColor'] = new BABYLON.Color3(0.19, 0.29, 0.44);


        addShadows(character);


        var idleRange = skeleton.getAnimationRange("None_Idle");
        var walkRange = skeleton.getAnimationRange("None_Walk");
        var runRange = skeleton.getAnimationRange("None_Run");
        var sprintRange = skeleton.getAnimationRange("None_Sprint");

        idleAnim = scene.beginWeightedAnimation(skeleton, idleRange.from+1, idleRange.to, 1.0, true);
        walkAnim = scene.beginWeightedAnimation(skeleton, walkRange.from+1, walkRange.to, 0, true);
		runAnim = scene.beginWeightedAnimation(skeleton, runRange.from+1, runRange.to, 0, true);
        sprintAnim = scene.beginWeightedAnimation(skeleton, sprintRange.from+1, sprintRange.to, 0, true);

        main.ellipsoid = new BABYLON.Vector3(0.5, 0.9, 0.5);
        main.ellipsoidOffset = new BABYLON.Vector3(0, main.ellipsoid.y, 0);
        main.checkCollisions = true;

        character.parent = main;
        target.parent = main;

        
            camera.parent = target;
            switchCamera(thirdPersonCamera.leftRun);
        

        main.position = new BABYLON.Vector3(10,0,10);


        engine.hideLoadingUI();
    }, function(evt){} );

    scene.registerBeforeRender(function()
    {
        deltaTime = engine.getDeltaTime();
        updateCamera();
        if (character != null){
            var keyboard = dsm.getDeviceSource(BABYLON.DeviceType.Keyboard);
            var mouse = dsm.getDeviceSource(BABYLON.DeviceType.Mouse);
            if (keyboard)
            {
                    thirdPersonMovement(
                        keyboard.getInput(87), //W
                        keyboard.getInput(83), //S
                        keyboard.getInput(65), //A
                        keyboard.getInput(68), //D
                        keyboard.getInput(32), //Space
                        keyboard.getInput(16), //Shift
                    );
                
            }
        }
    });
    
    var mouseMove = function(e)
    {
        var movementX = e.movementX ||
                e.mozMovementX ||
                e.webkitMovementX ||
                0;

        var movementY = e.movementY ||
                e.mozMovementY ||
                e.webkitMovementY ||
                0;
        
        mouseX += movementX * mouseSensitivity * deltaTime;
        mouseY += movementY * mouseSensitivity * deltaTime;
        mouseY = clamp(mouseY, mouseMin, mouseMax);
    }

    function updateCamera()
    {
        target.rotation = lerp3(
            target.rotation, 
            new BABYLON.Vector3(
                BABYLON.Tools.ToRadians(mouseY),
                BABYLON.Tools.ToRadians(mouseX), 0
            ), cameraSpeed*deltaTime
        );
    }

    function thirdPersonMovement(up, down, left, right, jump, run)
    {
        var directionZ = up-down;
        var directionX = right-left;

        var vectorMove = new BABYLON.Vector3(0,0,0);
        var direction = Math.atan2(directionX, directionZ);

        var currentState = idleAnim;
        

        //move
        if (directionX != 0 || directionZ != 0)
        {
            if (run != 1)
            {
                currentState = runAnim;
                speed = lerp(speed, runSpeed, runAnim.weight);
            }else{
                currentState = sprintAnim;
                speed = lerp(speed, sprintSpeed, sprintAnim.weight);
            }

            var rotation = (target.rotation.y+direction) % 360;
            character.rotation.y = lerp(
                character.rotation.y, rotation, 0.25
            );
            
            vectorMove = new BABYLON.Vector3(
                (Math.sin(rotation)), 0,
                (Math.cos(rotation))
            );
        }else{
            speed = lerp(speed, 0, 0.001);
        }

        var m = vectorMove.multiply(new BABYLON.Vector3().setAll( speed*deltaTime ));
        main.moveWithCollisions( m.add(new BABYLON.Vector3(0, vsp, 0)) );
        

        switchAnimation(currentState);
    }

    function switchAnimation(anim)
    {
        var anims = [idleAnim, runAnim, walkAnim, sprintAnim];
        
        if (idleAnim != undefined){
            for (var i=0; i<anims.length; i++)
            {
                if (anims[i] == anim){
                    anims[i].weight += animationBlend * deltaTime;
                }else{
                    anims[i].weight -= animationBlend * deltaTime;
                }

                anims[i].weight = clamp(anims[i].weight, 0.0, 1.0);
            }
        }
    }

    //tools
    function clamp(value, min, max)
    {
        return (Math.max(Math.min(value, max), min));
    }

    function lerp(start, end, speed)
    {
        return (start + ((end - start) * speed));
    }

    function lerp3(p1, p2, t)
    {
            var x = lerp(p1.x, p2.x, t);
            var y = lerp(p1.y, p2.y, t);
            var z = lerp(p1.z, p2.z, t);

            return new BABYLON.Vector3(x, y, z);
    }

   /* function setupPointerLock()
    {
        // register the callback when a pointerlock event occurs
        document.addEventListener('pointerlockchange', changeCallback, false);
        document.addEventListener('mozpointerlockchange', changeCallback, false);
        document.addEventListener('webkitpointerlockchange', changeCallback, false);

        // when element is clicked, we're going to request a
        // pointerlock
        view.onclick = function(){
            view.requestPointerLock = 
                view.requestPointerLock ||
                view.mozRequestPointerLock ||
                view.webkitRequestPointerLock
            ;

            // Ask the browser to lock the pointer)
            view.requestPointerLock();
        };

    }


    function changeCallback(e)
    {
        if (document.pointerLockElement === view ||
            document['mozPointerLockElement'] === view ||
            document['webkitPointerLockElement'] === view
        ){
            // we've got a pointerlock for our element, add a mouselistener*/
            document.addEventListener("mousemove", mouseMove, false);
       // } else {
            // pointer lock is no longer active, remove the callback
         //   document.removeEventListener("mousemove", mouseMove, false);
        //}
    //};


    setupPointerLock();
    scene.detachControl();

    ground.checkCollisions = true;



const mobileGui =  new mobileUI("mobileUI", adt)

window.addEventListener('resize', function(){ engine.resize();
});

engine.runRenderLoop(() => {
    scene.render();
})
