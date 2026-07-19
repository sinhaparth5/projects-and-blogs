import sanitizeHtml from "sanitize-html";

const colorValue =
  /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%]+\)|[a-z]+)$/i;
const sizeValue = /^\d+(\.\d+)?(px|rem|em|%)$/;

export function sanitizeArticleHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "blockquote",
      "ul",
      "ol",
      "li",
      "strong",
      "em",
      "u",
      "s",
      "code",
      "pre",
      "br",
      "hr",
      "a",
      "span",
      "sup",
      "sub",
      "mark",
      "img",
      "figure",
      "figcaption",
      "div",
      "table",
      "thead",
      "tbody",
      "tfoot",
      "tr",
      "th",
      "td",
      "colgroup",
      "col",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: [
        "src",
        "alt",
        "title",
        "width",
        "height",
        "data-caption",
        "loading",
        "decoding",
      ],
      span: [
        "class",
        "data-type",
        "data-latex",
        "data-ref-id",
        "data-ref-url",
        "data-ref-label",
        "data-ref-title",
        "style",
      ],
      div: ["data-type", "data-latex"],
      sup: ["class"],
      mark: ["data-color", "style"],
      p: ["style"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      h4: ["style"],
      table: ["style"],
      th: ["colspan", "rowspan", "colwidth", "style"],
      td: ["colspan", "rowspan", "colwidth", "style"],
      col: ["span", "width", "style"],
    },
    allowedClasses: {
      span: ["article-ref-anchor"],
      sup: ["article-ref-num"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    allowedSchemesAppliedToAttributes: ["href", "src", "data-ref-url"],
    allowProtocolRelative: false,
    allowedStyles: {
      "*": {
        "text-align": [/^(left|center|right|justify)$/],
      },
      span: {
        color: [colorValue],
      },
      mark: {
        "background-color": [colorValue],
      },
      table: {
        width: [sizeValue],
        "min-width": [sizeValue],
      },
      th: {
        width: [sizeValue],
        "min-width": [sizeValue],
      },
      td: {
        width: [sizeValue],
        "min-width": [sizeValue],
      },
      col: {
        width: [sizeValue],
        "min-width": [sizeValue],
      },
    },
    transformTags: {
      a: (_tagName, attributes) => ({
        tagName: "a",
        attribs:
          attributes.target === "_blank"
            ? { ...attributes, rel: "noopener noreferrer" }
            : attributes,
      }),
      img: (_tagName, attributes) => ({
        tagName: "img",
        attribs: {
          ...attributes,
          loading: "lazy",
          decoding: "async",
        },
      }),
    },
  });
}
