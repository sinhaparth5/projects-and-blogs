"use client";

import { forwardRef, memo } from "react";
import TiptapEditor, { type TiptapEditorHandle } from "@/components/editor/TiptapEditor";

export type ArticleBodyFieldHandle = TiptapEditorHandle;

type Props = {
  initialValue?: string;
  placeholder?: string;
};

// The document lives inside TipTap — no HTML string is mirrored into React
// state, so typing in the body never re-renders the parent form, and (via
// memo) typing in the parent form's other fields never re-renders the editor.
// Callers read/write the body through the ref (save, docx import).
const ArticleBodyField = memo(
  forwardRef<ArticleBodyFieldHandle, Props>(function ArticleBodyField(
    { initialValue = "", placeholder },
    ref,
  ) {
    return <TiptapEditor ref={ref} initialValue={initialValue} placeholder={placeholder} />;
  }),
);

export default ArticleBodyField;
