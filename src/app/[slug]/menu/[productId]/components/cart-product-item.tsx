import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { CartContext, CartProduct } from "@/app/[slug]/menu/contexts/cart";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/format-currency";

interface CartItemProps {
  product: CartProduct;
}

const CartProductItem = ({ product }: CartItemProps) => {
  const { decreaseProductQuantity, increaseProductQuantity, removeProduct } = useContext(CartContext);

  return (
    <div className="flex items-center justify-between py-2">
      {/* ESQUERDA */}
      <div className="flex items-center gap-3">
        <div className="relative h-20 w-20 rounded-xl bg-gray-100">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover rounded-xl" />
        </div>
        <div className="space-y-1">
          <p className="max-w-[95%] truncate text-ellipsis text-xs">{product.name}</p>
          <p className="text-sm font-semibold">{formatCurrency(product.price)}</p>
          {/* QUANTIDADE */}
          <div className="flex items-center gap-1 text-center">
            <Button className="h-7 w-7 rounded-lg" variant="outline" onClick={() => decreaseProductQuantity(product.id)}>
              <ChevronLeftIcon />
            </Button>
            <p className="w-7 text-xs">{product.quantity}</p>
            <Button className="h-7 w-7 rounded-lg" variant="destructive" onClick={() => increaseProductQuantity(product.id)}>
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      </div>
      <Button className="ml-4 h-7 w-7 rounded-lg" variant="outline" onClick={() => removeProduct(product.id)}>
        <TrashIcon />
      </Button>
    </div>
  );
};

export default CartProductItem;