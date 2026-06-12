import { notFound } from "next/navigation";
import { saveProductAction } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { AdminImageUpload } from "@/components/admin/admin-image-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Edit product</CardTitle></CardHeader>
        <CardContent>
          <form action={saveProductAction} className="grid gap-4">
            <input type="hidden" name="id" value={product.id} />
            <div className="grid gap-2"><Label>Name</Label><Input name="name" defaultValue={product.name} required /></div>
            <div className="grid gap-2"><Label>Description</Label><Textarea name="description" defaultValue={product.description} required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2"><Label>Price cents</Label><Input name="priceCents" type="number" defaultValue={product.priceCents} required /></div>
              <div className="grid gap-2"><Label>Stock</Label><Input name="stock" type="number" defaultValue={product.stock} required /></div>
            </div>
            <div className="grid gap-2"><Label>Category</Label><Input name="category" defaultValue={product.category} required /></div>
            <div className="grid gap-2">
              <Label>Images</Label>
              <AdminImageUpload name="images" initialImages={product.images} multiple />
            </div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={product.featured} /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="active" defaultChecked={product.active} /> Active</label>
            <Button>Update product</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
