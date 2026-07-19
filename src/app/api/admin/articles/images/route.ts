import { randomUUID } from "node:crypto";
import { isAdmin } from "@/lib/auth/session";
import { uploadArticleImage, validateRasterImage } from "@/lib/r2/images";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "Expected a multipart form upload." },
      { status: 400 },
    );
  }

  const upload = formData.get("file");
  if (!(upload instanceof File)) {
    return Response.json(
      { error: "Choose an image to upload." },
      { status: 400 },
    );
  }

  if (upload.size > 8 * 1024 * 1024) {
    return Response.json(
      { error: "Images must be no larger than 8 MB." },
      { status: 413 },
    );
  }

  const bytes = new Uint8Array(await upload.arrayBuffer());
  const validation = validateRasterImage(upload, bytes);

  if ("error" in validation) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const key = `articles/${year}/${month}/${randomUUID()}.${validation.extension}`;

  try {
    const url = await uploadArticleImage({
      bytes,
      contentType: validation.mime,
      key,
    });
    return Response.json({ url }, { status: 201 });
  } catch (error) {
    console.error("R2 article image upload failed", error);
    return Response.json(
      { error: "Image upload failed. Try again." },
      { status: 502 },
    );
  }
}
