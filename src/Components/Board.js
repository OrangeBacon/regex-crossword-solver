import "./Board.css";

export default function Board(props) {
  const cellStyle = { transform: `rotate(${360 - props.angle}deg)` };

  // header row
  let head = [];
  for (let i = 0; i < props.width; i++) {
    head.push(
      <th key={`top${i}`} className="cell" style={cellStyle}>
        {i + 1}
      </th>
    );
  }

  let rows = [];
  for (let i = 0; i < props.height; i++) {
    let row = [
      <th key={`left${i}`} className="cell" style={cellStyle}>
        {i + 1}
      </th>
    ];
    for (let j = 0; j < props.width; j++) {
      row.push(
        <td key={`cell${j}x${i}`} className="cell" style={cellStyle}></td>
      );
    }
    row.push(
      <th key={`right${i}`} className="cell" style={cellStyle}>
        {i + 1}
      </th>
    );
    rows.push(<tr key={`row${i}`}>{row}</tr>);
  }

  // footer row
  let bottom = [];
  for (let i = 0; i < props.width; i++) {
    bottom.push(
      <th key={`bottom${i}`} className="cell" style={cellStyle}>
        {i + 1}
      </th>
    );
  }

  const size = Math.ceil(
    Math.sqrt(Math.pow(props.width + 2, 2) + Math.pow(props.height + 2, 2)) * 40
  );
  const sizingStyle = { height: size, width: size };
  const paddingStyle = { height: size, width: size, alignItems: "center" };
  const tableStyle = {
    height: `${(props.height + 2) * 40}px`,
    width: `${(props.width + 2) * 40}px`,
    transform: `rotate(${props.angle}deg)`
  };

  return (
    <div className="container mt-3 mb-3" style={sizingStyle}>
      <div className="row justify-content-center" style={paddingStyle}>
        <table className="table board" style={tableStyle}>
          <thead>
            <tr>
              <td />
              {head}
              <td />
            </tr>
          </thead>
          <tbody>{rows}</tbody>
          <tfoot>
            <tr>
              <td />
              {bottom}
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
