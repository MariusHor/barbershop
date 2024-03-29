import { type ReactNode } from "react";
import { BaseLogo } from "@/components";

type Props = {
  children: ReactNode;
};

export function MainLayout({ children }: Props) {
  return (
    <>
      <header className="bg-slate-300 py-6">
        <div className="container-lg mx-auto">
          <BaseLogo />
          <Navbar />
        </div>
      </header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
}

export const Navbar = (): React.JSX.Element => {
  return <nav></nav>;
};
