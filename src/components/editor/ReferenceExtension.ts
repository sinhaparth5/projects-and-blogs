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
      title: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-ref-id]",
        getAttrs(dom) {
          const element = dom as HTMLElement;
          const clone = element.cloneNode(true) as HTMLElement;
          clone.querySelector("sup")?.remove();
          return {
            anchorText: clone.textContent?.trim() ?? "",
            refId: Number.parseInt(
              element.getAttribute("data-ref-id") ?? "1",
              10,
            ),
            url: element.getAttribute("data-ref-url") ?? "",
            label: element.getAttribute("data-ref-label") ?? "",
            title: element.getAttribute("data-ref-title") ?? "",
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { anchorText, refId, url, label, title } = node.attrs;
    const attributes = {
      "data-ref-id": String(refId),
      "data-ref-url": String(url),
      "data-ref-label": String(label || url),
      "data-ref-title": String(title),
      class: "article-ref-anchor",
    };
    const superscript = ["sup", { class: "article-ref-num" }, String(refId)];
    return anchorText
      ? ["span", attributes, String(anchorText), superscript]
      : ["span", attributes, superscript];
  },
});
