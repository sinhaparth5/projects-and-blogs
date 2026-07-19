"use client";

import CharacterCount from "@tiptap/extension-character-count";
import Highlight from "@tiptap/extension-highlight";
import ImageExtension from "@tiptap/extension-image";
import Mathematics from "@tiptap/extension-mathematics";
import Placeholder from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import { Color, TextStyle } from "@tiptap/extension-text-style";
import { NodeSelection } from "@tiptap/pm/state";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  BookOpenText,
  Code2,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Radical,
  Redo2,
  Sigma,
  Strikethrough,
  Table2,
  Underline,
  Undo2,
  Upload,
  X,
} from "lucide-react";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styles from "./editor.module.css";
import { ReferenceExtension } from "./ReferenceExtension";

const CustomImage = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
        renderHTML: (attributes) =>
          attributes.caption ? { "data-caption": attributes.caption } : {},
        parseHTML: (element) => element.getAttribute("data-caption"),
      },
      loading: { default: "lazy", renderHTML: () => ({ loading: "lazy" }) },
      decoding: { default: "async", renderHTML: () => ({ decoding: "async" }) },
    };
  },
}).configure({ allowBase64: true });

export interface TiptapEditorHandle {
  getHTML: () => string;
}

type ExistingRef = {
  refId: number;
  url: string;
  label: string;
  title: string;
};

type RefDialogState = {
  anchorText: string;
  refId: number;
  existing: ExistingRef[];
  append?: { pos: number; attachedIds: number[] };
};

type MathDialogState = {
  kind: "inline" | "block";
  latex: string;
  pos?: number;
};

