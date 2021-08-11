import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { GetReducer } from 'redux/interface';
import { clearForm } from "redux/slices/inputsSlice";
import { updateObject } from 'firebase-files/firebase';
import { updateFromLocal } from 'redux/slices/prizeSlice';
import { minutesPerToken } from "helpers/consts";
import { clearError, error } from 'redux/slices/userSlice';
import Input from 'components/Input';

export default function Prize(props) {
    let prize = props.data;
    const groupName = `editPrize-${prize.id}`;
    let user = props.user;
    const inputs = GetReducer('inputs')[groupName];
    let dispatch = useDispatch();
    let costTokens = Math.round(prize.costDollars / (user.budget / (user.goalMinutesWeekly / minutesPerToken)));
    const [editing, setEditing] = useState();

    const claimPrize = function () {
        props.confirm(null);

        if (props.userTokens < costTokens) {
            dispatch(error("Not enough tokens!"));
            setTimeout(() => {
                dispatch(clearError());
            }, 2000);
            return;
        }

        props.tokenAnimation(-costTokens);

        setTimeout(() => {
            let claimed = prize.claimed || 0;
            prize.claimed = claimed + 1;
            dispatch(updateFromLocal(prize));
            updateObject('prizes', prize);
            // The tokenAnimation takes 1 second
        }, 1000);
    }

    const confirmClaim = function () {
        props.confirm({
            title: 'Confirm claim prize',
            body: `Spend ${costTokens} tokens to get ${prize.name}?`,
            buttonText: 'yes',
            callback: claimPrize,
        });
    }

    const removePrize = function () {
        props.confirm(null);
        prize.removed = true;
        dispatch(updateFromLocal(prize));
        updateObject('prizes', prize);
    }

    const confirmRemove = function () {
        props.confirm({
            title: `Remove ${prize.name}?`,
            body: `Any unredeemed coupons will remain, but you will no longer be able to claim this prize. There is currently no undo for this action.`,
            buttonText: 'Remove',
            callback: removePrize,
        });
    }

    const confirmEdit = function () {
        // Combine the existing object with the values held in inputs. Input values will overwrite object values.
        let updatedPrize = { ...prize, ...inputs };

        dispatch(updateFromLocal(updatedPrize));
        updateObject('prizes', updatedPrize);

        dispatch(clearForm(groupName));
        setEditing();
    }

    return (
        <div className="card">
            <div className="close" onClick={confirmRemove} >x</div>
            <div className="edit" onClick={editing ? confirmEdit : setEditing}>
                {editing ?
                    '✓'
                    :
                    <div className="edit-icon">
                        <div className="edit-icon-component rubber-dome" />
                        <div className="edit-icon-component rubber" />
                        <div className="edit-icon-component dome-border" />
                        <div className="edit-icon-component dome" />
                        <div className="edit-icon-component shaft" />
                        <div className="edit-icon-component dome-border" />
                        <div className="edit-icon-component dome" />
                        <div className="edit-icon-component tip" />
                    </div>
                }
            </div>
            <div className="flex between align-start">
                <div className="card-text mb-20">
                    <div className="flex between align-start mb-20">
                        <Input name="name" humanName="Task name" group={groupName}
                            value={prize.name} editing={editing} disabled={!editing}
                            attributes={{ maxLength: "18" }} className="blend-in bold" />
                        <span style={{ display: editing ? 'initial' : 'none' }}>-</span>
                        <Input name="costDollars" group={groupName}
                            value={prize.costDollars} editing={editing} disabled={!editing}
                            decimalPlaces={0} type="text" className="blend-in"
                            style={{ display: editing ? 'initial' : 'none' }} />
                    </div>
                    <Input name="description" humanName="A short description" group={groupName}
                        value={prize.description} editing={editing} disabled={!editing}
                        attributes={{ maxLength: "72" }} className="blend-in" useTextarea />
                </div>
            </div>
            <div className="flex between">
                <div className="card-value-circle reward">
                    <div className="card-value">
                        Cost:
                        <span className="card-value-number">{costTokens || 0}</span>
                        tokens
                    </div>
                </div>
                <div className="circle-button">
                    <div onClick={confirmClaim} className="circle-button-surface">✓</div>
                    <div className="circle-button-depth" />
                </div>
                <div className="card-value-circle count">
                    <div className="card-value">
                        Claimed
                        <span className="card-value-number">{prize.claimed || 0}</span>
                        times
                    </div>
                </div>
            </div>
        </div >
    );
}