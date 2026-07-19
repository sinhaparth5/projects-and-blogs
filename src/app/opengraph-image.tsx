import { createSocialImage, socialImageSize } from "@/lib/seo-image";

export const alt = "Parth Sinha — Projects and Blogs";
export const size = socialImageSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createSocialImage({
    eyebrow: "Parth Sinha",
    title: "Projects & Blogs",
    description:
      "Full-stack engineering, software architecture, web performance, and interface craft.",
  });
}
