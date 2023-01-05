interface IField {
  name: string;
  label: string;
  type: string;
  autoComplete: string;
  required: boolean;
}

export default function Field({
  name,
  label,
  type,
  autoComplete,
  required,
}: IField) {
  return (
    <div>
      <label id={[name, "label"].join("-")} htmlFor={[name, "input"].join("-")}>
        {label} {required ? <span title="Required">*</span> : undefined}
      </label>
      <br />
      <input
        autoComplete={autoComplete}
        id={[name, "input"].join("-")}
        name={name}
        required={required}
        type={type}
      />
    </div>
  );
}
