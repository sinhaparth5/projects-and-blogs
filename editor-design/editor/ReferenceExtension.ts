import { Node } from "@tiptap/core";

export const ReferenceExtension = Node.create({
  name: "reference",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      anchorText: { default: "" },
      refId: { default: 1 },
      url: { default: "" },
      label: { default: "" },
      // The work's title as a bare string (also present inside `label`) —
      // lets the reference-list renderer italicize it per Harvard style.
      title: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-ref-id]",
        getAttrs(dom) {
          const el = dom as HTMLElement;
          const clone = el.cloneNode(true) as HTMLElement;
          clone.querySelector("sup")?.remove();
          return {
            anchorText: clone.textContent?.trim() ?? "",
            refId: parseInt(el.getAttribute("data-ref-id") ?? "1", 10),
            url: el.getAttribute("data-ref-url") ?? "",
            label: el.getAttribute("data-ref-label") ?? "",
            title: el.getAttribute("data-ref-title") ?? "",
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { anchorText, refId, url, label, title } = node.attrs as {
      anchorText: string;
      refId: number;
      url: string;
      label: string;
      title: string;
    };
    const spanAttrs = {
      "data-ref-id": String(refId),
      "data-ref-url": url,
      "data-ref-label": label || url,
      "data-ref-title": title,
      class: "article-ref-anchor",
    };
    const sup = ["sup", { class: "article-ref-num" }, String(refId)] as const;
    // Number-only nodes (extra references appended to an already-cited phrase)
    // have no anchor text — just the superscript.
    return anchorText ? ["span", spanAttrs, anchorText, sup] : ["span", spanAttrs, sup];
  },
});
