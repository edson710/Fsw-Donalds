import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";

import RestaurantCategories from "./components/categories";
import RestaurantHeader from "./components/header";

interface RestaurantMenuPageProps {
  params: { slug: string };
  searchParams: { consumptionMethod?: string };
}

const isConsumptionMethodValid = (consumptionMethod?: string) => {
  return ["DINE_IN", "TAKEWAY"].includes(
    consumptionMethod?.toUpperCase() || "",
  );
};

const RestaurantMenuPage = async ({
  params,
  searchParams,
}: RestaurantMenuPageProps) => {
  const { slug } = params;
  const consumptionMethod = searchParams.consumptionMethod;

  if (!isConsumptionMethodValid(consumptionMethod)) {
    return notFound();
  }

  try {
    const restaurant = await db.restaurant.findUnique({
      where: { slug },
      include: {
        menuCategories: {
          include: { products: true },
        },
      },
    });

    if (!restaurant) {
      return notFound();
    }

    return (
      <div className="relative h-[250px] w-full">
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-4 top-4 z-50 rounded-full"
        >
          <ChevronLeftIcon />
        </Button>

        {restaurant.coverImageUrl && (
          <Image
            src={restaurant.coverImageUrl}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        )}

        <Button
          variant="secondary"
          size="icon"
          className="absolute right-4 top-4 z-50 rounded-full"
        >
          <ScrollTextIcon />
        </Button>
        <RestaurantHeader restaurant={restaurant} />
        <RestaurantCategories restaurant={restaurant} />
      </div>
    );
  } catch (error) {
    console.error("Erro ao buscar restaurante:", error);
    return notFound();
  }
};

export default RestaurantMenuPage;