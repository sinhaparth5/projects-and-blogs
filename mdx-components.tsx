import type { MDXComponents } from "nextra/mdx-components";
import { useMDXComponents as getThemeComponents } from "nextra-theme-blog";

const themeComponents = getThemeComponents();

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...themeComponents,
    ...components,
  };
}
