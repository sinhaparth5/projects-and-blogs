"use client";

import { Check, NotebookPen, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { HeadingEntry } from "@/lib/articles/html-transform";
import styles from "./blog.module.css";

interface ReaderNote {
  id: string;
  quote: string;
  text: string;
}

interface SelectionAction {
  quote: string;
  left: number;
  top: number;
}

export default function ArticleWorkspace({
  headings,
  storageKey,
  children,
}: {
  headings: HeadingEntry[];
  storageKey: string;
  children: React.ReactNode;
}) {
  const workspace = useRef<HTMLDivElement>(null);
  const article = useRef<HTMLElement>(null);
  const noteInput = useRef<HTMLTextAreaElement>(null);
  const [activeHeading, setActiveHeading] = useState(headings[0]?.id ?? "");
  const [notes, setNotes] = useState<ReaderNote[]>([]);
  const [selectionAction, setSelectionAction] =
    useState<SelectionAction | null>(null);
  const [draftQuote, setDraftQuote] = useState("");
  const [draftNote, setDraftNote] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setNotes(JSON.parse(stored) as ReaderNote[]);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  useEffect(() => {
    const root = article.current;
    if (!root || headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveHeading(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    for (const heading of headings) {
      const element = root.querySelector(`#${CSS.escape(heading.id)}`);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [headings]);

  function persist(nextNotes: ReaderNote[]) {
    setNotes(nextNotes);
    localStorage.setItem(storageKey, JSON.stringify(nextNotes));
  }

  function captureSelection() {
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    const root = article.current;
    const container = workspace.current;
    const quote = selection?.toString().replace(/\s+/g, " ").trim() ?? "";
    if (
      !selection ||
      !range ||
      !root ||
      !container ||
      selection.isCollapsed ||
      !quote ||
      !root.contains(range.commonAncestorContainer)
    ) {
      setSelectionAction(null);
      return;
    }
    const selectionRect = range.getBoundingClientRect();
    const workspaceRect = container.getBoundingClientRect();
    setSelectionAction({
      quote: quote.slice(0, 300),
      left: selectionRect.left - workspaceRect.left + selectionRect.width / 2,
      top: selectionRect.bottom - workspaceRect.top + 8,
    });
  }

  function beginNote() {
    if (!selectionAction) return;
    setDraftQuote(selectionAction.quote);
    setDraftNote("");
    setSelectionAction(null);
    window.getSelection()?.removeAllRanges();
    requestAnimationFrame(() => noteInput.current?.focus());
  }

  function saveNote() {
    const text = draftNote.trim();
    if (!draftQuote || !text) return;
    persist([...notes, { id: crypto.randomUUID(), quote: draftQuote, text }]);
    setDraftQuote("");
    setDraftNote("");
  }

  return (
    <div ref={workspace} className={styles.articleWorkspace}>
      <aside className={styles.contentsRail} aria-label="On this page">
        <div className={styles.stickyRail}>
          <p className={styles.railTitle}>On this page</p>
          {headings.length > 0 ? (
            <nav>
              <ol className={styles.contentsList}>
                {headings.map((heading) => (
                  <li key={heading.id} data-level={heading.level}>
                    <a
                      href={`#${heading.id}`}
                      aria-current={
                        activeHeading === heading.id ? "location" : undefined
                      }
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : (
            <p className={styles.railEmpty}>Headings will appear here.</p>
          )}
        </div>
      </aside>

      <article
        ref={article}
        className={styles.prose}
        onMouseUp={captureSelection}
        onKeyUp={captureSelection}
      >
        {children}
      </article>

      <aside className={styles.notesRail} aria-label="Your notes">
        <div className={styles.stickyRail}>
          <div className={styles.notesHeading}>
            <div>
              <p className={styles.railTitle}>Your notes</p>
              <span>Private to this browser</span>
            </div>
            <NotebookPen aria-hidden="true" size={17} />
          </div>

          {draftQuote && (
            <div className={styles.noteComposer}>
              <button
                type="button"
                className={styles.noteClose}
                aria-label="Cancel note"
                onClick={() => setDraftQuote("")}
              >
                <X aria-hidden="true" size={15} />
              </button>
              <blockquote>{draftQuote}</blockquote>
              <textarea
                ref={noteInput}
                value={draftNote}
                maxLength={500}
                rows={4}
                aria-label="Note"
                placeholder="Write a short note…"
                onChange={(event) => setDraftNote(event.target.value)}
              />
              <button
                type="button"
                className={styles.saveNote}
                disabled={!draftNote.trim()}
                onClick={saveNote}
              >
                <Check aria-hidden="true" size={14} /> Save note
              </button>
            </div>
          )}

          {notes.length > 0 ? (
            <ol className={styles.notesList}>
              {notes.map((note) => (
                <li key={note.id}>
                  <blockquote>{note.quote}</blockquote>
                  <p>{note.text}</p>
                  <button
                    type="button"
                    aria-label={`Delete note about ${note.quote}`}
                    onClick={() =>
                      persist(notes.filter(({ id }) => id !== note.id))
                    }
                  >
                    <Trash2 aria-hidden="true" size={14} />
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            !draftQuote && (
              <p className={styles.railEmpty}>
                Select text in the article to add a note.
              </p>
            )
          )}
        </div>
      </aside>

      {selectionAction && (
        <button
          type="button"
          className={styles.selectionAction}
          style={{ left: selectionAction.left, top: selectionAction.top }}
          onMouseDown={(event) => event.preventDefault()}
          onClick={beginNote}
        >
          <NotebookPen aria-hidden="true" size={14} /> Add note
        </button>
      )}
    </div>
  );
}
