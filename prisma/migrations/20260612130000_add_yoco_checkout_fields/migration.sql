ALTER TABLE "Order" ADD COLUMN "yocoCheckoutId" TEXT;
ALTER TABLE "Order" ADD COLUMN "yocoPaymentId" TEXT;

CREATE UNIQUE INDEX "Order_yocoCheckoutId_key" ON "Order"("yocoCheckoutId");
CREATE UNIQUE INDEX "Order_yocoPaymentId_key" ON "Order"("yocoPaymentId");
