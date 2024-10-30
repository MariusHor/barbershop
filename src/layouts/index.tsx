import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useHover, useMeasure } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { Icon } from "@iconify-icon/react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { capitalize, cn } from "@/utils/helpers";
import { api } from "@/utils/api";
import { useStore } from "@/store";
import { Logo } from "@/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  );
}

const Header = (): React.JSX.Element | null => {
  const { data: routes } = api.content.getRoutes.useQuery();
  const currentRoute = usePathname();
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const showNavbarOnRoute = currentRoute !== "/";
    setShowNavbar(showNavbarOnRoute);

    const handleScroll = () => {
      const isTop = window.scrollY === 0;
      setShowNavbar(showNavbarOnRoute || !isTop);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentRoute]);

  return (
    <header
      className={cn(
        "fixed z-50 mx-auto flex h-header w-full items-center text-lg transition",
        { "bg-white shadow-md": showNavbar },
      )}
    >
      <div className="container-lg relative flex h-full items-center justify-between">
        {showNavbar && <Logo className="md:max-w-30 max-w-20" />}

        <div className="flex h-full w-full items-center justify-end">
          <HamburgerMenu
            routes={routes}
            currentRoute={currentRoute}
            showNavbar={showNavbar}
          />
          <DesktopNavLinks
            routes={routes}
            currentRoute={currentRoute}
            itemClassName="text-dark"
            shouldHideOnMobile
          />
        </div>
      </div>
    </header>
  );
};

const HamburgerMenu = ({
  routes,
  currentRoute,
  showNavbar,
}: {
  routes: { path: string; name: string }[] | undefined;
  currentRoute: string | null;
  showNavbar: boolean;
}): React.JSX.Element | null => {
  const { data: locationData } = api.content.getShopLocation.useQuery();
  const [containerRef, { height }] = useMeasure();
  const menuOpen = useStore((state) => state.menuOpen);
  const setMenuOpen = useStore((state) => state.setMenuOpen);
  const [ref, isBtnHovered] = useHover();

  const instagramData = locationData?.socialPlatforms?.find(
    (platform) => platform.name === "instagram",
  );

  const btnStroke = isBtnHovered
    ? "hsl(var(--primary-foreground))"
    : showNavbar || menuOpen
      ? "hsl(var(--dark))"
      : "hsl(var(--muted))";

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        velocity: 40,
      },
    },
    closed: {
      x: "100%",
      transition: {
        velocity: 40,
        delay: 0.6,
      },
    },
  };

  const listVariants = {
    open: {
      transition: { staggerChildren: 0.07, delayChildren: 0.3 },
      left: 0,
      padding: "8px",
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1, delay: 0.6 },
      left: "-100vw",
    },
  };

  const listItemVariants = {
    open: {
      y: 0,
      opacity: 1,
      transition: {
        y: { stiffness: 1000, velocity: -100 },
      },
    },
    closed: {
      y: 50,
      opacity: 0,
      transition: {
        y: { stiffness: 1000 },
      },
    },
  };

  if (!routes?.length) return null;

  return (
    <motion.nav
      initial={false}
      animate={menuOpen ? "open" : "closed"}
      custom={height}
      ref={containerRef}
      className="flex items-center justify-center gap-2 lg:hidden"
    >
      <motion.div
        className="absolute left-0 top-0 flex h-20 w-screen flex-col justify-end bg-white"
        variants={sidebarVariants}
      >
        <Separator />
      </motion.div>

      <motion.div
        variants={listVariants}
        className="absolute top-20 flex h-screen w-screen flex-col items-center justify-center bg-white"
      >
        <div className="relative -mt-[calc(var(--header-height)_*2)] flex h-full w-full flex-col items-center justify-center">
          <ul className="grid items-center justify-center gap-4 lg:gap-8">
            {routes?.map((route, index) => (
              <motion.li
                key={index}
                variants={listItemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={route.path}
                  className={cn("hover:text-primary-foreground", {
                    "text-primary-foreground": currentRoute === route.path,
                  })}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <span className="font-300 text-base sm:text-xl">
                    {"0" + (index + 1)}
                  </span>
                  <span className="font-400 text-3xl sm:text-5xl">
                    {route.name}
                  </span>
                </Link>
              </motion.li>
            ))}
          </ul>

          <motion.p
            className="absolute bottom-[5%] left-1/2 max-w-80 -translate-x-1/2 text-center text-base sm:text-lg"
            variants={{
              closed: { opacity: 0 },
              open: { opacity: 1 },
            }}
          >
            Contacteaza-ne la{" "}
            <Link
              href={`mailto:${locationData?.email}`}
              className="underline hover:text-primary-foreground"
            >
              {locationData?.email}
            </Link>
          </motion.p>
        </div>
      </motion.div>

      {!!instagramData?.link && (
        <Link
          href={instagramData?.link}
          target="_blank"
          className="z-20 flex justify-center"
        >
          <motion.span
            className="h-9"
            variants={{
              closed: {
                color: "hsl(var(--muted))",
                transition: { delay: 0.8 },
              },
              open: {
                color: "hsl(var(--dark))",
              },
            }}
          >
            <Icon
              icon={`mdi:${instagramData.name}`}
              className={cn(
                "text-4xl text-inherit hover:text-primary-foreground",
                { "text-dark": showNavbar || currentRoute !== "/" },
              )}
            />
          </motion.span>
        </Link>
      )}

      <Button
        ref={ref}
        variant="ghost"
        onClick={() => setMenuOpen(!menuOpen)}
        className="relative z-20 ml-3 p-0 hover:bg-transparent"
      >
        <svg width="23" height="23" viewBox="0 0 23 23">
          <motion.path
            key={showNavbar.toString() + isBtnHovered.toString() + 1}
            fill="transparent"
            strokeWidth="3"
            strokeLinecap="round"
            variants={{
              closed: {
                d: "M 2 2.5 L 20 2.5",
                stroke: btnStroke,
                transition: { delay: 0.8 },
              },
              open: { d: "M 3 16.5 L 17 2.5", stroke: btnStroke },
            }}
          />
          <motion.path
            key={showNavbar.toString() + isBtnHovered.toString() + 2}
            fill="transparent"
            strokeWidth="3"
            strokeLinecap="round"
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: {
                opacity: 1,
                stroke: btnStroke,
                transition: { delay: 0.8 },
              },
              open: { opacity: 0, stroke: btnStroke },
            }}
            transition={{ duration: 0.1 }}
          />
          <motion.path
            key={showNavbar.toString() + isBtnHovered.toString() + 3}
            fill="transparent"
            strokeWidth="3"
            strokeLinecap="round"
            variants={{
              closed: {
                d: "M 2 16.346 L 20 16.346",
                stroke: btnStroke,
                transition: { delay: 0.8 },
              },
              open: { d: "M 3 2.5 L 17 16.346", stroke: btnStroke },
            }}
          />
        </svg>
      </Button>
    </motion.nav>
  );
};

