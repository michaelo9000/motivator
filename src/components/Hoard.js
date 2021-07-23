import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateFromLocal } from '../redux/slices/prizeSlice';
import { updatePrize } from '../firebase/firebase';
import Modal from './Modal';

export default function Hoard(props) {
    const dispatch = useDispatch();

    const redeemCoupon = function (prize) {
        let redeemed = prize.redeemed || 0;
        prize.redeemed = redeemed + 1;
        dispatch(updateFromLocal(prize));
        updatePrize(prize);
    }

    let couponData = [];

    props.prizes
        .forEach((prize, i) => {
            for (var x = 0; x < prize.claimed; x++) {
                let redeemed = x < prize.redeemed;
                couponData.push({
                    redeemed: redeemed,
                    jsx: <Coupon key={prize.name + x} redeemed={redeemed} prize={prize} redeemFunction={redeemCoupon} />
                });
            }
        });

    let coupons = couponData.sort(i => i.redeemed ? 1 : -1).map(i => i.jsx)

    return <Modal
        close={() => props.close()}
        title="My coupon hoard"
        body={coupons}
        bodyIsArray
        className="large"
    />
}

function Coupon(props) {
    const [buttonDisabled, setButtonDisabled] = useState();

    const redeem = function () {
        setButtonDisabled();
        props.redeemFunction(props.prize)
    }

    return <div className={`coupon ${props.redeemed ? 'redeemed' : 'available'}`}>
        <div className="coupon-inner">
            <div className="mb-40 flex between align-start">
                <div className="coupon-text flex column align-start">
                    <div className="coupon-title">1 (ONE) {props.prize.name}</div>
                    <div className="coupon-subtitle">Up to the value of ${props.prize.costDollars}</div>
                </div>
                <Barcode maxWidth={100} />
            </div>
            <button disabled={buttonDisabled || props.redeemed} onClick={redeem}>REDEEM {props.prize.name}</button>
        </div>
    </div>
}

function Barcode(props) {
    let lines = [];
    let width = 0;

    // Always start with a line.
    let gapTime = false;

    while (width < props.maxWidth - 5) {
        let bigTime = Math.random() > 0.5;
        lines.push(<div className={`line ${bigTime ? 'thick' : 'thin'}${gapTime ? ' gap' : ''}`} />);
        // Always alternate.
        gapTime = !gapTime;
        width += bigTime ? 5 : 3;
    }

    // Always finish on a line too.
    if (!gapTime)
        lines.push(<div className={`line thin`} />);

    return <div className="barcode">
        {lines}
    </div>
}