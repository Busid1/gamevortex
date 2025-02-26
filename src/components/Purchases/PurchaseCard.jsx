import { Link } from "react-router-dom";

export default function PurchaseCard({id, title, image, activationCode}) {
    return (
        <div key={id} className="d-flex flex-column gap-3" id="purchaseCard">
            <div className="d-flex flex-column gap-3">
                <img className="rounded w-full" src={image} alt={title} />
                <div className="d-flex flex-column gap-2">
                    <Link to={`/${title}`} className="text-warning">
                        {title}
                    </Link>
                    <span className="text-white">Activation code: {activationCode}</span>
                </div>
            </div>
            <hr className="d-flex align-self-center p-2 text-warning w-75" />
        </div>
    )
}