const DesktopNavLinks = ({
  routes,
  currentRoute,
  direction = "row",
  itemClassName,
  shouldHideOnMobile = false,
}: {
  routes: { path: string; name: string }[] | undefined;
  currentRoute: string | null;
  direction?: "row" | "col";
  itemClassName?: string;
  shouldHideOnMobile?: boolean;
}): React.JSX.Element | null => {
  if (!routes?.length) return null;

  return (
    <nav className={cn("items-center lg:flex", { hidden: shouldHideOnMobile })}>
      <ul
        className={cn("flex", {
          "flex-col gap-2": direction === "col",
          "gap-4 xl:gap-8 2xl:gap-12": direction === "row",
        })}
      >
        {routes?.map((route, index) => (
          <li key={index}>
            <Link
              href={route.path}
              className={cn(
                "font-300 text-1xl uppercase hover:text-primary-foreground",
                itemClassName,
                {
                  "text-primary-foreground": currentRoute === route.path,
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
      <div className="sticky bottom-0 m-auto grid max-w-[1024px] grid-cols-1 flex-col items-center justify-center gap-8 py-16 lg:grid-cols-3 lg:items-start lg:gap-20">
        <Column title="Meniu">
          <DesktopNavLinks
            routes={routes}
            currentRoute={currentRoute}
            direction="col"
            itemClassName="text-muted"
          />
        </Column>

        <Column title="Locatii">
          <Accordion type="single" collapsible className="w-40 lg:w-full">
            <AccordionItem
              value={locationData?.name ?? ""}
              className="border-b-dark-foreground"
            >
              <AccordionTrigger className="pb-2 pt-0 font-black hover:text-primary-foreground hover:no-underline">
                {locationData?.name}
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 text-left">
                <span>{locationData?.street}</span>
                <span>
                  {locationData?.zip} {locationData?.city}
                </span>
                <span>{locationData?.phone}</span>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Column>

        <Column title="Orar">
          <div className="flex flex-col text-left">
            {locationData?.timetables?.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <p>{item.split(":")[0]}:</p>
                <p>{item.slice(item.indexOf(":") + 1)}</p>
              </div>
            ))}
          </div>
        </Column>
      </div>

      <Separator className="bg-dark-foreground" />

      <p className="m-auto w-fit p-4 text-center text-sm font-[300] text-muted-foreground lg:text-base">
        ©{new Date().getFullYear()} {siteSettings?.title}. All content is the
        property of {siteSettings?.title} unless otherwise noted.
      </p>
    </footer>
  );
};

const Column = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.JSX.Element => {
  return (
    <div className="flex h-full max-h-96 flex-col items-center gap-4 text-center text-white lg:text-start">
      <h3 className="mb-4 text-3xl font-[300] text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
};
