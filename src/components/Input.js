import { GetInput } from 'redux/interface';
import { useDispatch } from 'react-redux';
import { updateInput } from 'redux/slices/inputsSlice';

export default function Input(props) {
    const dispatch = useDispatch();

    const detectInputType = function () {
        switch (props.name) {
            case "email":
                return "email";
            case "password":
                return "password";
            default:
                return "text";
        }
    }

    const setValue = function (e) {
        let value = e.target.value;
        if (
            !isNaN(props.decimalPlaces)
            && value.includes('.')
            && value.toString().split('.')[1].length > props.decimalPlaces
        ) {
            return;
        }

        dispatch(updateInput({ group: props.group, name: props.name, value: value }));
    }

    let editValue = GetInput(props.group, props.name);
    let value = editValue == null ? props.value : editValue;
    let displayValue = props.disabled ? props.value : value;

    return (
        // <div>
        // <label htmlFor={props.name}>{props.humanName}</label>
        <input
            name={props.name}
            className={props.className}
            type={props.type || detectInputType()}
            placeholder={props.humanName}
            onChange={setValue}
            value={displayValue || ""}
            disabled={props.disabled}
            // Input default width is defined by its size. Size the input by the char length of its value.
            size={displayValue ? displayValue.length : 10}
            // This is so that I don't have to, in this component, 
            // provide for every possible input attribute one might want to use.
            {...props.attributes}
        />
        // </div>
    );
}