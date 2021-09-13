export default function RegexEditor(props) {
  const editors = [
    "Top (left -> right)",
    "Right (top -> bottom)",
    "Botton (left -> right)",
    "Left (top -> bottom)"
  ];
  return editors.map((name, idx) => (
    <RegexSubEditor
      name={name}
      content={props.content[idx]}
      count={idx % 2 === 0 ? props.width : props.height}
      onChange={props.onChange}
      changeIdx={idx}
      key={idx}
    />
  ));
}

function change(props, idx) {
  return (e) => {
    props.onChange(props.changeIdx, idx, e.target.value);
  };
}

function RegexSubEditor(props) {
  let editors = [];
  for (let i = 0; i < props.count; i++) {
    const id = `${props.name}${i}`;
    editors.push(
      <div className="row mb-3" key={i}>
        <label htmlFor={id} className="col-sm-2 col-form-label">
          Regex {i + 1}
        </label>
        <div className="col-sm-10">
          <input
            id={id}
            className="form-control"
            value={props.content[i]}
            onChange={change(props, i)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card mb-3">
        <div className="card-header">{props.name}</div>
        <div className="card-body">{editors}</div>
      </div>
    </div>
  );
}
