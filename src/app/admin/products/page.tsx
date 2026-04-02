import Link from "next/link";
import { ConfirmActionDialog } from "@/components/admin/confirm-action-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/ui/section-heading";
import { deleteProductAction, upsertProductAction } from "@/actions/admin";
import { getAdminProducts } from "@/lib/site-data";
import { formatCurrency } from "@/lib/utils";

type PageProps = {
  searchParams: Promise<{ edit?: string }>;
};

export const metadata = {
  title: "Manage products",
  description: "Create, edit, and delete merch products.",
};

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { edit } = await searchParams;
  const products = await getAdminProducts();
  const current = edit ? products.find((product) => product.id === edit) : null;

  const lowStockCount = products.filter((product) => product.inventory <= 10).length;
  const activeCount = products.filter((product) => product.active).length;

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-[#d7decf] bg-[linear-gradient(180deg,#ffffff_0%,#f6faf2_100%)] p-8 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
        <p className="text-xs uppercase tracking-[0.28em] text-[#80916f]">Products</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[#132414]">
          Manage merch drops
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#5e6c5a]">
          Add new products, edit pricing, and keep inventory visible to the store.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#5e6c5a]">
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {products.length} products
          </div>
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {activeCount} active
          </div>
          <div className="rounded-full border border-[#d7decf] bg-white px-4 py-2 shadow-[0_12px_28px_rgba(15,35,18,0.03)]">
            {lowStockCount} low stock
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <form
          action={upsertProductAction}
          className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]"
        >
          <SectionHeading
            eyebrow={current ? "Edit product" : "New product"}
            title={current ? "Update the selected product" : "Create a new product"}
            description="Use a real image URL or upload a file to Cloudinary if credentials are configured."
            className="mb-6"
          />
          <input type="hidden" name="id" defaultValue={current?.id ?? ""} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input name="name" defaultValue={current?.name ?? ""} placeholder="Product name" required />
            <Input name="slug" defaultValue={current?.slug ?? ""} placeholder="product-slug" required />
            <Input name="category" defaultValue={current?.category ?? ""} placeholder="Category" required />
            <Input
              name="priceCents"
              type="number"
              min="0"
              defaultValue={current?.priceCents ?? 0}
              placeholder="Price in cents"
              required
            />
            <Input
              name="compareAtPriceCents"
              type="number"
              min="0"
              defaultValue={current?.compareAtPriceCents ?? ""}
              placeholder="Compare-at price"
            />
            <Input
              name="inventory"
              type="number"
              min="0"
              defaultValue={current?.inventory ?? 0}
              placeholder="Inventory"
              required
            />
            <Input
              name="imageUrl"
              defaultValue={current?.imageUrl ?? "/images/product-tee.svg"}
              placeholder="Image URL"
              className="sm:col-span-2"
            />
            <Input type="file" name="imageFile" accept="image/*" className="sm:col-span-2" />
            <Input
              name="galleryUrls"
              defaultValue={current?.galleryUrls.join(", ") ?? ""}
              placeholder="Gallery URLs separated by commas"
              className="sm:col-span-2"
            />
            <label className="flex items-center gap-3 rounded-2xl border border-[#d7decf] bg-[#f7f9f3] px-4 py-3">
              <input type="checkbox" name="featured" defaultChecked={current?.featured ?? false} />
              <span className="text-sm text-[#5e6c5a]">Featured</span>
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-[#d7decf] bg-[#f7f9f3] px-4 py-3">
              <input type="checkbox" name="active" defaultChecked={current?.active ?? true} />
              <span className="text-sm text-[#5e6c5a]">Active</span>
            </label>
          </div>
          <Textarea
            name="description"
            defaultValue={current?.description ?? ""}
            placeholder="Product description"
            className="mt-4"
            required
          />
          <Button type="submit" className="mt-4 w-full">
            {current ? "Update product" : "Create product"}
          </Button>
        </form>

        <div className="rounded-[32px] border border-[#d7decf] bg-white p-6 shadow-[0_18px_40px_rgba(15,35,18,0.05)]">
          <SectionHeading
            eyebrow="Store catalog"
            title="Current merch lineup"
            description="Edit or delete the products currently exposed on the storefront."
            className="mb-6"
          />
          <div className="space-y-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-[24px] border border-[#dce5cf] bg-[#f7f9f3] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#132414]">{product.name}</p>
                    <p className="text-sm text-[#5e6c5a]">{product.category}</p>
                    <p className="text-xs text-[#899885]">
                      {formatCurrency(product.priceCents)} - Stock {product.inventory}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products?edit=${product.id}`}
                      className="rounded-full border border-[#d7decf] bg-white px-3 py-2 text-xs text-[#5e6c5a] transition hover:bg-[#eef3e7] hover:text-[#132414]"
                    >
                      Edit
                    </Link>
                    <ConfirmActionDialog
                      triggerLabel="Delete"
                      title="Delete this product?"
                      description={`This will remove ${product.name} from the storefront catalog.`}
                      confirmLabel="Delete product"
                      action={deleteProductAction}
                      fields={{ id: product.id }}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-[#899885]">
                  <span>
                    {product.inventory === 0
                      ? "Sold out"
                      : product.inventory <= 10
                        ? `Low stock: ${product.inventory}`
                        : `${product.inventory} in stock`}
                  </span>
                  {product.active ? (
                    <span className="text-[#5f7d47]">Active</span>
                  ) : (
                    <span className="text-[#899885]">Inactive</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
