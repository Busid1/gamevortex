import { Link } from "react-router-dom";
import "./paymentGateway.css";
import { HOME_URL } from "../../App";

export default function PaymentGateway({ isPaymentCorrect, isActivateCode }) {
    return (
        <div className="paymentGateway-container">
            <Link to={`${HOME_URL}`} title="home" className="gameVortexCart-logo"></Link>
            <div className="progress-steps">
                <div>
                    <span className="step active">
                        <span className="number">1</span>
                        <span className="text">Cart</span>
                        <span className="spacer"></span>
                    </span>
                </div>
                <div>
                    <span className={isPaymentCorrect ? "step active" : "step"}>
                        <span className="number">2</span>
                        <span className="text">Payment</span>
                        <span className="spacer"></span>
                    </span>
                </div>
                <div>
                    <span className={isActivateCode ? "step active" : "step"}>
                        <span className="number">3</span>
                        <span className="text">Activate code</span>
                    </span>
                </div>
            </div>
        </div>
    )
}