import React, { Component } from "react";
import { withFirebase } from "./Firebase";
let fileReader = new FileReader();
class Draw extends Component {
  constructor(props) {
    super(props);
    this.handleModelFile = this.handleModelFile.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.state = {
      loading: false,
      airplanes: [],
      currentIndex: 0
    };
  }

  handlePrevious() {
    let current = this.state.currentIndex;
    let previous;
    if (current == 0) {
      previous = this.state.airplanes.length - 1;
    } else {
      previous = current - 1;
    }
    this.setState({
      currentIndex: previous
    });
    this.updateCanvas();
  }

  handleNext() {
    let current = this.state.currentIndex;
    let next;
    if (current == this.state.airplanes.length - 1) {
      next = 0;
    } else {
      next = current + 1;
    }
    this.setState({
      currentIndex: next
    });
    this.updateCanvas();
  }
  handleModelFile(event) {
    let content = fileReader.result;
    content.split("\n").forEach(element => {
      let airplane = JSON.parse(element);
      let drawings = [];
      airplane.drawing.forEach(dra => {
        drawings.push({
          x: dra[0],
          y: dra[1]
        });
      });
      airplane.drawing = drawings;
      this.props.firebase.airplanes().add(airplane);
    });
  }
  handleModelUpload(file) {
    fileReader.onload = this.handleModelFile;
    fileReader.readAsText(file);
  }
  updateCanvas() {
    var airplane = this.state.airplanes[this.state.currentIndex];
    const ctx = this.refs.canvas.getContext("2d");
    ctx.clearRect(0, 0, 300, 300);
    ctx.beginPath();
    //for each stroke
    let strokes = airplane.drawing;
    for (var i = 0; i < strokes.length; i++) {
      let points = strokes[i];
      //move to first point
      ctx.moveTo(points.x[0], points.y[0]);
      //for each remaining point draw line
      for (var j = 1; j < points.x.length; j++) {
        ctx.lineTo(points.x[j], points.y[j]);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
  componentDidMount() {
    this.setState({
      loading: true
    });
    this.props.firebase
      .airplanes()
      .get()
      .then(val => {
        this.setState({
          airplanes: val.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })),
          loading: false
        });
        this.updateCanvas();
      });
  }

  render() {
    if (this.state.loading) {
      return <div>Loading ....</div>;
    } else {
      return (
        <div>
          Upload Model :
          <input
            type="file"
            id="file"
            accept=".ndjson"
            onChange={e => this.handleModelUpload(e.target.files[0])}
          />
          <canvas ref="canvas" width={300} height={300} />
          <button onClick={this.handlePrevious}>Previous</button>
          <button onClick={this.handleNext}>Next</button>
        </div>
      );
    }
  }
}

export default withFirebase(Draw);
