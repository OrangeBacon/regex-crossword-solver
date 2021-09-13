import "./SizeControls.css";

export default function SizeControls(props) {
  return (
    <div className="container input-group">
      <div className="col form-floating">
        <input
          type="number"
          className="form-control width-control"
          placeholder="Width"
          max="20"
          min="1"
          value={props.width}
          onChange={(e) =>
            props.onChange({ width: parseInt(e.target.value, 10) })
          }
          onWheel={(e) => e.target.blur()}
        />
        <label htmlFor="width">Width</label>
      </div>
      <span className="input-group-text">x</span>
      <div className="col form-floating">
        <input
          type="number"
          className="form-control height-control"
          placeholder="Height"
          max="20"
          min="1"
          value={props.height}
          onChange={(e) =>
            props.onChange({ height: parseInt(e.target.value, 10) })
          }
          onWheel={(e) => e.target.blur()}
        />
        <label htmlFor="height">Height</label>
      </div>
    </div>
  );
}
