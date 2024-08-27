import { usePathname } from "next/navigation";
import * as React from "react";
import Link from "next/link";

import { Logo, SocialLinks, ScheduleButton } from "@/components";
import { capitalize, cn } from "@/utils/helpers";
import { api } from "@/utils/api";

type Props = {
  children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
  return (
    <>
      <div></div>
      <Header />
      <main className="h-full flex-grow">{children}</main>
      <Footer />
    </>
  );
}

const Header = (): React.JSX.Element => {
  const { data: routes } = api.content.getRoutes.useQuery();
  const currentRoute = usePathname();

  return (
    <header className="header flex items-center">
      <div className="container-lg mx-auto flex items-center justify-between text-lg">
        <Logo />
        <div className="flex items-center gap-10">
          <nav>
            <ul className="flex gap-4">
              {routes?.map((route, index) => (
                <li key={index}>
                  <Link
                    href={route.path!}
                    className={cn({ underline: currentRoute === route.path })}
                  >
                    {capitalize(route.name!)}
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
  const { data: locationData } = api.content.getShopLocation.useQuery();

  return (
    <footer className="bg-slate-200">
      <div className="container-lg sticky bottom-0 flex flex-col items-center justify-center gap-20 py-16">
        <Logo />
        <div className="grid h-full w-full grow grid-cols-3 items-center">
          <Column title="Contact">
            <div className="flex flex-col gap-4">
              <p className="w-fit text-2xl font-thin">
                {locationData?.street}
                <br />
                {locationData?.city} {locationData?.zip}
              </p>
              <ul className="w-fit items-start">
                {[locationData?.phone, locationData?.email].map(
                  (item, index) => (
                    <li key={index} className="md:p-lg w-fit">
                      <a
                        href={`${item?.includes("@") ? "mailto:" : "tel:"}${item}`}
                      >
                        {item}
                      </a>
                    </li>
                  ),
                )}
              </ul>
              <SocialLinks />
              <ScheduleButton className="mt-4" />
            </div>
          </Column>
          <Column title="Orar">
            <div>
              {locationData?.timetables?.map((entry, index) => (
                <p key={index}>{entry}</p>
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
