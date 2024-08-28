import { usePathname } from "next/navigation";
import Link from "next/link";
import { useWindowSize } from "usehooks-ts";

import { Logo, SocialLinks, ScheduleButton } from "@/components";
import { capitalize, cn } from "@/utils/helpers";
import { api } from "@/utils/api";

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

import { useEffect, useState } from "react";

const Header = (): React.JSX.Element | null => {
  const { data: routes } = api.content.getRoutes.useQuery();
  const currentRoute = usePathname();
  const { width = 0 } = useWindowSize();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsSmallScreen(width < 1024);
  }, [width]);

  useEffect(() => {
    const handleScroll = () => {
      const isTop = window.scrollY === 0;
      setIsScrolled(!isTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed z-50 mx-auto flex h-20 w-full items-center text-lg transition",
        { "bg-white": isScrolled },
      )}
    >
      {isSmallScreen ? (
        <HamburgerMenu routes={routes} currentRoute={currentRoute} />
      ) : (
        <DesktopNavLinks routes={routes} currentRoute={currentRoute} />
      )}
    </header>
  );
};

const HamburgerMenu = ({
  routes,
}: {
  routes: { path: string; name: string }[] | undefined;
  currentRoute: string | null;
}): React.JSX.Element | null => {
  if (!routes?.length) return null;

  // TODO: implement
  return null;
};

const DesktopNavLinks = ({
  routes,
  currentRoute,
}: {
  routes: { path: string; name: string }[] | undefined;
  currentRoute: string | null;
}): React.JSX.Element | null => {
  if (!routes?.length) return null;

  return (
    <nav className="container-lg mx-auto flex items-center justify-end">
      <ul className="flex gap-4 xl:gap-8 2xl:gap-12">
        {routes?.map((route, index) => (
          <li key={index}>
            <Link
              href={route.path}
              className={cn("nav-link font-300 text-1xl uppercase", {
                active: currentRoute === route.path,
              })}
            >
              {capitalize(route.name)}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Footer = (): React.JSX.Element => {
  const { data: locationData } = api.content.getShopLocation.useQuery();

  return (
    <footer className="bg-slate-200">
      <div className="container-lg sticky bottom-0 flex flex-col items-center justify-center gap-20 py-16">
        <Logo />
        <div className="grid h-full w-full grow grid-cols-3 items-center">
          {locationData && (
            <>
              <Column title="Contact">
                <div className="flex flex-col gap-4">
                  <p className="w-fit text-2xl font-thin">
                    {locationData.street}
                    <br />
                    {locationData.city} {locationData.zip}
                  </p>
                  <ul className="w-fit items-start">
                    {[locationData.phone, locationData.email].map(
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
              {locationData.timetables?.length && (
                <Column title="Orar">
                  <div>
                    {locationData.timetables.map((entry, index) => (
                      <p key={index}>{entry}</p>
                    ))}
                  </div>
                </Column>
              )}
            </>
          )}

          {/* TODO: Integrate Google Maps */}
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
