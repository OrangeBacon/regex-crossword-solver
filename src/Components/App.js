import { Component } from "react";
import Board from "./Board";
import Header from "./Header";
import BoardControls from "././BoardControls";
import SizeControls from "./SizeControls";
import RegexEditor from "./RegexEditor";
import Rotation from "./Rotation";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.onSizeChange = this.onSizeChange.bind(this);
    this.onClear = this.onClear.bind(this);
    this.onUndoClear = this.onUndoClear.bind(this);
    this.onRegexChange = this.onRegexChange.bind(this);

    this.state = {
      width: 1,
      height: 1,
      board: [[]],
      oldBoard: [],
      regexes: [[], [], [], []],
      oldRegexes: []
    };
    this.updateRegexStore(this.state);
  }

  onSizeChange(change) {
    this.setState((state) => {
      const newState = { ...state, ...change };
      this.updateRegexStore(newState);
      return newState;
    });
  }

  updateRegexStore(state) {
    const size = Math.max(state.width, state.height);

    state.regexes.forEach((element) => {
      while (element.length < size) {
        element.push("");
      }
    });
  }

  onClear() {
    console.log("clear");
    this.setState((state) => {
      let newState = {
        ...state,
        oldBoard: state.board,
        board: [],
        regexes: [[], [], [], []],
        oldRegexes: state.regexes
      };
      this.updateRegexStore(newState);
      return newState;
    });
  }

  onUndoClear() {
    this.setState((state) => {
      let newState = {
        ...state,
        board: state.oldBoard,
        regexes: state.oldRegexes
      };
      this.updateRegexStore(newState);
      return newState;
    });
  }

  onRegexChange(side, editor, value) {
    this.setState((state) => {
      state.regexes[side][editor] = value;
      return state;
    });
  }

  render() {
    return (
      <>
        <Header />
        <SizeControls
          onChange={this.onSizeChange}
          width={this.state.width}
          height={this.state.height}
        />
        <Rotation>
          {(angle) => (
            <Board
              width={this.state.width}
              height={this.state.height}
              angle={angle}
            />
          )}
        </Rotation>

        <BoardControls
          onClear={this.onClear}
          onUndo={this.onUndoClear}
          displayUndo={this.state.board.length === 0}
        />
        <RegexEditor
          width={this.state.width}
          height={this.state.height}
          content={this.state.regexes}
          onChange={this.onRegexChange}
        />
      </>
    );
  }
}
