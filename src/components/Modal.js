
export default function Modal(props) {
    return <div className="modal">
        <div className={`modal-inner ${props.className}`}>
            <div className="close" onClick={props.close}>x</div>
            <div className="modal-title">{props.title}</div>
            <div className="modal-body">
                {props.bodyIsArray ?
                    props.body
                    :
                    <div className="modal-body-text">
                        {props.body}
                    </div>
                }
                {props.buttonFunction &&
                    <button className="button" onClick={props.buttonFunction}>
                        {props.buttonText}
                    </button>
                }
            </div>
        </div>
    </div>
}