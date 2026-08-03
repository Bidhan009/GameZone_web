"use client";

import { useState } from "react";
import AddToCartButton from "./AddToCartButton";

interface Props {
  productId: string;
  isInStock: boolean;
  stock: number;
  price: number;
}

export default function ProductPurchaseSection({
  productId,
  isInStock,
  stock,
  price,
}: Props) {
  const [quantity, setQuantity] = useState(1);

  const increase = () => {
    if (quantity < stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const subtotal = price * quantity;

  return (
    <div className="space-y-4">
      {isInStock && (
        <>
          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-gray-400 font-medium">Quantity:</span>

            <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={decrease}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white"
              >
                -
              </button>

              <span className="px-6 py-2 bg-[#1a1f29] text-white">
                {quantity}
              </span>

              <button
                onClick={increase}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white"
              >
                +
              </button>
            </div>
          </div>

          {/* Price Display */}
          <div className="text-lg text-gray-300">
            <p>
              Price: <span className="text-white">${price.toFixed(2)}</span>
            </p>
            <p>
              Subtotal:{" "}
              <span className="text-indigo-400 font-bold">
                ${subtotal.toFixed(2)}
              </span>
            </p>
          </div>
        </>
      )}

      <AddToCartButton
        productId={productId}
        isInStock={isInStock}
        quantity={quantity}
      />
    </div>
  );
}