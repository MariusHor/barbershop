import { usePathname } from "next/navigation";
import Link from "next/link";
import { useWindowSize } from "usehooks-ts";

import { Separator } from "@/components/ui/separator";
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
        { "bg-white shadow-md": isScrolled },
      )}
    >
      <div className="container-lg flex justify-end">
        {isSmallScreen ? (
          <HamburgerMenu routes={routes} currentRoute={currentRoute} />
        ) : (
          <DesktopNavLinks
            routes={routes}
            currentRoute={currentRoute}
            itemClassName="text-dark"
          />
        )}
      </div>
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
  direction = "row",
  itemClassName,
}: {
  routes: { path: string; name: string }[] | undefined;
  currentRoute: string | null;
  direction?: "row" | "col";
  itemClassName?: string;
}): React.JSX.Element | null => {
  if (!routes?.length) return null;

  return (
    <nav className="flex items-center">
      <ul
        className={cn("flex gap-4", {
          "flex-col gap-2": direction === "col",
          "gap-4 xl:gap-8 2xl:gap-12": direction === "row",
        })}
      >
        {routes?.map((route, index) => (
          <li key={index}>
            <Link
              href={route.path}
              className={cn(
                "font-300 text-1xl uppercase hover:text-primary",
                itemClassName,
                {
                  "text-primary": currentRoute === route.path,
                },
              )}
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
  const { data: siteSettings } = api.content.getSiteSettings.useQuery();
  const { data: routes } = api.content.getRoutes.useQuery();
  const currentRoute = usePathname();

  return (
    <footer className="bg-black">
      <div className="sticky bottom-0 m-auto flex max-w-[1024px] justify-center gap-20 py-16">
        <Column title="Meniu">
          <DesktopNavLinks
            routes={routes}
            currentRoute={currentRoute}
            direction="col"
            itemClassName="text-muted"
          />
        </Column>

        <Separator
          orientation="vertical"
          className="h-auto bg-dark-foreground"
        />

        <Column title="Locatii">
          <div className="flex flex-col gap-2">
            <p className="font-black">{locationData?.name}</p>
            <p>{locationData?.street}</p>
            <p>
              {locationData?.zip} {locationData?.city}
            </p>
            <p>{locationData?.phone}</p>
          </div>
        </Column>

        <Separator
          orientation="vertical"
          className="h-auto bg-dark-foreground"
        />

        <Column title="Orar">
          <div className="flex flex-col gap-2">
            {locationData?.timetables?.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </Column>
      </div>

      <Separator className="bg-dark-foreground" />

      <p className="m-auto w-fit p-4 font-[300] text-muted-foreground">
        ©2023 {siteSettings?.title}. All content is the property of{" "}
        {siteSettings?.title} unless otherwise noted.
      </p>
    </footer>
  );
};

type ColumnProps = {
  title: string;
  children: React.ReactNode;
};

const Column = ({ title, children }: ColumnProps): React.JSX.Element => {
  return (
    <div className="flex h-full max-h-96 flex-col gap-4 text-white">
      <h3 className="mb-4 text-3xl font-[300] text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
};
