import { usePathname } from "next/navigation";
import * as React from "react";
import Link from "next/link";

import { BaseLogo, SocialLinks, ScheduleButton } from "@/components";
import { capitalize, cn } from "@/utils/helpers";

type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}

const Header = (): React.JSX.Element => {
  const LINKS = {
    acasa: "/",
    galerie: "/galerie",
    servicii: "/servicii",
    contact: "/contact",
  };
  const currentRoute = usePathname();

  return (
    <header className="py-6">
      <div className="container-lg mx-auto flex items-center justify-between text-lg">
        <BaseLogo />
        <div className="flex items-center gap-10">
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
          <ScheduleButton />
        </div>
      </div>
    </header>
  );
};

const Footer = (): React.JSX.Element => {
  const EMAIL = "sergiu.barbershop@gmail.com";
  const PHONE = "+40761874555";
  const CONTACTS_LIST = [
    {
      href: `tel:${PHONE}`,
      title: `${PHONE.slice(0, 3)} ${PHONE.slice(3)}`,
    },
    {
      href: `mailto:${EMAIL}`,
      title: EMAIL,
    },
  ];
  const ADDRESS = {
    street: "Strada Aurel Vlaicu 54",
    city: "Iași",
    ZipCode: "707252",
  };

  const TIMETABLE = ["08:00 - 22:00: Luni - Vineri", "08:00 - 18:00: Sambata"];

  return (
    <footer className="bg-slate-200">
      <div className="container-lg sticky bottom-0 flex flex-col items-center justify-center gap-20 py-16">
        <BaseLogo size={"large"} />
        <div className="grid h-full w-full grow grid-cols-3 items-center">
          <Column title="Contact">
            <div className="flex flex-col gap-4">
              <p className="w-fit text-2xl font-thin">
                {ADDRESS.street}
                <br />
                {ADDRESS.city} {ADDRESS.ZipCode}
              </p>
              <ul className="w-fit items-start">
                {CONTACTS_LIST.map((item) => (
                  <li key={item.title} className="md:p-lg w-fit">
                    <a href={item.href}>{item.title}</a>
                  </li>
                ))}
              </ul>
              <SocialLinks />
              <ScheduleButton className="mt-4" />
            </div>
          </Column>
          <Column title="Orar">
            <div>
              {TIMETABLE.map((entry) => (
                <p key={entry}>{entry}</p>
              ))}
            </div>
          </Column>
          <Column title="Locatie">
            <div className="h-full w-full bg-white"></div>
          </Column>
        </div>
      </div>
    </footer>
  );
};

type ColumnProps = {
  title: string;
  children: React.ReactNode;
};

const Column = ({ title, children }: ColumnProps): React.JSX.Element => {
  return (
    <div className="flex h-full max-h-96 flex-col gap-4">
      <h3 className="mb-4 text-3xl font-thin">{title}</h3>
      {children}
    </div>
  );
};
