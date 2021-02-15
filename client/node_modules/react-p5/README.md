<div align="center">
  <img height="200"
    src="https://raw.githubusercontent.com/Gherciu/react-p5/master/logo.png">
  <h1>react-p5</h1>
  <p>This Component lets you integrate p5 Sketches into your React App. <a href="https://codesandbox.io/s/k09k8knxz5">DEMO</a></p>
</div>

[![GitHub](https://img.shields.io/github/license/Gherciu/react-p5)](https://github.com/Gherciu/react-p5/blob/master/LICENSE)

### Installation

```bash
npm i react-p5
```

### Usage

```js
import React, { Component } from "react";
import Sketch from "react-p5";

export default class App extends Component {
  x = 50;
  y = 50;

  setup = (p5, canvasParentRef) => {
    p5.createCanvas(500, 500).parent(canvasParentRef); // use parent to render canvas in this ref (without that p5 render this canvas outside your component)
  };
  draw = p5 => {
    p5.background(0);
    p5.ellipse(this.x, this.y, 70, 70);
    // NOTE: Do not use setState in draw function or in functions that is executed in draw function... pls use normal variables or class properties for this purposes
    this.x++;
  };

  render() {
    return <Sketch setup={this.setup} draw={this.draw} />;
  }
}
```

### Props

| Prop          | Required | Type     | Description                                                                                                                                                                                                           |
| ------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| className     | false    | String   | ClassName for canvas parent ref                                                                                                                                                                                       |
| style         | false    | Object   | Styles for canvas parent ref                                                                                                                                                                                          |
| setup         | true     | Function | The setup() function is called once when the program starts.                                                                                                                                                          |
| draw          | false    | Function | Called directly after setup(), the draw() function continuously executes the lines of code contained inside its block until the program is stopped or noLoop() is called.                                             |
| windowResized | false    | Function | The windowResized() function is called once every time the browser window is resized.                                                                                                                                 |
| preload       | false    | Function | Called directly before setup(), the preload() function is used to handle asynchronous loading of external files in a blocking way.                                                                                    |
| mouseClicked  | false    | Function | The mouseClicked() function is called once after a mouse button has been pressed and then released.                                                                                                                   |
| mouseMoved    | false    | Function | The mouseMoved() function is called every time the mouse moves and a mouse button is not pressed.                                                                                                                     |
| doubleClicked | false    | Function | The doubleClicked() function is executed every time a event listener has detected a dblclick event which is a part of the DOM L3 specification.                                                                       |
| mousePressed  | false    | Function | The mousePressed() function is called once after every time a mouse button is pressed.                                                                                                                                |
| mouseWheel    | false    | Function | The function mouseWheel() is executed every time a vertical mouse wheel event is detected either triggered by an actual mouse wheel or by a touchpad.                                                                 |
| mouseDragged  | false    | Function | The mouseDragged() function is called once every time the mouse moves and a mouse button is pressed. If no mouseDragged() function is defined, the touchMoved() function will be called instead if it is defined.     |
| mouseReleased | false    | Function | The mouseReleased() function is called every time a mouse button is released.                                                                                                                                         |
| keyPressed    | false    | Function | The keyPressed() function is called once every time a key is pressed. The keyCode for the key that was pressed is stored in the keyCode variable.                                                                     |
| keyReleased   | false    | Function | The keyReleased() function is called once every time a key is released. See key and keyCode for more information.                                                                                                     |
| keyTyped      | false    | Function | The keyTyped() function is called once every time a key is pressed, but action keys such as Backspace, Delete, Ctrl, Shift, and Alt are ignored.                                                                      |
| touchStarted  | false    | Function | The touchStarted() function is called once after every time a touch is registered.                                                                                                                                    |
| touchMoved    | false    | Function | The touchMoved() function is called every time a touch move is registered.                                                                                                                                            |
| touchEnded    | false    | Function | The touchEnded() function is called every time a touch ends. If no touchEnded() function is defined, the mouseReleased() function will be called instead if it is defined.                                            |
| deviceMoved   | false    | Function | The deviceMoved() function is called when the device is moved by more than the threshold value along X, Y or Z axis. The default threshold is set to 0.5. The threshold value can be changed using setMoveThreshold() |
| deviceTurned  | false    | Function | The deviceTurned() function is called when the device rotates by more than 90 degrees continuously.                                                                                                                   |
| deviceShaken  | false    | Function | The deviceShaken() function is called when the device total acceleration changes of accelerationX and accelerationY values is more than the threshold value. The default threshold is set to 30.                      |

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

#### Or you can sponsor via [Open Collective](https://opencollective.com/react-p5/)

[![Open Collective](https://opencollective.com/react-p5/tiers/sponsor.svg?avatarHeight=60)](https://opencollective.com/react-p5/)

## Author

**[@Gherciu/react-p5](https://github.com/Gherciu/react-p5)** © [GHERCIU](https://github.com/Gherciu), Released under the [MIT](https://github.com/Gherciu/react-p5/blob/master/LICENSE) License.<br>
Authored and maintained by GHERCIU with help from contributors ([list](https://github.com/Gherciu/react-p5/contributors)).

#### If you like this repository star⭐ and watch👀 on [GitHub](https://github.com/Gherciu/react-p5)
