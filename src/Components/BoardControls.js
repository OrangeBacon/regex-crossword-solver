export default function BoardControls(props) {
  let centerButton;
  if (props.displayUndo) {
    centerButton = (
      <button className="btn btn-outline-dark" onClick={() => props.onUndo()}>
        undo clear
      </button>
    );
  } else {
    centerButton = (
      <button className="btn btn-outline-dark" onClick={() => props.onClear()}>
        clear
      </button>
    );
  }

  return (
    <div className="container mb-3">
      <div className="row justify-content-center">
        <div className="btn-group" role="group">
          {centerButton}
        </div>
      </div>
    </div>
  );
}
