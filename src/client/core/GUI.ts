import { AdvancedDynamicTexture, Ellipse, Control} from 'babylonjs-gui';
export let xAddPos
export let yAddPos
let leftThumbContainer 
let leftInnerThumbContainer
let leftPuck
let adt1

export class GUI  {
    constructor(adt: AdvancedDynamicTexture) {
        let xAddRot = 0;
        let yAddRot = 0;
        let translateTransform;
        adt1 = adt
        leftThumbContainer = makeThumbArea("leftThumb", 2, "blue", null,  null);
            leftThumbContainer.height = "160px";
            leftThumbContainer.width = "160px";
            leftThumbContainer.isPointerBlocker = true;
            leftThumbContainer.horizontalAlignment =   Control.HORIZONTAL_ALIGNMENT_LEFT;
            leftThumbContainer.verticalAlignment =   Control.VERTICAL_ALIGNMENT_BOTTOM;
            leftThumbContainer.alpha = 0.4;
    
        leftInnerThumbContainer = makeThumbArea("leftInnterThumb", 4, "blue", null, null);
            leftInnerThumbContainer.height = "80px";
            leftInnerThumbContainer.width = "80px";
            leftInnerThumbContainer.isPointerBlocker = true;
            leftInnerThumbContainer.horizontalAlignment =   Control.HORIZONTAL_ALIGNMENT_CENTER;
            leftInnerThumbContainer.verticalAlignment =   Control.VERTICAL_ALIGNMENT_CENTER;
    
    
        leftPuck = makeThumbArea("leftPuck",0, "blue", "blue", null);
                leftPuck.height = "60px";
                leftPuck.width = "60px";
                leftPuck.isPointerBlocker = true;
                leftPuck.horizontalAlignment =   Control.HORIZONTAL_ALIGNMENT_CENTER;
                leftPuck.verticalAlignment =   Control.VERTICAL_ALIGNMENT_CENTER;
    
    
            leftThumbContainer.onPointerDownObservable.add(function(coordinates) {
                leftPuck.isVisible = true;
                leftPuck['floatLeft'] = coordinates.x-(leftThumbContainer._currentMeasure.width*.5);
                leftPuck.left = leftPuck['floatLeft'];
                leftPuck['floatTop'] = adt['_canvas'].height - coordinates.y-(leftThumbContainer._currentMeasure.height*.5);
                leftPuck.top = leftPuck['floatTop']*-1;
                leftPuck['isDown'] = true;
                leftThumbContainer.alpha = 0.9;
            });
    
            leftThumbContainer.onPointerUpObservable.add(function(coordinates) {
                xAddPos = 0;
                yAddPos = 0;
                leftPuck['isDown'] = false;
                leftPuck.isVisible = false;
                leftThumbContainer.alpha = 0.4;
            });
    
    
            leftThumbContainer.onPointerMoveObservable.add(function(coordinates) {
                if (leftPuck['isDown']) {
                    xAddPos = coordinates.x-(leftThumbContainer._currentMeasure.width*.5);
                    yAddPos = adt['_canvas'].height - coordinates.y-(leftThumbContainer._currentMeasure.height*.5);
                    leftPuck['floatLeft'] = xAddPos;
                    leftPuck['floatTop'] = yAddPos*-1;
                    leftPuck.left = leftPuck['floatLeft'];
                    leftPuck.top = leftPuck['floatTop'];
                    }
            });
    
         

         function makeThumbArea(name, thickness, color, background, curves){
            let rect = new   Ellipse('derp')
                rect.name = name;
                rect.thickness = thickness;
                rect.color = color;
                rect.background = background;
                rect.paddingLeft = "0px";
                rect.paddingRight = "0px";
                rect.paddingTop = "0px";
                rect.paddingBottom = "0px";

            return rect;
         }
        
        
    }
    activateMobile() {
     adt1.addControl(leftThumbContainer);
     leftThumbContainer.addControl(leftInnerThumbContainer);
     leftThumbContainer.addControl(leftPuck);
     leftPuck.isVisible = false;  
    }
    
}
