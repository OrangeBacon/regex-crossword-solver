import { useState } from "react";

export default function Rotation(props) {
  let [angle, setAngle] = useState(0);

  return (
    <>
      {props.children(angle)}
      <div className="container mb-3">
        <div className="row justify-content-center">
          <div className="btn-group" role="group">
            <button
              className="btn btn-outline-dark col-6"
              onClick={() => setAngle((angle - 45) % 360)}
            >
              ⟲ left
            </button>
            <button
              className="btn btn-outline-dark col-6"
              onClick={() => setAngle((angle + 45) % 360)}
            >
              right ⟳
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
