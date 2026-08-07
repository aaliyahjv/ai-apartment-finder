import { PrismaClient } from "@prisma/client";
import { mockApartments } from "../data/mock-apartments";

const prisma = new PrismaClient();

async function main() {
  for (const apartment of mockApartments) {
    await prisma.apartment.upsert({
      where: { id: apartment.id },
      update: {
        title: apartment.title,
        address: apartment.address,
        neighborhood: apartment.neighborhood,
        city: apartment.city,
        state: apartment.state,
        zipCode: apartment.zipCode,
        rent: apartment.rent,
        bedrooms: apartment.bedrooms,
        bathrooms: apartment.bathrooms,
        squareFeet: apartment.squareFeet,
        amenities: apartment.amenities,
        description: apartment.description,
        image: apartment.image,
        latitude: apartment.latitude,
        longitude: apartment.longitude,
      },
      create: {
        id: apartment.id,
        title: apartment.title,
        address: apartment.address,
        neighborhood: apartment.neighborhood,
        city: apartment.city,
        state: apartment.state,
        zipCode: apartment.zipCode,
        rent: apartment.rent,
        bedrooms: apartment.bedrooms,
        bathrooms: apartment.bathrooms,
        squareFeet: apartment.squareFeet,
        amenities: apartment.amenities,
        description: apartment.description,
        image: apartment.image,
        latitude: apartment.latitude,
        longitude: apartment.longitude,
      },
    });
  }

  const count = await prisma.apartment.count();
  console.log(`Seeded ${count} apartment(s).`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
