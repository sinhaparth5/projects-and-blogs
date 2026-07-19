"use client";

import { useEditor, useEditorState, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import CharacterCount from "@tiptap/extension-character-count";
import { TableKit } from "@tiptap/extension-table";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Link as LinkIcon,
  Link2Off,
  Image as ImageIcon,
  Upload,
  Undo2,
  Redo2,
  Palette,
  X,
  Superscript,
} from "lucide-react";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { NodeSelection } from "@tiptap/pm/state";
import { ReferenceExtension } from "@/components/editor/ReferenceExtension";

export type TiptapEditorHandle = {
  getHTML: () => string;
  setHTML: (html: string) => void;
};

type Props = {
  initialValue?: string;
  placeholder?: string;
};

type DialogType = "link" | null;

type ExistingRef = { refId: number; url: string; label: string; title: string };

type RefDialogState = {
  anchorText: string;
  refId: number;
  existing: ExistingRef[];
  // Set when adding another reference to an already-cited phrase: the new
  // number-only node goes at `pos`, after the numbers already attached there.
  append?: { pos: number; attachedIds: number[] };
} | null;

// ── small inline dialog ────────────────────────────────────────────────────

function UrlDialog({
  initialValue,
  onConfirm,
  onClose,
}: {
  initialValue: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); submit(); }
    if (e.key === "Escape") onClose();
  }

  function submit() {
    const trimmed = value.trim();
    if (trimmed) onConfirm(trimmed);
    else onClose();
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-(--background)/80 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-lg border border-(--border) bg-(--background) shadow-(--shadow-md) mx-4">
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
          <span className="text-[14px] font-medium text-(--foreground)">Insert link</span>
          <button type="button" onClick={onClose} className="text-(--muted) hover:text-(--foreground) transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <input
            ref={inputRef}
            type="url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com"
            className="w-full rounded-md border border-(--border) bg-(--background) px-3 py-2 text-[14px] text-(--foreground) outline-none transition-colors focus:border-(--foreground) placeholder:text-(--muted)"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-(--border) px-3.5 py-1.5 text-[13px] font-medium text-(--muted) transition-colors hover:text-(--foreground)"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!value.trim()}
              className="rounded-md border border-(--foreground) bg-(--foreground) px-3.5 py-1.5 text-[13px] font-medium text-(--background) transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── image URL entry dialog ─────────────────────────────────────────────────

function ImageUrlDialog({
  onConfirm,
  onClose,
}: {
  onConfirm: (url: string) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); submit(); }
    if (e.key === "Escape") onClose();
  }

  function submit() {
    const trimmed = value.trim();
    if (trimmed) onConfirm(trimmed);
    else onClose();
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-(--background)/80 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-lg border border-(--border) bg-(--background) shadow-(--shadow-md) mx-4">
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
          <span className="text-[14px] font-medium text-(--foreground)">Insert image URL</span>
          <button type="button" onClick={onClose} className="text-(--muted) hover:text-(--foreground) transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <input
            ref={inputRef}
            type="url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-md border border-(--border) bg-(--background) px-3 py-2 text-[14px] text-(--foreground) outline-none transition-colors focus:border-(--foreground) placeholder:text-(--muted)"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-md border border-(--border) px-3.5 py-1.5 text-[13px] font-medium text-(--muted) transition-colors hover:text-(--foreground)">
              Cancel
            </button>
            <button type="button" onClick={submit} disabled={!value.trim()} className="rounded-md border border-(--foreground) bg-(--foreground) px-3.5 py-1.5 text-[13px] font-medium text-(--background) transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── image alt + caption dialog ─────────────────────────────────────────────

function ImageMetaDialog({
  onConfirm,
  onClose,
}: {
  onConfirm: (alt: string, caption: string) => void;
  onClose: () => void;
}) {
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const altRef = useRef<HTMLInputElement>(null);

  useEffect(() => { altRef.current?.focus(); }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); onConfirm(alt.trim(), caption.trim()); }
    if (e.key === "Escape") onClose();
  }

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-(--background)/80 backdrop-blur-[2px]">
      <div className="w-full max-w-sm rounded-lg border border-(--border) bg-(--background) shadow-(--shadow-md) mx-4">
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
          <span className="text-[14px] font-medium text-(--foreground)">Image details</span>
          <button type="button" onClick={onClose} className="text-(--muted) hover:text-(--foreground) transition-colors">
            <X size={15} />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="mb-1 text-[11px] text-(--muted)">Alt text <span className="text-(--muted)">(for screen readers)</span></p>
            <input
              ref={altRef}
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe the image"
              className="w-full rounded-md border border-(--border) bg-(--background) px-3 py-2 text-[14px] text-(--foreground) outline-none transition-colors focus:border-(--foreground) placeholder:text-(--muted)"
            />
          </div>
          <div>
            <p className="mb-1 text-[11px] text-(--muted)">Caption <span className="text-(--muted)">(optional; shown below the image)</span></p>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Visible caption below the image"
              className="w-full rounded-md border border-(--border) bg-(--background) px-3 py-2 text-[14px] text-(--foreground) outline-none transition-colors focus:border-(--foreground) placeholder:text-(--muted)"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-md border border-(--border) px-3.5 py-1.5 text-[13px] font-medium text-(--muted) transition-colors hover:text-(--foreground)">
              Cancel
            </button>
            <button type="button" onClick={() => onConfirm(alt.trim(), caption.trim())} className="rounded-md border border-(--foreground) bg-(--foreground) px-3.5 py-1.5 text-[13px] font-medium text-(--background) transition-opacity hover:opacity-90">
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── reference dialog ───────────────────────────────────────────────────────

