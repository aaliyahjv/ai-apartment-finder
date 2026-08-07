-- AlterTable: add required columns on a populated table via temporary defaults.
ALTER TABLE "Apartment" ADD COLUMN "state" TEXT NOT NULL DEFAULT 'WA',
ADD COLUMN "zipCode" TEXT NOT NULL DEFAULT '00000';

ALTER TABLE "Apartment" ALTER COLUMN "state" DROP DEFAULT;
ALTER TABLE "Apartment" ALTER COLUMN "zipCode" DROP DEFAULT;
