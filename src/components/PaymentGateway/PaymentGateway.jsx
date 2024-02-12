import "./paymentGateway.css";

export default function PaymentGateway() {
    return (
        <div className="paymentGateway-container">
            <a href="/" title="Home" className="gameVortexCart-logo" />
            <div className="progress-steps">
                <div>
                    <span className="step active">
                        <span className="number">1</span>
                        <span className="text">Cart</span>
                        <span className="spacer"></span>
                    </span>
                </div>
                <div>
                    <span className="step">
                        <span className="number">2</span>
                        <span className="text">Payment</span>
                        <span className="spacer"></span>
                    </span>
                </div>
                <div>
                    <span className="step">
                        <span className="number">3</span>
                        <span className="text">Activate code</span>
                    </span>
                </div>
            </div>
        </div>
    )
}