type CitationParts = { label: string; title: string };

function formatAccessedDate(): string {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

// Harvard: Author/Organisation (Year) Title. Available at: URL (Accessed: date).
function buildWebCitation(author: string, year: string, pageTitle: string, url: string): CitationParts {
  const a = author.trim();
  const t = pageTitle.trim();
  const y = year.trim();
  let lead = "";
  if (a) {
    lead = `${a} (${y || "no date"})${t ? ` ${t}.` : ""}`;
  } else if (t) {
    lead = `${t} (${y || "no date"}).`;
  }
  const tail = `Available at: ${url.trim()} (Accessed: ${formatAccessedDate()}).`;
  return { label: lead ? `${lead} ${tail}` : tail, title: t };
}

// Harvard: Author, Initials. (Year) Title. Place: Publisher, p. X.
function buildBookCitation(
  author: string,
  year: string,
  bookTitle: string,
  place: string,
  publisher: string,
  page: string,
): CitationParts {
  const t = bookTitle.trim();
  let cite = `${author.trim()} (${year.trim() || "no date"}) ${t}.`;
  const tail: string[] = [];
  const placePublisher = [place.trim(), publisher.trim()].filter(Boolean).join(": ");
  if (placePublisher) tail.push(placePublisher);
  if (page.trim()) tail.push(`p. ${page.trim()}`);
  if (tail.length > 0) cite += ` ${tail.join(", ")}.`;
  return { label: cite, title: t };
}

function CitationPreview({ label, title }: CitationParts) {
  const idx = title ? label.indexOf(title) : -1;
  return (
    <div>
      <p className="mb-1 text-[11px] text-(--muted)">Preview (Harvard style)</p>
      <p className="rounded-md border border-(--border) bg-(--surface) px-3 py-2 text-[13px] leading-5 text-(--foreground)">
        {idx >= 0 ? (
          <>
            {label.slice(0, idx)}
            <em>{title}</em>
            {label.slice(idx + title.length)}
          </>
        ) : (
          label
        )}
      </p>
    </div>
  );
}

function ReferenceDialog({
  anchorText,
  refId,
  existing,
  append,
  onConfirm,
  onReuse,
  onClose,
}: {
  anchorText: string;
  refId: number;
  existing: ExistingRef[];
  append?: boolean;
  onConfirm: (url: string, label: string, title: string) => void;
  onReuse: (refId: number) => void;
  onClose: () => void;
}) {
  const [refType, setRefType] = useState<"url" | "book">("url");

  // URL mode
  const [url, setUrl] = useState("");
  const [webAuthor, setWebAuthor] = useState("");
  const [webYear, setWebYear] = useState("");
  const [webTitle, setWebTitle] = useState("");

  // Book mode
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookYear, setBookYear] = useState("");
  const [bookPlace, setBookPlace] = useState("");
  const [bookPublisher, setBookPublisher] = useState("");
  const [bookPage, setBookPage] = useState("");

  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, [refType]);

  const canSubmit =
    refType === "url" ? !!url.trim() : !!bookAuthor.trim() && !!bookTitle.trim();

  const citation =
    refType === "url"
      ? buildWebCitation(webAuthor, webYear, webTitle, url)
      : buildBookCitation(bookAuthor, bookYear, bookTitle, bookPlace, bookPublisher, bookPage);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); submit(); }
    if (e.key === "Escape") onClose();
  }

  function submit() {
    if (!canSubmit) return;
    onConfirm(refType === "url" ? url.trim() : "", citation.label, citation.title);
  }

  const inputClass = "w-full rounded-md border border-(--border) bg-(--background) px-3 py-2 text-[14px] text-(--foreground) outline-none transition-colors focus:border-(--foreground) placeholder:text-(--muted)";

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-(--background)/80 backdrop-blur-[2px]">
      <div className="mx-4 max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-lg border border-(--border) bg-(--background) shadow-(--shadow-md)">
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
          <span className="text-[14px] font-medium text-(--foreground)">
            {append ? "Add another reference" : "Add reference"}{" "}
            <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded bg-(--foreground) text-[10px] font-bold text-(--background)">
              {refId}
            </span>
          </span>
          <button type="button" onClick={onClose} className="text-(--muted) hover:text-(--foreground) transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Anchor text preview */}
          <div>
            <p className="mb-1 text-[11px] text-(--muted)">Anchor text</p>
            <p className="rounded-md border border-(--border) bg-(--surface) px-3 py-2 text-[14px] text-(--foreground) truncate">
              {anchorText}
            </p>
            {append && (
              <p className="mt-1 text-[11px] text-(--muted)">
                This phrase is already referenced — the new number will appear alongside the existing one.
              </p>
            )}
          </div>

          {/* Reuse an already-added reference — same source gets the same number */}
          {existing.length > 0 && (
            <div>
              <p className="mb-1 text-[11px] text-(--muted)">Reuse an existing reference</p>
              <div className="max-h-36 overflow-y-auto rounded-md border border-(--border)">
                {existing.map((ref) => (
                  <button
                    key={ref.refId}
                    type="button"
                    onClick={() => onReuse(ref.refId)}
                    className="flex w-full items-start gap-2 border-b border-(--border) px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-(--surface)"
                  >
                    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-(--surface) text-[10px] font-bold text-(--foreground) border border-(--border)">
                      {ref.refId}
                    </span>
                    <span className="line-clamp-2 text-[12px] leading-4 text-(--foreground)">
                      {ref.label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-center text-[11px] text-(--muted)">or add a new source below</p>
            </div>
          )}

          {/* Type toggle */}
          <div className="flex overflow-hidden rounded-md border border-(--border) text-[12px]">
            <button
              type="button"
              onClick={() => setRefType("url")}
              className={`flex-1 px-3 py-1.5 font-medium transition-colors ${refType === "url" ? "bg-(--foreground) text-(--background)" : "text-(--muted) hover:text-(--foreground)"}`}
            >
              Website / Article
            </button>
            <button
              type="button"
              onClick={() => setRefType("book")}
              className={`flex-1 border-l border-(--border) px-3 py-1.5 font-medium transition-colors ${refType === "book" ? "bg-(--foreground) text-(--background)" : "text-(--muted) hover:text-(--foreground)"}`}
            >
              Book
            </button>
          </div>

          {refType === "url" ? (
            <>
              <div>
                <p className="mb-1 text-[11px] text-(--muted)">URL <span className="text-red-500">*</span></p>
                <input
                  ref={firstFieldRef}
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="https://example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <p className="mb-1 text-[11px] text-(--muted)">Author / organisation</p>
                <input
                  type="text"
                  value={webAuthor}
                  onChange={(e) => setWebAuthor(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. The Hindu or Sen, A."
                  className={inputClass}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="mb-1 text-[11px] text-(--muted)">Year</p>
                  <input
                    type="text"
                    value={webYear}
                    onChange={(e) => setWebYear(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="2024"
                    className={inputClass}
                  />
                </div>
                <div className="flex-[2]">
                  <p className="mb-1 text-[11px] text-(--muted)">Page / article title</p>
                  <input
                    type="text"
                    value={webTitle}
                    onChange={(e) => setWebTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Union Budget 2024 highlights"
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="mb-1 text-[11px] text-(--muted)">Author(s) <span className="text-red-500">*</span></p>
                <input
                  ref={firstFieldRef}
                  type="text"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Amartya Sen"
                  className={inputClass}
                />
              </div>
              <div>
                <p className="mb-1 text-[11px] text-(--muted)">Title <span className="text-red-500">*</span></p>
                <input
                  type="text"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. The Idea of Justice"
                  className={inputClass}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="mb-1 text-[11px] text-(--muted)">Year</p>
                  <input
                    type="text"
                    value={bookYear}
                    onChange={(e) => setBookYear(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="2009"
                    className={inputClass}
                  />
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-[11px] text-(--muted)">Page(s)</p>
                  <input
                    type="text"
                    value={bookPage}
                    onChange={(e) => setBookPage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="42 or 42–48"
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <p className="mb-1 text-[11px] text-(--muted)">Place of publication</p>
                  <input
                    type="text"
                    value={bookPlace}
                    onChange={(e) => setBookPlace(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Cambridge, MA"
                    className={inputClass}
                  />
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-[11px] text-(--muted)">Publisher</p>
                  <input
                    type="text"
                    value={bookPublisher}
                    onChange={(e) => setBookPublisher(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Harvard University Press"
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}

          {canSubmit && <CitationPreview label={citation.label} title={citation.title} />}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-(--border) px-3.5 py-1.5 text-[13px] font-medium text-(--muted) transition-colors hover:text-(--foreground)"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={!canSubmit}
              className="rounded-md border border-(--foreground) bg-(--foreground) px-3.5 py-1.5 text-[13px] font-medium text-(--background) transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── toolbar helpers ────────────────────────────────────────────────────────

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
        active
          ? "bg-(--foreground) text-(--background)"
          : "text-(--muted) hover:bg-(--border) hover:text-(--foreground)"
      }`}
    >
      {children}
    </button>
  );
}

// Subscribes to the doc on its own so typing re-renders only this footer,
// not the toolbars above it.
function WordCountFooter({ editor }: { editor: Editor }) {
  const counts = useEditorState({
    editor,
    selector: ({ editor }) => ({
      words: editor?.storage.characterCount?.words() ?? 0,
      characters: editor?.storage.characterCount?.characters() ?? 0,
    }),
  });

  const words = counts?.words ?? 0;
  const characters = counts?.characters ?? 0;

  return (
    <div className="rounded-b-md border-t border-(--border) bg-(--surface) px-3 py-1.5 text-right text-[12px] text-(--muted)">
      {words} {words === 1 ? "word" : "words"} · {characters} {characters === 1 ? "character" : "characters"}
    </div>
  );
}

function Divider({ vertical }: { vertical?: boolean }) {
  return vertical ? (
    <div className="col-span-2 my-0.5 h-px w-full bg-(--border)" />
  ) : (
    <div className="mx-1 h-4 w-px bg-(--border)" />
  );
}

// ── main component ─────────────────────────────────────────────────────────

const CustomImage = ImageExtension.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: null,
        renderHTML(attributes) {
          if (!attributes.caption) return {};
          return { "data-caption": attributes.caption };
        },
        parseHTML(element) {
          return element.getAttribute("data-caption");
        },
      },
      // Off-screen images (e.g. a long .docx import) shouldn't all decode at once —
      // this is what keeps scrolling through a long illustrated doc smooth.
      loading: {
        default: "lazy",
        renderHTML: () => ({ loading: "lazy" }),
      },
      decoding: {
        default: "async",
        renderHTML: () => ({ decoding: "async" }),
      },
    };
  },
}).configure({ allowBase64: true });

const TiptapEditor = forwardRef<TiptapEditorHandle, Props>(function TiptapEditor(
  { initialValue = "", placeholder },
  ref,
) {
  const [dialog, setDialog] = useState<DialogType>(null);
  const [dialogInitial, setDialogInitial] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [refDialog, setRefDialog] = useState<RefDialogState>(null);
  const [imageUrlDialog, setImageUrlDialog] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } },
      }),
      CustomImage,
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      CharacterCount,
      TableKit.configure({ table: { resizable: false } }),
      ReferenceExtension,
    ],
    content: initialValue,
    immediatelyRender: false,
  });

  // The doc lives in TipTap, not React state: serializing with getHTML() only
  // happens when a caller asks (save, docx import), never per keystroke.
  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML() ?? initialValue,
    setHTML: (html: string) => {
      editor?.commands.setContent(html);
    },
  }), [editor, initialValue]);

  // Toolbar active-states, subscribed independently of the typing-driven
  // re-renders above — this is what keeps Bold/Italic/etc. correct when the
  // cursor moves without any edit (arrow keys, clicking into styled text).
  const toolbarState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return null;
      return {
        bold: editor.isActive("bold"),
        italic: editor.isActive("italic"),
        underline: editor.isActive("underline"),
        strike: editor.isActive("strike"),
        heading1: editor.isActive("heading", { level: 1 }),
        heading2: editor.isActive("heading", { level: 2 }),
        heading3: editor.isActive("heading", { level: 3 }),
        bulletList: editor.isActive("bulletList"),
        orderedList: editor.isActive("orderedList"),
        blockquote: editor.isActive("blockquote"),
        code: editor.isActive("code"),
        alignLeft: editor.isActive({ textAlign: "left" }),
        alignCenter: editor.isActive({ textAlign: "center" }),
        alignRight: editor.isActive({ textAlign: "right" }),
        alignJustify: editor.isActive({ textAlign: "justify" }),
        highlight: editor.isActive("highlight"),
        link: editor.isActive("link"),
      };
    },
  });

  if (!editor) return null;
  const ed = editor;

  // First occurrence per refId, in document order — feeds the reuse picker.
  function collectRefs(): { existing: ExistingRef[]; nextId: number } {
    let maxId = 0;
    const byId = new Map<number, ExistingRef>();
    ed.state.doc.descendants((node) => {
      if (node.type.name === "reference") {
        const refId = node.attrs.refId as number;
        if (refId > maxId) maxId = refId;
        if (!byId.has(refId)) {
          byId.set(refId, {
            refId,
            url: (node.attrs.url as string) ?? "",
            label: (node.attrs.label as string) ?? "",
            title: (node.attrs.title as string) ?? "",
          });
        }
      }
    });
    return { existing: [...byId.values()].sort((a, b) => a.refId - b.refId), nextId: maxId + 1 };
  }

  function openReferenceDialog() {
    const sel = ed.state.selection;

    // Clicking an existing citation chip → append another number to it.
    if (sel instanceof NodeSelection && sel.node.type.name === "reference") {
      const $pos = ed.state.doc.resolve(sel.from);
      const parent = $pos.parent;
      // A phrase can already carry several numbers (adjacent reference nodes);
      // treat the whole contiguous run as one citation group.
      let first = $pos.index();
      let last = first;
      while (first > 0 && parent.child(first - 1).type.name === "reference") first--;
      while (last < parent.childCount - 1 && parent.child(last + 1).type.name === "reference") last++;

      let pos = $pos.start();
      let runEnd = sel.to;
      let anchorText = "";
      const attachedIds: number[] = [];
      for (let i = 0; i <= last; i++) {
        const child = parent.child(i);
        if (i >= first) {
          attachedIds.push(child.attrs.refId as number);
          if (!anchorText) anchorText = ((child.attrs.anchorText as string) ?? "").trim();
          runEnd = pos + child.nodeSize;
        }
        pos += child.nodeSize;
      }

      const { existing, nextId } = collectRefs();
      setRefDialog({
        anchorText: anchorText || "(citation)",
        refId: nextId,
        existing,
        append: { pos: runEnd, attachedIds },
      });
      return;
    }

    const { from, to } = sel;
    if (from === to) return;
    const anchorText = ed.state.doc.textBetween(from, to, " ").trim();
    if (!anchorText) return;

    const { existing, nextId } = collectRefs();
    setRefDialog({ anchorText, refId: nextId, existing });
  }

  function insertReference(attrs: ExistingRef) {
    if (!refDialog) return;
    const { append } = refDialog;
    if (append) {
      // This number is already on the phrase — nothing to add.
      if (append.attachedIds.includes(attrs.refId)) {
        setRefDialog(null);
        return;
      }
      ed.chain()
        .focus()
        .insertContentAt(append.pos, {
          type: "reference",
          attrs: { anchorText: "", ...attrs },
        })
        .run();
    } else {
      ed.chain()
        .focus()
        .insertContent({
          type: "reference",
          attrs: { anchorText: refDialog.anchorText, ...attrs },
        })
        .run();
    }
    setRefDialog(null);
  }

  function handleReferenceConfirm(url: string, label: string, title: string) {
    if (!refDialog) return;
    // Same source entered again → reuse its number (and its stored citation, so
    // the reference list shows one entry). Web sources match on URL — the label
    // bakes in the accessed date, so it can differ for the same page.
    const dup = refDialog.existing.find((r) => (url ? r.url === url : r.label === label));
    if (dup) {
      insertReference(dup);
      return;
    }
    insertReference({ refId: refDialog.refId, url, label: label || url, title });
  }

  function handleReferenceReuse(refId: number) {
    if (!refDialog) return;
    const ref = refDialog.existing.find((r) => r.refId === refId);
    if (ref) insertReference(ref);
  }

  function openImageDialog() {
    setImageUrlDialog(true);
  }

  function openLinkDialog() {
    const existing = ed.getAttributes("link").href ?? "";
    setDialogInitial(existing);
    setDialog("link");
  }

  function handleLinkConfirm(url: string) {
    ed.chain().focus().setLink({ href: url }).run();
    setDialog(null);
  }

  function handleImageUrlConfirm(url: string) {
    setImageUrlDialog(false);
    setPendingImageUrl(url);
  }

  function handleImageMetaConfirm(alt: string, caption: string) {
    if (!pendingImageUrl) return;
    ed.chain().focus().insertContent({
      type: "image",
      attrs: {
        src: pendingImageUrl,
        ...(alt ? { alt } : {}),
        ...(caption ? { caption } : {}),
      },
    }).run();
    setPendingImageUrl(null);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    setIsUploading(true);
    let uploadedUrl: string | null = null;

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/articles/images", { method: "POST", body: form });
      if (res.ok) {
        const { url } = (await res.json()) as { url: string };
        uploadedUrl = url;
      }
    } catch {
      // fall through to base64
    }

    setIsUploading(false);

    if (uploadedUrl) {
      setPendingImageUrl(uploadedUrl);
      return;
    }

    // Fallback: embed as base64
    const reader = new FileReader();
    reader.onload = () => {
      setPendingImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    ed.chain().focus().setColor(e.target.value).run();
  }

  // Rendered twice (horizontal bar below lg, vertical rail on lg+) so both
  // layouts share the exact same buttons and command wiring.
  function renderControls(vertical: boolean) {
    return (
      <>
        <ToolbarButton title="Bold (⌘B)" onClick={() => ed.chain().focus().toggleBold().run()} active={toolbarState?.bold}>
          <Bold size={13} />
        </ToolbarButton>
        <ToolbarButton title="Italic (⌘I)" onClick={() => ed.chain().focus().toggleItalic().run()} active={toolbarState?.italic}>
          <Italic size={13} />
        </ToolbarButton>
        <ToolbarButton title="Underline (⌘U)" onClick={() => ed.chain().focus().toggleUnderline().run()} active={toolbarState?.underline}>
          <UnderlineIcon size={13} />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" onClick={() => ed.chain().focus().toggleStrike().run()} active={toolbarState?.strike}>
          <Strikethrough size={13} />
        </ToolbarButton>

        <Divider vertical={vertical} />

        <ToolbarButton title="Heading 1" onClick={() => ed.chain().focus().toggleHeading({ level: 1 }).run()} active={toolbarState?.heading1}>
          <Heading1 size={13} />
        </ToolbarButton>
        <ToolbarButton title="Heading 2" onClick={() => ed.chain().focus().toggleHeading({ level: 2 }).run()} active={toolbarState?.heading2}>
          <Heading2 size={13} />
        </ToolbarButton>
        <ToolbarButton title="Heading 3" onClick={() => ed.chain().focus().toggleHeading({ level: 3 }).run()} active={toolbarState?.heading3}>
          <Heading3 size={13} />
        </ToolbarButton>

        <Divider vertical={vertical} />

        <ToolbarButton title="Bullet list" onClick={() => ed.chain().focus().toggleBulletList().run()} active={toolbarState?.bulletList}>
          <List size={13} />
        </ToolbarButton>
        <ToolbarButton title="Ordered list" onClick={() => ed.chain().focus().toggleOrderedList().run()} active={toolbarState?.orderedList}>
          <ListOrdered size={13} />
        </ToolbarButton>

        <Divider vertical={vertical} />

        <ToolbarButton title="Blockquote" onClick={() => ed.chain().focus().toggleBlockquote().run()} active={toolbarState?.blockquote}>
          <Quote size={13} />
        </ToolbarButton>
        <ToolbarButton title="Inline code" onClick={() => ed.chain().focus().toggleCode().run()} active={toolbarState?.code}>
          <Code size={13} />
        </ToolbarButton>

        <Divider vertical={vertical} />

        <ToolbarButton title="Align left" onClick={() => ed.chain().focus().setTextAlign("left").run()} active={toolbarState?.alignLeft}>
          <AlignLeft size={13} />
        </ToolbarButton>
        <ToolbarButton title="Align center" onClick={() => ed.chain().focus().setTextAlign("center").run()} active={toolbarState?.alignCenter}>
          <AlignCenter size={13} />
        </ToolbarButton>
        <ToolbarButton title="Align right" onClick={() => ed.chain().focus().setTextAlign("right").run()} active={toolbarState?.alignRight}>
          <AlignRight size={13} />
        </ToolbarButton>
        <ToolbarButton title="Justify" onClick={() => ed.chain().focus().setTextAlign("justify").run()} active={toolbarState?.alignJustify}>
          <AlignJustify size={13} />
        </ToolbarButton>

        <Divider vertical={vertical} />

        <ToolbarButton title="Highlight" onClick={() => ed.chain().focus().toggleHighlight({ color: "#fef08a" }).run()} active={toolbarState?.highlight}>
          <Highlighter size={13} />
        </ToolbarButton>
        <label title="Text colour" className="relative flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--muted) transition-colors hover:bg-(--border) hover:text-(--foreground)">
          <Palette size={13} />
          <input
            type="color"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={handleColorChange}
            defaultValue="#111111"
          />
        </label>

        <Divider vertical={vertical} />

        <ToolbarButton
          title={toolbarState?.link ? "Remove link" : "Insert link"}
          onClick={() => toolbarState?.link ? ed.chain().focus().unsetLink().run() : openLinkDialog()}
          active={toolbarState?.link}
        >
          {toolbarState?.link ? <Link2Off size={13} /> : <LinkIcon size={13} />}
        </ToolbarButton>

        <ToolbarButton title="Insert image from URL" onClick={openImageDialog} active={false}>
          <ImageIcon size={13} />
        </ToolbarButton>
        <label
          title={isUploading ? "Uploading…" : "Upload image from file"}
          className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded text-(--muted) transition-colors hover:bg-(--border) hover:text-(--foreground) ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          <Upload size={13} className={isUploading ? "animate-spin" : ""} />
          <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} disabled={isUploading} />
        </label>

        <ToolbarButton
          title="Add reference (select text first)"
          onClick={openReferenceDialog}
          active={false}
        >
          <Superscript size={13} />
        </ToolbarButton>

        {vertical ? (
          <>
            <Divider vertical />
            <ToolbarButton title="Undo (⌘Z)" onClick={() => ed.chain().focus().undo().run()}>
              <Undo2 size={13} />
            </ToolbarButton>
            <ToolbarButton title="Redo (⌘⇧Z)" onClick={() => ed.chain().focus().redo().run()}>
              <Redo2 size={13} />
            </ToolbarButton>
          </>
        ) : (
          <div className="ml-auto flex items-center gap-0.5">
            <ToolbarButton title="Undo (⌘Z)" onClick={() => ed.chain().focus().undo().run()}>
              <Undo2 size={13} />
            </ToolbarButton>
            <ToolbarButton title="Redo (⌘⇧Z)" onClick={() => ed.chain().focus().redo().run()}>
              <Redo2 size={13} />
            </ToolbarButton>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="relative rounded-md border border-(--border) bg-(--background) focus-within:border-(--foreground) transition-colors">
      {/* Horizontal toolbar — below lg; sticks under the site navbar while scrolling */}
      <div className="sticky top-12 z-20 flex flex-wrap items-center gap-0.5 rounded-t-md border-b border-(--border) bg-(--surface) px-2 py-1.5 sm:top-24 lg:hidden">
        {renderControls(false)}
      </div>

      <div className="lg:flex">
        {/* Vertical toolbar rail — lg+; stays in reach however far you scroll */}
        <div className="hidden shrink-0 rounded-tl-md border-r border-(--border) bg-(--surface) lg:block">
          <div className="sticky top-24 grid grid-cols-2 gap-0.5 p-1.5">
            {renderControls(true)}
          </div>
        </div>

        {/* Editor content */}
        <div className="min-w-0 flex-1">
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>
      </div>

      <WordCountFooter editor={ed} />

      {/* Link dialog */}
      {dialog === "link" && (
        <UrlDialog
          initialValue={dialogInitial}
          onConfirm={handleLinkConfirm}
          onClose={() => setDialog(null)}
        />
      )}

      {/* Image URL entry — step 1 */}
      {imageUrlDialog && (
        <ImageUrlDialog
          onConfirm={handleImageUrlConfirm}
          onClose={() => setImageUrlDialog(false)}
        />
      )}

      {/* Image alt + caption — step 2 */}
      {pendingImageUrl && (
        <ImageMetaDialog
          onConfirm={handleImageMetaConfirm}
          onClose={() => setPendingImageUrl(null)}
        />
      )}

      {/* Reference dialog — overlays the editor */}
      {refDialog && (
        <ReferenceDialog
          anchorText={refDialog.anchorText}
          refId={refDialog.refId}
          existing={refDialog.existing.filter(
            (r) => !refDialog.append?.attachedIds.includes(r.refId),
          )}
          append={!!refDialog.append}
          onConfirm={handleReferenceConfirm}
          onReuse={handleReferenceReuse}
          onClose={() => setRefDialog(null)}
        />
      )}
    </div>
  );
});

export default TiptapEditor;
