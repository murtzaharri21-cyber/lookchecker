import type { Metadata } from "next";

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://lookchecker.com";
const parsedSiteUrl = new URL(configuredSiteUrl);

if (parsedSiteUrl.protocol !== "https:" && parsedSiteUrl.protocol !== "http:") {
  throw new Error("NEXT_PUBLIC_SITE_URL must use HTTP or HTTPS.");
}

const isLocalHost = ["localhost", "127.0.0.1", "::1"].includes(parsedSiteUrl.hostname);
if (parsedSiteUrl.protocol === "http:" && !isLocalHost) parsedSiteUrl.protocol = "https:";
parsedSiteUrl.pathname = "/";
parsedSiteUrl.search = "";
parsedSiteUrl.hash = "";

export const siteUrl = parsedSiteUrl;
export const socialImage = "/images/face-report-concept.webp";

export function createSocialMetadata(
  title: string,
  description: string,
  path: string,
  type: "website" | "article" = "website",
  imageOptions?: { image: string; alt: string },
): Pick<Metadata, "openGraph" | "twitter"> {
  const image = imageOptions?.image ?? socialImage;
  const imageAlt = imageOptions?.alt ?? "Illustrative Look Checker face report concept";

  return {
    openGraph: {
      title,
      description,
      type,
      url: path,
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
