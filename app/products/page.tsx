import { Suspense } from "react";
import ProductsClient from "@/components/products/ProductsClient";

export default function ProductsPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsClient />
      </Suspense>
    </div>
  );
}
