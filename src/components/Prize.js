import React from "react";
import { useDispatch } from "react-redux";
import { updateObject } from 'firebase-files/firebase';
import { updateFromLocal } from 'redux/slices/prizeSlice';
import { minutesPerToken } from "helpers/consts";
import { clearError, error } from 'redux/slices/userSlice';

export default function Prize(props) {
    let prize = props.data;
    let user = props.user;
    let dispatch = useDispatch();
    let costTokens = Math.round(prize.costDollars / (user.budget / (user.goalMinutesWeekly / minutesPerToken)));

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

    return (
        <div className="card">
            <div className="close" onClick={confirmRemove} >x</div>
            <div className="flex between align-start">
                <div className="card-text mb-20">
                    <div className="card-name">{prize.name || "[name missing]"}</div>
                    <div className="card-description">{prize.description || "[description missing]"}</div>
                </div>
                <div className="circle-button">
                    <div onClick={confirmClaim} className="circle-button-surface">✓</div>
                    <div className="circle-button-depth" />
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
                <div className="card-icon"></div>
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