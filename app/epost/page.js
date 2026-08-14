import { notFound } from "next/navigation";

import { EpostPreviewClient } from "./EpostPreviewClient";

export const metadata = {
  title: "E-postförhandsvisning",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EpostPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <EpostPreviewClient />;
}
