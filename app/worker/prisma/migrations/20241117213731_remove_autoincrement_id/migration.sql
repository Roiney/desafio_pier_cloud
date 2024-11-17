/*
  Warnings:

  - You are about to drop the column `sellerId` on the `wl_pier_cloud_sellers` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "wl_pier_cloud_sellers_sellerId_key";

-- AlterTable
ALTER TABLE "wl_pier_cloud_sellers" DROP COLUMN "sellerId",
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "wl_pier_cloud_sellers_id_seq";
