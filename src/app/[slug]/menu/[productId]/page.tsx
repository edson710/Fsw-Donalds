import Image from "next/image";
import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

interface ProductPageProps {
  params: { slug: string; productId: string };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug, productId } = params;
  const product = await db.product.findUnique({ where: { id: productId } });
  if (!product) {
    return notFound();
  }
  return (
    <>
      <div className="relative h-[300px] w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-contain"
        />
      </div>
      <h1>Product page</h1>
      <p>{slug}</p>
      <p>{productId}</p>
    </>
  );
};

export default ProductPage;
