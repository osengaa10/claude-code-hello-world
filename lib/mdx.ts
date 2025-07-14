import { compile } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { evaluate } from "@mdx-js/mdx";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote/rsc";

export function compileMDX(source: string) {
  return evaluate(source, {
    ...runtime,
    baseUrl: import.meta.url,
  });
}
