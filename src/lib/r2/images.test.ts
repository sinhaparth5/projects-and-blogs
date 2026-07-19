import assert from "node:assert/strict";
import test from "node:test";
import { MAX_IMAGE_BYTES, validateRasterImage } from "./images";

function file(bytes: number[], type: string) {
  return new File([new Uint8Array(bytes)], "upload", { type });
}

test("accepts raster images whose signatures match their MIME type", () => {
  const pngBytes = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  const upload = file(pngBytes, "image/png");

  assert.deepEqual(validateRasterImage(upload, new Uint8Array(pngBytes)), {
    mime: "image/png",
    extension: "png",
  });
});

test("rejects SVG, spoofed content, empty files, and oversized files", () => {
  const svg = file(
    [...new TextEncoder().encode("<svg></svg>")],
    "image/svg+xml",
  );
  const spoofed = file([0x00, 0x01], "image/png");
  const empty = file([], "image/jpeg");
  const oversized = {
    type: "image/png",
    size: MAX_IMAGE_BYTES + 1,
  } as File;

  assert.ok("error" in validateRasterImage(svg, new Uint8Array()));
  assert.ok(
    "error" in validateRasterImage(spoofed, new Uint8Array([0x00, 0x01])),
  );
  assert.ok("error" in validateRasterImage(empty, new Uint8Array()));
  assert.ok("error" in validateRasterImage(oversized, new Uint8Array()));
});
