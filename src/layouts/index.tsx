import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useHover, useMeasure } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { Icon } from "@iconify-icon/react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { capitalize, cn } from "@/utils/helpers";
import { api } from "@/utils/api";
import { useStore } from "@/store";
import { SiteLogo } from "@/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ButtonLink } from "@/components/common/button-link";
import { Text } from "@/components/ui/text";

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
        "h-header fixed z-50 mx-auto flex w-full items-center text-lg transition md:h-header-md",
        { "bg-white shadow-md": showNavbar },
      )}
    >
      <div className="container-lg relative flex h-full items-center justify-between">
        <SiteLogo className={cn({ hidden: !showNavbar })} />

        <div className="flex h-full w-full items-center justify-end">
          <HamburgerMenu
            routes={routes}
            currentRoute={currentRoute}
            showNavbar={showNavbar}
          />
          <DesktopNavLinks
            routes={routes}
            currentRoute={currentRoute}
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
    ? "var(--primary)"
    : showNavbar || menuOpen
      ? "var(--foreground)"
      : "var(--primary-foreground)";

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
        className="absolute left-0 top-0 flex h-header w-screen flex-col justify-end bg-white md:h-header-md"
        variants={sidebarVariants}
      >
        <Separator />
      </motion.div>

      <motion.div
        variants={listVariants}
        className="absolute top-[var(--header-h)] flex h-screen w-screen flex-col items-center justify-center bg-white md:top-[var(--header-h-md)]"
      >
        <div className="relative -mt-[calc(var(--header-h)_*2)] flex h-full w-full flex-col items-center justify-center md:-mt-[calc(var(--header-h-md)_*2)]">
          <ul className="grid items-center justify-center gap-4 lg:gap-8">
            {routes?.map((route, index) => (
              <motion.li
                key={index}
                variants={listItemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ButtonLink
                  href={route.path}
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  <Text variant={"caption"} as={"span"}>
                    {"0" + (index + 1)}
                  </Text>
                  <Text
                    variant={"h2"}
                    as={"span"}
                    className={cn({
                      "text-primary": currentRoute === route.path,
                    })}
                  >
                    {route.name}
                  </Text>
                </ButtonLink>
              </motion.li>
            ))}
          </ul>

          <motion.p
            className="absolute bottom-[5%] left-1/2 max-w-80 -translate-x-1/2 text-center"
            variants={{
              closed: { opacity: 0 },
              open: { opacity: 1 },
            }}
          >
            <Text variant={"body"} as="span">
              Contacteaza-ne la{" "}
            </Text>

            <ButtonLink href={`mailto:${locationData?.email}`}>
              {locationData?.email}
            </ButtonLink>
          </motion.p>
        </div>
      </motion.div>

      {!!instagramData?.link && (
        <ButtonLink
          variant={"ghost"}
          href={instagramData?.link}
          className="z-20 flex justify-center"
        >
          <motion.span
            className="flex"
            variants={{
              closed: {
                color: "var(--primary-foreground)",
                transition: { delay: 0.8 },
              },
              open: {
                color: "var(--foreground)",
              },
            }}
          >
            <Icon
              icon={`mdi:${instagramData.name}`}
              className={cn(
                "text-3xl text-primary-foreground hover:text-primary",
                {
                  "text-foreground":
                    showNavbar || menuOpen || currentRoute !== "/",
                },
              )}
            />
          </motion.span>
        </ButtonLink>
      )}

      <Button
        ref={ref}
        onClick={() => setMenuOpen(!menuOpen)}
        variant="ghost"
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
            <ButtonLink
              href={route.path}
              className={cn("uppercase", itemClassName, {
                "text-primary": currentRoute === route.path,
              })}
            >
              {capitalize(route.name)}
            </ButtonLink>
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
          <Accordion
            type="single"
            collapsible
            className="w-40 lg:w-full"
            defaultValue={locationData?.name}
          >
            <AccordionItem
              value={locationData?.name ?? ""}
              className="border-b-dark-foreground"
            >
              <AccordionTrigger className="pb-2 pt-0 hover:no-underline">
                <Text variant={"caption"} className="font-[500] text-muted">
                  {locationData?.name}
                </Text>
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2 text-left">
                <Text variant={"caption"} className="text-muted">
                  {locationData?.street}
                </Text>
                <Text variant={"caption"} className="text-muted">
                  {locationData?.zip} {locationData?.city}
                </Text>
                <Text variant={"caption"} className="text-muted">
                  {locationData?.phone}
                </Text>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Column>

        <Column title="Orar">
          <div className="flex flex-col text-left">
            {locationData?.timetables?.map((item, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Text variant={"caption"} className="text-muted">
                  {item.split(":")[0]}:
                </Text>
                <Text variant={"caption"} className="text-muted">
                  {item.slice(item.indexOf(":") + 1)}
                </Text>
              </div>
            ))}
          </div>
        </Column>
      </div>

      <Separator className="bg-dark-foreground" />

      <Text
        variant={"caption"}
        align={"center"}
        className="p-4 text-secondary-foreground"
      >
        ©{new Date().getFullYear()} {siteSettings?.title}. All content is the
        property of {siteSettings?.title} unless otherwise noted.
      </Text>
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
    <div className="flex h-full max-h-96 flex-col items-center gap-8 text-center lg:text-start">
      <Text variant={"h4"} className="text-muted">
        {title}
      </Text>
      {children}
    </div>
  );
};
