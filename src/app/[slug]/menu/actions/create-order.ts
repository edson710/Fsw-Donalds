"use server";

import { consumptionMethod } from "@prisma/client";

import { db } from "@/lib/prisma";

import { removeCpfPunctuation } from "../contexts/helpers/cpf";

interface CreateOrderInput {
  customerName: string;
  customerCpf: string;
  products: Array<{
    id: string;
    quantity: number;
  }>;
  consumptionMethod: consumptionMethod;
  slug: string;
}
export const createOrder = async (input: CreateOrderInput) => {
  const restaurant = await db.restaurant.findUnique({
    where: { slug: input.slug },
  });
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  const productWithPrices: Array<{ id: string; price: number }> =
    await db.product.findMany({
      where: { id: { in: input.products.map((product) => product.id) } },
    });
  const productWithPricesAndQuantities = input.products.map((product) => ({
    productId: product.id,
    quantity: product.quantity,
    price: productWithPrices.find((p) => p.id === product.id)!.price,
  }));
  await db.order.create({
    data: {
      consumptionMethod: input.consumptionMethod,
      status: "PENDING",
      customerName: input.customerName,
      customerCpf: removeCpfPunctuation(input.customerCpf),
      orderProducts: {
        createMany: {
          data: productWithPricesAndQuantities,
        },
      },
      total: productWithPricesAndQuantities.reduce(
        (acc, product) => acc + product.price * product.quantity,
        0,
      ),
      restaurant: {
        connect: { id: restaurant.id },
      },
    },
  });
};
