import type { MetadataRoute } from "next";
import { DOMAIN } from "@/lib/store-config";

/* Keranjang, checkout, dan seluruh jalur API tidak perlu diindeks. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/keranjang", "/checkout"],
      },
    ],
    sitemap: `${DOMAIN}/sitemap.xml`,
    host: DOMAIN,
  };
}
