/*
  Warnings:

  - The primary key for the `wl_pier_cloud_sellers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `wl_pier_cloud_sellers` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "wl_pier_cloud_sellers" DROP CONSTRAINT "wl_pier_cloud_sellers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "wl_pier_cloud_sellers_pkey" PRIMARY KEY ("id");
