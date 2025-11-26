function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  required,
  disabled
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-titanium-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Selecciona una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FormSelect
