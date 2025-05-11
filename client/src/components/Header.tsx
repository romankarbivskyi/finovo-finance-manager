interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl leading-10 font-semibold">{title}</h1>
      <p className="text-sm text-zinc-500">{subtitle}</p>
    </div>
  );
};

export default Header;
