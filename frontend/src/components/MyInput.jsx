import PropTypes from 'prop-types';

const MyInput = ({
  disabled = false,
  errorMessage = '',
  hasError = false,
  icon = null,
  id = '',
  name,
  onChange,
  placeholder,
  required = false,
  strengthColor = '',
  strengthMessage = '',
  type = 'text',
  value,
}) => (
  <div className="mb-4">
    <div
      className={`shadow-form-shadow relative flex items-center rounded-2xl border-2 border-Indigo bg-Darkness px-3 py-2 transition-all duration-1000 ${hasError ? 'border-red-500' : 'focus-within:shadow-button-shadow focus-within:border-Indigo'}`}
    >
      <input
        className="w-full border-none bg-transparent pl-2 text-White outline-none focus:ring-0"
        disabled={disabled}
        id={id}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
        onChange={onChange}
      />
      {icon && (
        <div className="cursor-pointer text-gray-700 transition-all duration-500 hover:text-gray-200">
          {icon}
        </div>
      )}
      {value && strengthMessage && (
        <p className={`absolute right-12 text-sm ${strengthColor}`}>{strengthMessage}</p>
      )}
    </div>
    {hasError && errorMessage && (
      <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
    )}
  </div>
);

MyInput.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  errorMessage: PropTypes.string,
  hasError: PropTypes.bool,
  icon: PropTypes.node,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  strengthColor: PropTypes.string,
  strengthMessage: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default MyInput;
