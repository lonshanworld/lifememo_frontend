import { useState } from "react";

export default function PaymentPopup({ onClose, onSubmit }) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("creditCard");

    const handlePaymentChange = (e) => {
        setSelectedPaymentMethod(e.target.value);
    };

    const handleSubmit = () => {
        if (selectedPaymentMethod) {
            onSubmit(selectedPaymentMethod);
            onClose();
        }
    };

  

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md shadow-md w-96">
                <h2 className="text-xl font-semibold mb-4">Choose Payment Method</h2>
                <div className="space-y-2">
                    <div>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="creditCard"
                                checked={selectedPaymentMethod === "creditCard"}
                                onChange={handlePaymentChange}
                                className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">Credit Card</span>
                        </label>
                    </div>
                    <div>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="paypal"
                                checked={selectedPaymentMethod === "paypal"}
                                onChange={handlePaymentChange}
                                className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">PayPal</span>
                        </label>
                    </div>
                    <div>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="bankTransfer"
                                checked={selectedPaymentMethod === "bankTransfer"}
                                onChange={handlePaymentChange}
                                className="form-radio h-4 w-4 text-indigo-600"
                            />
                            <span className="ml-2">Bank Transfer</span>
                        </label>
                    </div>
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                        onClick={handleSubmit}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
