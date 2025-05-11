import type { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

const Header = ({ title, subtitle, children }: HeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl leading-10 font-semibold">{title}</h1>
        <p className="text-sm text-zinc-500">{subtitle}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Header;
