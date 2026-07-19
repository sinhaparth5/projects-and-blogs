import { load } from "cheerio";
import katex from "katex";

export interface HeadingEntry {
  id: string;
  level: 2 | 3;
  text: string;
}

export interface ArticleReference {
  id: number;
  url: string;
  label: string;
  title: string;
}

function slugify(value: string) {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

export function transformArticleHtml(sourceHtml: string) {
  const $ = load(sourceHtml, null, false);
  const headings: HeadingEntry[] = [];
  const references = new Map<number, ArticleReference>();
  const slugCounts = new Map<string, number>();

  $("h2, h3").each((_index, element) => {
    const heading = $(element);
    const text = heading.text().trim();
    const baseId = slugify(text);
    const occurrence = (slugCounts.get(baseId) ?? 0) + 1;
    const id = occurrence === 1 ? baseId : `${baseId}-${occurrence}`;
    const level = element.tagName.toLowerCase() === "h2" ? 2 : 3;

    slugCounts.set(baseId, occurrence);
    heading.attr("id", id);
    headings.push({ id, level, text });
  });

  $("img[data-caption]").each((_index, element) => {
    const image = $(element);
    const caption = image.attr("data-caption")?.trim();

    if (!caption) {
      image.removeAttr("data-caption");
      return;
    }

    const existingFigure = image.parent("figure");
    if (existingFigure.length > 0) {
      if (existingFigure.children("figcaption").length === 0) {
        existingFigure.append($("<figcaption></figcaption>").text(caption));
      }
      return;
    }

    image.wrap("<figure></figure>");
    image.parent().append($("<figcaption></figcaption>").text(caption));
  });

  $("span[data-type='inline-math'], div[data-type='block-math']").each(
    (_index, element) => {
      const math = $(element);
      const latex = math.attr("data-latex") ?? "";
      const displayMode = math.attr("data-type") === "block-math";
      math.html(
        katex.renderToString(latex, {
          displayMode,
          throwOnError: false,
          output: "htmlAndMathml",
        }),
      );
      math.addClass(displayMode ? "article-math-block" : "article-math-inline");
    },
  );

  $("span[data-ref-id]").each((_index, element) => {
    const reference = $(element);
    const id = Number.parseInt(reference.attr("data-ref-id") ?? "", 10);

    if (!Number.isSafeInteger(id) || id < 1) {
      return;
    }

    if (!references.has(id)) {
      references.set(id, {
        id,
        url: reference.attr("data-ref-url") ?? "",
        label: reference.attr("data-ref-label") ?? "",
        title: reference.attr("data-ref-title") ?? "",
      });
    }

    const superscript = reference.children("sup").first();
    if (superscript.length > 0) {
      superscript
        .empty()
        .append(
          $("<a></a>")
            .attr("href", `#ref-${id}`)
            .attr("aria-label", `Reference ${id}`)
            .text(String(id)),
        );
    }
  });

  return {
    html: $.html(),
    headings,
    references: [...references.values()].sort((a, b) => a.id - b.id),
  };
}
