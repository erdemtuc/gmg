export type StaticMenuItem = {
  id: string;
  label: string;
  href: string;
  IconOutlined: React.FC<React.SVGProps<SVGSVGElement>>;
  IconFilled: React.FC<React.SVGProps<SVGSVGElement>>;
};

export type DynamicMenuItem = {
  id: string;
  label: string;
  href: string;
  resource: string;
  icon: string;
};
