import { usePathname } from "next/navigation";
import * as React from "react";
import Link from "next/link";

import { BaseLogo } from "@/components";
import { capitalize, cn } from "@/utils/helpers";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  return (
    <>
      <header className="py-6">
        <div className="container-lg mx-auto flex items-center justify-between text-lg">
          <BaseLogo />
          <div className="flex items-center gap-10">
            <Navbar />
            <Button size={"lg"} className="text-lg">
              Programeaza
            </Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer></footer>
    </>
  );
}

export const Navbar = (): React.JSX.Element => {
  const LINKS = {
    acasa: "/",
    galerie: "/galerie",
    servicii: "/servicii",
    contact: "/contact",
  };
  const currentRoute = usePathname();

  return (
    <nav>
      <ul className="flex gap-4">
        {Object.entries(LINKS).map(([routeName, routeHref]) => (
          <li key={routeName}>
            <Link
              href={routeHref}
              className={cn({ underline: currentRoute === routeHref })}
            >
              {capitalize(routeName)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
