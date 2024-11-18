-- AlterTable
CREATE SEQUENCE wl_pier_cloud_sellers_id_seq;
ALTER TABLE "wl_pier_cloud_sellers" ALTER COLUMN "id" SET DEFAULT nextval('wl_pier_cloud_sellers_id_seq');
ALTER SEQUENCE wl_pier_cloud_sellers_id_seq OWNED BY "wl_pier_cloud_sellers"."id";

-- CreateTable
CREATE TABLE "wl_pier_cloud_clients" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wl_pier_cloud_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wl_pier_cloud_products" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "preco" DECIMAL(65,30) NOT NULL,
    "sku" TEXT NOT NULL,
    "vendedor_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wl_pier_cloud_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wl_pier_cloud_sales" (
    "id" SERIAL NOT NULL,
    "vendedor_id" INTEGER,
    "produto_id" INTEGER,
    "cliente_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wl_pier_cloud_sales_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "wl_pier_cloud_products" ADD CONSTRAINT "wl_pier_cloud_products_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "wl_pier_cloud_sellers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wl_pier_cloud_sales" ADD CONSTRAINT "wl_pier_cloud_sales_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "wl_pier_cloud_sellers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wl_pier_cloud_sales" ADD CONSTRAINT "wl_pier_cloud_sales_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "wl_pier_cloud_products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wl_pier_cloud_sales" ADD CONSTRAINT "wl_pier_cloud_sales_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "wl_pier_cloud_clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;
