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

    const getValue = function () {
        return GetInput(props.group, props.name) || "";
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

    return (
        // <div>
        // <label htmlFor={props.name}>{props.humanName}</label>
        <input
            name={props.name}
            className={props.className}
            type={props.type || detectInputType()}
            placeholder={props.humanName}
            onChange={setValue}
            value={getValue()}
            disabled={props.disabled}
            {...props.attributes}
        />
        // </div>
    );
}