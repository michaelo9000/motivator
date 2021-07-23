import React from "react";
import { useDispatch } from "react-redux";
import { updatePrize } from '../firebase/firebase';
import { updateFromLocal } from '../redux/slices/prizeSlice';
import { minutesPerToken } from "../helpers/consts";
import { clearError, error } from '../redux/slices/userSlice';

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
            updatePrize(prize);
        }, 1000);
    }

    const confirm = function () {
        props.confirm({
            title: 'Confirm claim prize',
            body: `Spend ${costTokens} tokens to get ${prize.name}?`,
            buttonText: 'yes',
            callback: claimPrize,
        });
    }

    return (
        <div className="prize">
            <div className="flex between align-start">
                <div className="card-text mb-20">
                    <div className="card-name">{prize.name || "[name missing]"}</div>
                    <div className="card-description">{prize.description || "[description missing]"}</div>
                </div>
                <div className="circle-button">
                    <div onClick={confirm} className="circle-button-surface">✓</div>
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
        </div>
    );
}