function accessedDate() {
  return new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function webCitation(author: string, year: string, title: string, url: string) {
  const cleanAuthor = author.trim();
  const cleanTitle = title.trim();
  const cleanYear = year.trim() || "no date";
  const lead = cleanAuthor
    ? `${cleanAuthor} (${cleanYear})${cleanTitle ? ` ${cleanTitle}.` : ""}`
    : cleanTitle
      ? `${cleanTitle} (${cleanYear}).`
      : "";
  const tail = `Available at: ${url.trim()} (Accessed: ${accessedDate()}).`;
  return { label: lead ? `${lead} ${tail}` : tail, title: cleanTitle };
}

function bookCitation(
  author: string,
  year: string,
  title: string,
  place: string,
  publisher: string,
  page: string,
) {
  const cleanTitle = title.trim();
  let label = `${author.trim()} (${year.trim() || "no date"}) ${cleanTitle}.`;
  const publication = [place.trim(), publisher.trim()]
    .filter(Boolean)
    .join(": ");
  const details = [publication, page.trim() ? `p. ${page.trim()}` : ""].filter(
    Boolean,
  );
  if (details.length) label += ` ${details.join(", ")}.`;
  return { label, title: cleanTitle };
}

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={active ? styles.toolbarButtonActive : styles.toolbarButton}
      aria-label={label}
      title={label}
      aria-pressed={active || undefined}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default forwardRef<
  TiptapEditorHandle,
  {
    initialValue?: string;
    onChange?: (html: string) => void;
    describedBy?: string;
  }
>(function TiptapEditor({ initialValue = "", onChange, describedBy }, ref) {
  const fileInput = useRef<HTMLInputElement>(null);
  const imageDialog = useRef<HTMLDialogElement>(null);
  const linkDialog = useRef<HTMLDialogElement>(null);
  const referenceDialog = useRef<HTMLDialogElement>(null);
  const mathDialogRef = useRef<HTMLDialogElement>(null);
  const noticeDialog = useRef<HTMLDialogElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkOpen, setLinkOpen] = useState(false);
  const [referenceNotice, setReferenceNotice] = useState(false);
  const [mathDialog, setMathDialog] = useState<MathDialogState | null>(null);
  const [refDialog, setRefDialog] = useState<RefDialogState | null>(null);
  const [refType, setRefType] = useState<"url" | "book">("url");
  const [sourceUrl, setSourceUrl] = useState("");
  const [webAuthor, setWebAuthor] = useState("");
  const [webYear, setWebYear] = useState("");
  const [webTitle, setWebTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookYear, setBookYear] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookPlace, setBookPlace] = useState("");
  const [bookPublisher, setBookPublisher] = useState("");
  const [bookPage, setBookPage] = useState("");
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      CustomImage,
      Placeholder.configure({ placeholder: "Write the article…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      CharacterCount,
      TableKit.configure({ table: { resizable: true } }),
      Mathematics.configure({
        inlineOptions: {
          onClick: (node, pos) =>
            setMathDialog({
              kind: "inline",
              latex: String(node.attrs.latex ?? ""),
              pos,
            }),
        },
        blockOptions: {
          onClick: (node, pos) =>
            setMathDialog({
              kind: "block",
              latex: String(node.attrs.latex ?? ""),
              pos,
            }),
        },
        katexOptions: { throwOnError: false },
      }),
      ReferenceExtension,
    ],
    content: initialValue,
    onUpdate: ({ editor: currentEditor }) =>
      onChange?.(currentEditor.getHTML()),
  });

  useImperativeHandle(ref, () => ({ getHTML: () => editor?.getHTML() ?? "" }), [
    editor,
  ]);

  useEffect(() => {
    const dialog = imageDialog.current;
    if (pendingImage && dialog && !dialog.open) {
      dialog.showModal();
    }
  }, [pendingImage]);

  useEffect(() => {
    const dialog = linkDialog.current;
    if (linkOpen && dialog && !dialog.open) dialog.showModal();
  }, [linkOpen]);

  useEffect(() => {
    const dialog = referenceDialog.current;
    if (refDialog && dialog && !dialog.open) dialog.showModal();
  }, [refDialog]);

  useEffect(() => {
    const dialog = noticeDialog.current;
    if (referenceNotice && dialog && !dialog.open) dialog.showModal();
  }, [referenceNotice]);

  useEffect(() => {
    const dialog = mathDialogRef.current;
    if (mathDialog && dialog && !dialog.open) dialog.showModal();
  }, [mathDialog]);

  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current?.isActive("bold") ?? false,
      italic: current?.isActive("italic") ?? false,
      underline: current?.isActive("underline") ?? false,
      strike: current?.isActive("strike") ?? false,
      heading2: current?.isActive("heading", { level: 2 }) ?? false,
      heading3: current?.isActive("heading", { level: 3 }) ?? false,
      bulletList: current?.isActive("bulletList") ?? false,
      orderedList: current?.isActive("orderedList") ?? false,
      blockquote: current?.isActive("blockquote") ?? false,
      code: current?.isActive("code") ?? false,
      highlight: current?.isActive("highlight") ?? false,
      words: current?.storage.characterCount?.words() ?? 0,
      characters: current?.storage.characterCount?.characters() ?? 0,
    }),
  });

  if (!editor) {
    return <div className={styles.loading}>Loading editor…</div>;
  }

  function addLink() {
    setLinkUrl(editor?.getAttributes("link").href ?? "https://");
    setLinkOpen(true);
  }

  function openMathDialog(kind: MathDialogState["kind"]) {
    const selectedLatex = editor?.state.doc
      .textBetween(editor.state.selection.from, editor.state.selection.to, " ")
      .trim();
    setMathDialog({ kind, latex: selectedLatex ?? "" });
  }

  function closeMathDialog() {
    mathDialogRef.current?.close();
    setMathDialog(null);
  }

  function saveMath() {
    if (!editor || !mathDialog?.latex.trim()) return;
    const latex = mathDialog.latex.trim();
    const chain = editor.chain().focus();

    if (mathDialog.pos !== undefined) {
      chain.setNodeSelection(mathDialog.pos);
      if (mathDialog.kind === "inline") chain.updateInlineMath({ latex });
      else chain.updateBlockMath({ latex });
    } else {
      chain.deleteSelection();
      if (mathDialog.kind === "inline") chain.insertInlineMath({ latex });
      else chain.insertBlockMath({ latex });
    }

    chain.run();
    closeMathDialog();
  }

  function collectReferences() {
    let maxId = 0;
    const references = new Map<number, ExistingRef>();
    editor?.state.doc.descendants((node) => {
      if (node.type.name !== "reference") return;
      const refId = Number(node.attrs.refId);
      maxId = Math.max(maxId, refId);
      if (!references.has(refId)) {
        references.set(refId, {
          refId,
          url: String(node.attrs.url ?? ""),
          label: String(node.attrs.label ?? ""),
          title: String(node.attrs.title ?? ""),
        });
      }
    });
    return {
      existing: [...references.values()].sort((a, b) => a.refId - b.refId),
      nextId: maxId + 1,
    };
  }

  function resetReferenceFields() {
    setRefType("url");
    setSourceUrl("");
    setWebAuthor("");
    setWebYear("");
    setWebTitle("");
    setBookAuthor("");
    setBookYear("");
    setBookTitle("");
    setBookPlace("");
    setBookPublisher("");
    setBookPage("");
  }

  function addReference() {
    if (!editor) return;
    const selection = editor.state.selection;
    if (
      selection instanceof NodeSelection &&
      selection.node.type.name === "reference"
    ) {
      const $pos = editor.state.doc.resolve(selection.from);
      const parent = $pos.parent;
      let first = $pos.index();
      let last = first;
      while (first > 0 && parent.child(first - 1).type.name === "reference")
        first--;
      while (
        last < parent.childCount - 1 &&
        parent.child(last + 1).type.name === "reference"
      )
        last++;
      let pos = $pos.start();
      let runEnd = selection.to;
      let anchorText = "";
      const attachedIds: number[] = [];
      for (let index = 0; index <= last; index++) {
        const child = parent.child(index);
        if (index >= first) {
          attachedIds.push(Number(child.attrs.refId));
          if (!anchorText)
            anchorText = String(child.attrs.anchorText ?? "").trim();
          runEnd = pos + child.nodeSize;
        }
        pos += child.nodeSize;
      }
      const { existing, nextId } = collectReferences();
      resetReferenceFields();
      setRefDialog({
        anchorText: anchorText || "(citation)",
        refId: nextId,
        existing,
        append: { pos: runEnd, attachedIds },
      });
      return;
    }

    const { from, to } = selection;
    const anchorText = editor.state.doc.textBetween(from, to, " ").trim();
    if (from === to || !anchorText) {
      setReferenceNotice(true);
      return;
    }
    const { existing, nextId } = collectReferences();
    resetReferenceFields();
    setRefDialog({ anchorText, refId: nextId, existing });
  }

  function closeReferenceDialog() {
    referenceDialog.current?.close();
    setRefDialog(null);
  }

  function insertReference(reference: ExistingRef) {
    if (!editor || !refDialog) return;
    if (refDialog.append) {
      if (refDialog.append.attachedIds.includes(reference.refId)) {
        closeReferenceDialog();
        return;
      }
      editor
        .chain()
        .focus()
        .insertContentAt(refDialog.append.pos, {
          type: "reference",
          attrs: { anchorText: "", ...reference },
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent({
          type: "reference",
          attrs: { anchorText: refDialog.anchorText, ...reference },
        })
        .run();
    }
    closeReferenceDialog();
  }

  function submitReference() {
    if (!refDialog) return;
    const citation =
      refType === "url"
        ? webCitation(webAuthor, webYear, webTitle, sourceUrl)
        : bookCitation(
            bookAuthor,
            bookYear,
            bookTitle,
            bookPlace,
            bookPublisher,
            bookPage,
          );
    const url = refType === "url" ? sourceUrl.trim() : "";
    const duplicate = refDialog.existing.find((reference) =>
      url ? reference.url === url : reference.label === citation.label,
    );
    insertReference(
      duplicate ?? {
        refId: refDialog.refId,
        url,
        label: citation.label,
        title: citation.title,
      },
    );
  }

  function closeImageDialog() {
    if (uploading) return;
    imageDialog.current?.close();
    setPendingImage(null);
    setImageAlt("");
    setImageCaption("");
    setUploadError(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function uploadFile(file: File, alt: string, caption: string) {
    setUploading(true);
    setUploadError(null);
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/admin/articles/images/", {
        method: "POST",
        body: form,
      });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !result.url)
        throw new Error(result.error || "Upload failed");
      editor
        ?.chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: { src: result.url, alt, caption },
        })
        .run();
      imageDialog.current?.close();
      setPendingImage(null);
      setImageAlt("");
      setImageCaption("");
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  const citationPreview =
    refType === "url"
      ? webCitation(webAuthor, webYear, webTitle, sourceUrl)
      : bookCitation(
          bookAuthor,
          bookYear,
          bookTitle,
          bookPlace,
          bookPublisher,
          bookPage,
        );
  const canAddReference =
    refType === "url"
      ? Boolean(sourceUrl.trim())
      : Boolean(bookAuthor.trim() && bookTitle.trim());

  return (
    <div className={styles.editor} aria-describedby={describedBy}>
      <div
        className={styles.toolbar}
        role="toolbar"
        aria-label="Article formatting"
      >
        <ToolbarButton
          label="Bold"
          active={state?.bold}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={state?.italic}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          active={state?.underline}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Strikethrough"
          active={state?.strike}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={17} />
        </ToolbarButton>
        <span className={styles.divider} />
        <ToolbarButton
          label="Heading 2"
          active={state?.heading2}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 3"
          active={state?.heading3}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={state?.bulletList}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={state?.orderedList}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Blockquote"
          active={state?.blockquote}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Inline code"
          active={state?.code}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code2 size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Highlight"
          active={state?.highlight}
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()
          }
        >
          <Highlighter size={17} />
        </ToolbarButton>
        <span className={styles.divider} />
        <ToolbarButton
          label="Align left"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Align center"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Align right"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Justify"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify size={17} />
        </ToolbarButton>
        <ToolbarButton label="Add link" onClick={addLink}>
          <Link2 size={17} />
        </ToolbarButton>
        <ToolbarButton
          label={uploading ? "Uploading image" : "Upload image to R2"}
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
        >
          <Upload size={17} />
        </ToolbarButton>
        <ToolbarButton label="Add reference" onClick={addReference}>
          <BookOpenText size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Insert inline LaTeX formula"
          onClick={() => openMathDialog("inline")}
        >
          <Radical size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Insert block LaTeX formula"
          onClick={() => openMathDialog("block")}
        >
          <Sigma size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Insert table"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <Table2 size={17} />
        </ToolbarButton>
        <span className={styles.divider} />
        <ToolbarButton
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={17} />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={17} />
        </ToolbarButton>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          hidden
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              setPendingImage(file);
              setImageAlt("");
              setImageCaption("");
              setUploadError(null);
            }
          }}
        />
      </div>
      {uploadError && (
        <p className={styles.uploadError} role="alert">
          {uploadError}
        </p>
      )}
      <EditorContent editor={editor} className={styles.content} />
      <footer className={styles.footer}>
        {state?.words ?? 0} words · {state?.characters ?? 0} characters
      </footer>
      <dialog
        ref={mathDialogRef}
        className={styles.imageDialog}
        aria-labelledby="math-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          closeMathDialog();
        }}
      >
        <div className={styles.dialogPanel}>
          <div className={styles.dialogHeader}>
            <div>
              <p className={styles.dialogEyebrow}>LaTeX mathematics</p>
              <h2 id="math-dialog-title">
                {mathDialog?.pos !== undefined ? "Edit" : "Insert"}{" "}
                {mathDialog?.kind === "block" ? "block" : "inline"} formula
              </h2>
            </div>
            <button
              type="button"
              className={styles.dialogClose}
              aria-label="Close formula dialog"
              onClick={closeMathDialog}
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>
          <p className={styles.dialogCopy}>
            {mathDialog?.kind === "block"
              ? "Block formulas appear centred on a separate line."
              : "Inline formulas flow naturally with the surrounding text."}
          </p>
          <div className={styles.dialogField}>
            <label htmlFor="math-latex">LaTeX formula</label>
            <textarea
              id="math-latex"
              rows={4}
              autoFocus
              spellCheck={false}
              value={mathDialog?.latex ?? ""}
              placeholder="e.g. E = mc^2 or \\frac{a}{b}"
              onChange={(event) =>
                setMathDialog((current) =>
                  current ? { ...current, latex: event.target.value } : null,
                )
              }
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  saveMath();
                }
              }}
            />
            <p>
              Use Ctrl/Command + Enter to save. Dollar-sign wrappers are not
              needed.
            </p>
          </div>
          <div className={styles.dialogActions}>
            <button
              type="button"
              className={styles.dialogSecondary}
              onClick={closeMathDialog}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.dialogPrimary}
              disabled={!mathDialog?.latex.trim()}
              onClick={saveMath}
            >
              {mathDialog?.pos !== undefined
                ? "Update formula"
                : "Insert formula"}
            </button>
          </div>
        </div>
      </dialog>
      <dialog
        ref={linkDialog}
        className={styles.imageDialog}
        aria-labelledby="link-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          linkDialog.current?.close();
          setLinkOpen(false);
        }}
      >
        <div className={styles.dialogPanel}>
          <div className={styles.dialogHeader}>
            <div>
              <p className={styles.dialogEyebrow}>Hyperlink</p>
              <h2 id="link-dialog-title">Insert link</h2>
            </div>
            <button
              type="button"
              className={styles.dialogClose}
              aria-label="Close link dialog"
              onClick={() => {
                linkDialog.current?.close();
                setLinkOpen(false);
              }}
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>
          <div className={styles.dialogField}>
            <label htmlFor="link-url">URL</label>
            <input
              id="link-url"
              type="text"
              inputMode="url"
              value={linkUrl}
              placeholder="https://example.com"
              onChange={(event) => setLinkUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && linkUrl.trim()) {
                  event.preventDefault();
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: linkUrl.trim() })
                    .run();
                  linkDialog.current?.close();
                  setLinkOpen(false);
                }
              }}
            />
          </div>
          <div className={styles.dialogActions}>
            {editor.isActive("link") && (
              <button
                type="button"
                className={styles.dialogDanger}
                onClick={() => {
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .unsetLink()
                    .run();
                  linkDialog.current?.close();
                  setLinkOpen(false);
                }}
              >
                Remove link
              </button>
            )}
            <button
              type="button"
              className={styles.dialogSecondary}
              onClick={() => {
                linkDialog.current?.close();
                setLinkOpen(false);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.dialogPrimary}
              disabled={!linkUrl.trim()}
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  .extendMarkRange("link")
                  .setLink({ href: linkUrl.trim() })
                  .run();
                linkDialog.current?.close();
                setLinkOpen(false);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </dialog>
      <dialog
        ref={noticeDialog}
        className={styles.imageDialog}
        aria-labelledby="reference-notice-title"
        onCancel={(event) => {
          event.preventDefault();
          noticeDialog.current?.close();
          setReferenceNotice(false);
        }}
      >
        <div className={styles.dialogPanel}>
          <div className={styles.dialogHeader}>
            <div>
              <p className={styles.dialogEyebrow}>Reference</p>
              <h2 id="reference-notice-title">Select text first</h2>
            </div>
          </div>
          <p className={styles.dialogCopy}>
            Highlight the phrase you want to cite, then choose Add reference
            again.
          </p>
          <div className={styles.dialogActions}>
            <button
              type="button"
              className={styles.dialogPrimary}
              onClick={() => {
                noticeDialog.current?.close();
                setReferenceNotice(false);
                editor.chain().focus().run();
              }}
            >
              Got it
            </button>
          </div>
        </div>
      </dialog>
      <dialog
        ref={referenceDialog}
        className={`${styles.imageDialog} ${styles.referenceDialog}`}
        aria-labelledby="reference-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          closeReferenceDialog();
        }}
      >
        <div className={styles.dialogPanel}>
          <div className={styles.dialogHeader}>
            <div>
              <p className={styles.dialogEyebrow}>
                {refDialog?.append ? "Additional source" : "Harvard citation"}
              </p>
              <h2 id="reference-dialog-title">
                {refDialog?.append ? "Add another reference" : "Add reference"}
                <span className={styles.referenceNumber}>
                  {refDialog?.refId}
                </span>
              </h2>
            </div>
            <button
              type="button"
              className={styles.dialogClose}
              aria-label="Close reference dialog"
              onClick={closeReferenceDialog}
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>
          <div className={styles.anchorPreview}>
            <span>Anchor text</span>
            <p>{refDialog?.anchorText}</p>
            {refDialog?.append && (
              <small>
                The new number will appear beside the existing citation.
              </small>
            )}
          </div>
          {!!refDialog?.existing.length && (
            <div className={styles.reuseSection}>
              <p>Reuse an existing reference</p>
              <div className={styles.reuseList}>
                {refDialog.existing.map((reference) => (
                  <button
                    key={reference.refId}
                    type="button"
                    onClick={() => insertReference(reference)}
                  >
                    <span>{reference.refId}</span>
                    <span>{reference.label}</span>
                  </button>
                ))}
              </div>
              <small>or add a new source below</small>
            </div>
          )}
          <fieldset className={styles.referenceTypes}>
            <legend className={styles.srOnly}>Reference type</legend>
            <button
              type="button"
              className={
                refType === "url" ? styles.referenceTypeActive : undefined
              }
              onClick={() => setRefType("url")}
            >
              Website / Article
            </button>
            <button
              type="button"
              className={
                refType === "book" ? styles.referenceTypeActive : undefined
              }
              onClick={() => setRefType("book")}
            >
              Book
            </button>
          </fieldset>
          {refType === "url" ? (
            <div className={styles.referenceFields}>
              <label>
                URL <span aria-hidden="true">*</span>
                <input
                  type="text"
                  inputMode="url"
                  value={sourceUrl}
                  placeholder="https://example.com"
                  onChange={(event) => setSourceUrl(event.target.value)}
                />
              </label>
              <label>
                Author / organisation
                <input
                  value={webAuthor}
                  placeholder="e.g. The Hindu or Sen, A."
                  onChange={(event) => setWebAuthor(event.target.value)}
                />
              </label>
              <div className={styles.referenceFieldRow}>
                <label>
                  Year
                  <input
                    value={webYear}
                    placeholder="2026"
                    onChange={(event) => setWebYear(event.target.value)}
                  />
                </label>
                <label>
                  Page / article title
                  <input
                    value={webTitle}
                    placeholder="Article title"
                    onChange={(event) => setWebTitle(event.target.value)}
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className={styles.referenceFields}>
              <label>
                Author(s) <span aria-hidden="true">*</span>
                <input
                  value={bookAuthor}
                  placeholder="e.g. Amartya Sen"
                  onChange={(event) => setBookAuthor(event.target.value)}
                />
              </label>
              <label>
                Title <span aria-hidden="true">*</span>
                <input
                  value={bookTitle}
                  placeholder="e.g. The Idea of Justice"
                  onChange={(event) => setBookTitle(event.target.value)}
                />
              </label>
              <div className={styles.referenceFieldRow}>
                <label>
                  Year
                  <input
                    value={bookYear}
                    placeholder="2009"
                    onChange={(event) => setBookYear(event.target.value)}
                  />
                </label>
                <label>
                  Page(s)
                  <input
                    value={bookPage}
                    placeholder="42 or 42–48"
                    onChange={(event) => setBookPage(event.target.value)}
                  />
                </label>
              </div>
              <div className={styles.referenceFieldRow}>
                <label>
                  Place of publication
                  <input
                    value={bookPlace}
                    placeholder="e.g. Cambridge, MA"
                    onChange={(event) => setBookPlace(event.target.value)}
                  />
                </label>
                <label>
                  Publisher
                  <input
                    value={bookPublisher}
                    placeholder="e.g. Harvard University Press"
                    onChange={(event) => setBookPublisher(event.target.value)}
                  />
                </label>
              </div>
            </div>
          )}
          {canAddReference && (
            <div className={styles.citationPreview}>
              <span>Preview (Harvard style)</span>
              <p>{citationPreview.label}</p>
            </div>
          )}
          <div className={styles.dialogActions}>
            <button
              type="button"
              className={styles.dialogSecondary}
              onClick={closeReferenceDialog}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.dialogPrimary}
              disabled={!canAddReference}
              onClick={submitReference}
            >
              Add
            </button>
          </div>
        </div>
      </dialog>
      <dialog
        ref={imageDialog}
        className={styles.imageDialog}
        aria-labelledby="image-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          closeImageDialog();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeImageDialog();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeImageDialog();
          }
        }}
      >
        <div className={styles.dialogPanel}>
          <div className={styles.dialogHeader}>
            <div>
              <p className={styles.dialogEyebrow}>Upload to R2</p>
              <h2 id="image-dialog-title">Image details</h2>
            </div>
            <button
              type="button"
              className={styles.dialogClose}
              aria-label="Close image dialog"
              disabled={uploading}
              onClick={closeImageDialog}
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>
          <p className={styles.fileName} title={pendingImage?.name}>
            {pendingImage?.name}
          </p>
          <div className={styles.dialogField}>
            <label htmlFor="image-alt">Alternative text</label>
            <input
              id="image-alt"
              value={imageAlt}
              maxLength={300}
              disabled={uploading}
              placeholder="Describe what the image shows"
              onChange={(event) => setImageAlt(event.target.value)}
            />
            <p>Required for readers using assistive technology.</p>
          </div>
          <div className={styles.dialogField}>
            <label htmlFor="image-caption">Caption</label>
            <textarea
              id="image-caption"
              value={imageCaption}
              rows={3}
              maxLength={500}
              disabled={uploading}
              placeholder="Optional caption shown below the image"
              onChange={(event) => setImageCaption(event.target.value)}
            />
          </div>
          {uploadError && (
            <p className={styles.dialogError} role="alert">
              {uploadError}
            </p>
          )}
          <div className={styles.dialogActions}>
            <button
              type="button"
              className={styles.dialogSecondary}
              disabled={uploading}
              onClick={closeImageDialog}
            >
              Cancel
            </button>
            <button
              type="button"
              className={styles.dialogPrimary}
              disabled={uploading || !imageAlt.trim() || !pendingImage}
              onClick={() => {
                if (pendingImage) {
                  void uploadFile(
                    pendingImage,
                    imageAlt.trim(),
                    imageCaption.trim(),
                  );
                }
              }}
            >
              {uploading ? "Uploading…" : "Upload image"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
});
