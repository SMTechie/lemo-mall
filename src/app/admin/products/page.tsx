import Link from "next/link";
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

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/6 p-8 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.28em] text-[#ffcc66]">Products</p>
        <h1 className="mt-4 text-4xl font-semibold text-[#f8f4e8]">Manage merch drops</h1>
        <p className="mt-3 text-sm leading-7 text-white/70">
          Add new products, edit pricing, and keep inventory visible to the store.
        </p>
      </section>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <form action={upsertProductAction} className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
          <SectionHeading
            eyebrow={current ? "Edit product" : "New product"}
            title={current ? "Update the selected product" : "Create a new product"}
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
            <div className="flex items-center gap-3">
              <input type="checkbox" name="featured" defaultChecked={current?.featured ?? false} />
              <span className="text-sm text-white/70">Featured</span>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" name="active" defaultChecked={current?.active ?? true} />
              <span className="text-sm text-white/70">Active</span>
            </div>
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

        <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 backdrop-blur">
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
                className="rounded-[24px] border border-white/10 bg-[#0b1020]/60 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-[#f8f4e8]">{product.name}</p>
                    <p className="text-sm text-white/55">{product.category}</p>
                    <p className="text-xs text-white/45">
                      {formatCurrency(product.priceCents)} • Stock {product.inventory}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products?edit=${product.id}`}
                      className="rounded-full border border-white/10 bg-white/6 px-3 py-2 text-xs text-white/70 transition hover:bg-white/12"
                    >
                      Edit
                    </Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={product.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-[#ff6b4a]/30 bg-[#ff6b4a]/10 px-3 py-2 text-xs text-[#ffd7cf]"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-white/45">
                  <span>
                    {product.inventory === 0
                      ? "Sold out"
                      : product.inventory <= 10
                        ? `Low stock: ${product.inventory}`
                        : `${product.inventory} in stock`}
                  </span>
                  {product.active ? (
                    <span className="text-[#91e4ff]">Active</span>
                  ) : (
                    <span className="text-white/35">Inactive</span>
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
