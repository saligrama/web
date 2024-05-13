import { proxy } from "./lib/proxy";
import { genOGImage } from "./lib/og";

export const onRequest: PagesFunction[] = [
  proxy,
  genOGImage,
]