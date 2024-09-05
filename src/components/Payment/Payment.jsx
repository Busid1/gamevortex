import './payment.css';
import CheckoutForm from './CheckoutForm';
import { useCart } from "../../contexts/CartContext";

export default function Payment({ total }) {
    const { cartVideogames } = useCart();

    return (
        <div>
            <button data-bs-toggle="modal" data-bs-target="#creditCardModal" className="btn btn-primary text-white">
                Add credit card
            </button>

            <div className="modal fade" id="creditCardModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content bg-white pb-3 px-3">
                        <div className="modal-header mb-2">
                            <h1 className="modal-title fs-5 text-black" id="exampleModalLabel">Credit card</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {
                            cartVideogames.map(({ title, price, id }) => (
                                <div key={id} className="d-flex justify-content-between px-3 my-1 gap-3">
                                    <span className="text-dark">{title}</span>
                                    <span className="text-dark">{price}</span>
                                </div>
                            ))
                        }
                        <div className="d-flex justify-content-between p-3">
                            <span className="text-dark">Total:</span>
                            <span className="text-dark">{total.toFixed(2)}</span>
                        </div>
                        <CheckoutForm total={total} />
                    </div>
                </div>
            </div >
        </div>
    );
}
