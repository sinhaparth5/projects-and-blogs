"use client";

import { forwardRef, memo } from "react";
import TiptapEditor, { type TiptapEditorHandle } from "./TiptapEditor";

export type ArticleBodyFieldHandle = TiptapEditorHandle;

const ArticleBodyField = memo(
  forwardRef<
    ArticleBodyFieldHandle,
    {
      initialValue?: string;
      onChange?: (html: string) => void;
      describedBy?: string;
    }
  >(function ArticleBodyField(props, ref) {
    return <TiptapEditor ref={ref} {...props} />;
  }),
);

export default ArticleBodyField;
