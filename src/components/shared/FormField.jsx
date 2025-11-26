function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
  step,
  min,
  max,
  disabled
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-titanium-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        step={step}
        min={min}
        max={max}
        disabled={disabled}
        className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  )
}

export default FormField
