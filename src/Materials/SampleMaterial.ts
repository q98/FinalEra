import { Scene, ShaderMaterial } from "babylonjs"

import * as sampleVertexShader from "./Shaders/Sample/sample.vertex.glsl"
import * as sampleFragmentShader from "./Shaders/Sample/sample.fragment.glsl"

BABYLON.Effect.ShadersStore["sampleVertexShader"] = sampleVertexShader
BABYLON.Effect.ShadersStore["sampleFragmentShader"] = sampleFragmentShader

