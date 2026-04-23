declare module "splitting" {
  interface SplittingResult {
    chars?: HTMLElement[];
    words?: HTMLElement[];
    lines?: HTMLElement[];
    el: HTMLElement;
  }
  interface SplittingOptions {
    target?: HTMLElement | string;
    by?: "chars" | "words" | "lines";
    key?: string;
  }
  function Splitting(options?: SplittingOptions): SplittingResult[];
  export default Splitting;
}
