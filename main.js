class Transform {
    constructor(position, rotation) {
        var instance = GameEngine.getInstance();
        if ( position === undefined ) position = instance.sketch.createVector(0,0);
        this.position = position;
        if ( rotation === undefined ) rotation = instance.sketch.createVector(0,0);
        this.rotation = rotation;
    }
    setPosition(pos) {
        this.position.x = pos.x;
        this.position.y = pos.y;
    }
    setRotation(rot) {
        this.rotation.x = rot.x;
        this.rotation.y = rot.y;
    }
}

class GameObject {

    constructor(name = 'New GameObject', position, rotation, components = {}) {
        this.name = name;
        this.transform = new Transform(position, rotation);
        this.components = components;
        this.components['Transform'] = this.transform;
    }
    addComponent(component) {
        this.components[component.name] = component;
    }

    setPosition(pos, b) {
        if (b) pos = {
            x: pos,
            y: b
        };
        this.transform.setPosition(pos, b)
    }
    setRotation(rot, b) {
        if (b) rot = {
            x: rot,
            y: b
        };
        this.transform.setRotation(rot, b);
    }
    tick() {
        for ( const c in this.components ){
            let comp = this.components[c];
            if (comp.tick) comp .tick(this.components);
        }
    }
}

class Component {
    constructor(name = 'New Component') {
        this.name = name;
    }
}

class _Components {
    constructor(pos, rot) {
        this.library = {};
        this.library.Circle = Circle;
    }
}

var GameEngine = (() => {

    class _GameEngine {
        constructor() {
            this.version = '0.02';
            this.date = '2023-7-8';
            console.log(`%c||||||||||||||||||||||||||||||||||||`, 'font-weight:bold;font-family:monospace');
            console.log("%c| p5_gameEngine | v" + this.version + ' | ' + this.date + ' |', 'font-weight:bold;font-family:monospace;');
            console.log(`%c||||||||||||||||||||||||||||||||||||`, 'font-weight:bold;font-family:monospace');
            console.log(`%c  Crafted by FBP - No warranty and such`, 'font-weight:bold;font-family:monospace;font-size:10px;');
            this.components = new _Components();
            this.components = this.components.library;
            this.gameObjects = [];
            this.sketch = new p5((sketch) => {
                sketch.setup = () => {
                    sketch.createCanvas(window.innerWidth, window.innerHeight);
                };
                sketch.draw = () => {
                    sketch.background(50, 80, 180);
                    this.gameObjects.forEach(go => {
                        go.tick();
                    })
                };
            });
        }
        createObject(name = 'New GameObject') {
            let obj = new GameObject(name);
            this.gameObjects.push(obj);
            return new Promise(res => res(obj));
        }
        getObjectByID(id) {
            return this.gameObjects[id];
        }
    };

    var instance;

    return {
        getInstance: function () {
            if (!instance) {
                instance = new _GameEngine();
                delete instance.constructor;
            }
            return instance;
        }
    }
})();


class Circle extends Component {
    constructor(radius = 10, color = 'white') {
        super('Circle');
        this.radius = radius;
        this.color = color;
    }
    tick(components) {
        let pos = components.Transform.position;
        GameEngine.getInstance().sketch.ellipse(pos.x,pos.y,this.radius);
    }
}

let obj;
let p5ge = GameEngine.getInstance();

p5ge.createObject().then(o => {
    o.setPosition(window.innerWidth / 2, window.innerHeight / 2)
    o.addComponent(new p5ge.components.Circle());
    obj = o;
});