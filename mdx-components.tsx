import type { MDXComponents } from "nextra/mdx-components";
import { useMDXComponents as getNextraMDXComponents } from "nextra/mdx-components";

const defaultComponents = getNextraMDXComponents();

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    ...components,
  };
}
