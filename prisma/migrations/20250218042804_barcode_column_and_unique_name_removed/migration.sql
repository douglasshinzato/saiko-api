/*
  Warnings:

  - You are about to drop the column `barcode` on the `Products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Products_barcode_key";

-- DropIndex
DROP INDEX "Products_name_key";

-- AlterTable
ALTER TABLE "Products" DROP COLUMN "barcode";
