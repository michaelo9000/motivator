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
    let displayValue = editValue;

    if (!editValue && editValue !== '')
        displayValue = props.value;

    let size = displayValue ? displayValue.length : 5;
    if (size < 3) size = 3;

    return (
        // <div>
        // <label htmlFor={props.name}>{props.humanName}</label>
        <Element
            name={props.name}
            className={`${props.className}${props.editing ? ' editing' : ''}`}
            style={props.style}
            type={props.type || detectInputType()}
            placeholder={props.humanName}
            onChange={setValue}
            value={displayValue || ""}
            disabled={props.disabled}
            // Input default width is defined by its size. Size the input by the char length of its value.
            size={size}
            // This is so that I don't have to, in this component, 
            // provide for every possible input attribute one might want to use.
            {...props.attributes}
            useTextarea={props.useTextarea}
        />
        // </div>
    );
}

function Element(props) {
    let { useTextarea, ...elementProps } = props;
    if (useTextarea)
        // The Textarea is 30 characters wide, and one row is 27px high.
        elementProps.style = { ...props.style, height: Math.ceil(props.size / 30) * 27 }
    return useTextarea ? <textarea {...elementProps}></textarea> : <input {...elementProps} />
}