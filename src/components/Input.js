import { GetInput } from '../redux/interface';
import { useDispatch } from 'react-redux';
import { updateInput } from '../redux/slices/inputsSlice';

export default function Input(props) {
    const dispatch = useDispatch();

    const getInputType = function () {
        switch (props.name) {
            case "email":
                return "email";
            case "password":
                return "password";
            case "size":
                return "number";
            default:
                return "text";
        }
    }

    const getValue = function () {
        return GetInput(props.group, props.name) || "";
    }

    const setValue = function (e) {
        dispatch(updateInput({ group: props.group, name: props.name, value: e.target.value }));
    }

    return (
        <input name={props.name} type={getInputType()} placeholder={props.humanName} onChange={setValue} value={getValue()} />
    );
}