import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function MainLayout({ children }: Props) {
  return (
    <>
      <header></header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
}
