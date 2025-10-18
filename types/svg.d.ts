declare module "@/icons/*.svg" {
  import * as React from "react";
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module "*.svg" {
  const src: string;
  export default src;
}
