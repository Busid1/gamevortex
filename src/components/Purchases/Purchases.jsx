import { usePurchases } from "../../contexts/PurchasesContext"
import PurchaseCard from "./PurchaseCard";
import "./purchases.css"

export default function Purchases() {
    const { purchases } = usePurchases();
    return (
        <div className="d-flex flex-column align-items-center gap-3" id="purchases-container">
            <h1 className="text-white mt-5">Purchases</h1>
            <div className="d-flex flex-wrap justify-content-center">
                {
                    purchases.length > 0 ?
                        purchases.map(({ id, title, image, activationCode }) => (
                            <PurchaseCard
                                id={id}
                                title={title}
                                image={image}
                                activationCode={activationCode}
                            />
                        ))
                        :
                        <p className="text-white fs-4 mt-5">There are still no games on the purchases :(</p>
                }
            </div>
        </div>
    )
}