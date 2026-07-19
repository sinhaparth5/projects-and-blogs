import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const imageExtensions = {
  "image/avif": "avif",
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type RasterMime = keyof typeof imageExtensions;

function hasBytes(bytes: Uint8Array, offset: number, expected: number[]) {
  return expected.every((value, index) => bytes[offset + index] === value);
}

function hasText(bytes: Uint8Array, offset: number, expected: string) {
  return hasBytes(
    bytes,
    offset,
    [...expected].map((character) => character.charCodeAt(0)),
  );
}

function matchesFileSignature(bytes: Uint8Array, mime: RasterMime) {
  switch (mime) {
    case "image/jpeg":
      return hasBytes(bytes, 0, [0xff, 0xd8, 0xff]);
    case "image/png":
      return hasBytes(
        bytes,
        0,
        [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
      );
    case "image/gif":
      return hasText(bytes, 0, "GIF87a") || hasText(bytes, 0, "GIF89a");
    case "image/webp":
      return hasText(bytes, 0, "RIFF") && hasText(bytes, 8, "WEBP");
    case "image/avif":
      return (
        hasText(bytes, 4, "ftyp") &&
        (hasText(bytes, 8, "avif") || hasText(bytes, 8, "avis"))
      );
  }
}

export function validateRasterImage(file: File, bytes: Uint8Array) {
  if (!(file.type in imageExtensions)) {
    return { error: "Upload a JPEG, PNG, WebP, GIF, or AVIF image." } as const;
  }

  if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
    return { error: "Images must be between 1 byte and 8 MB." } as const;
  }

  const mime = file.type as RasterMime;
  if (!matchesFileSignature(bytes, mime)) {
    return { error: "The file contents do not match its image type." } as const;
  }

  return { mime, extension: imageExtensions[mime] } as const;
}

function requiredR2Config() {
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY;
  const secretAccessKey = process.env.R2_SECRET_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBaseUrl = process.env.R2_BASE_URL;

  if (
    !endpoint ||
    !accessKeyId ||
    !secretAccessKey ||
    !bucket ||
    !publicBaseUrl
  ) {
    throw new Error("R2 upload configuration is incomplete");
  }

  return {
    endpoint,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicBaseUrl: publicBaseUrl.replace(/\/+$/, ""),
  };
}

let r2Client: S3Client | undefined;

function getR2Client() {
  const config = requiredR2Config();

  r2Client ??= new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  return { client: r2Client, config };
}

export async function uploadArticleImage({
  bytes,
  contentType,
  key,
}: {
  bytes: Uint8Array;
  contentType: RasterMime;
  key: string;
}) {
  const { client, config } = getR2Client();

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: bytes,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  const publicKey = key.split("/").map(encodeURIComponent).join("/");
  return `${config.publicBaseUrl}/${publicKey}`;
}
