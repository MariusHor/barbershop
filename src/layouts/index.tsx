import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMeasure } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { Icon } from "@iconify-icon/react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { capitalize, cn } from "@/utils/helpers";
import { api } from "@/utils/api";
import { useStore } from "@/store";

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
  const [isScrolled, setIsScrolled] = useState(false);

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
        "fixed z-50 mx-auto flex h-header w-full items-center text-lg transition",
        { "bg-white shadow-md": isScrolled },
      )}
    >
      <div className="container-lg relative flex h-full items-center justify-end">
        <HamburgerMenu
          routes={routes}
          currentRoute={currentRoute}
          isScrolled={isScrolled}
        />
        <DesktopNavLinks
          routes={routes}
          currentRoute={currentRoute}
          itemClassName="text-dark"
        />
      </div>
    </header>
  );
};

const HamburgerMenu = ({
  routes,
  currentRoute,
  isScrolled,
}: {
  routes: { path: string; name: string }[] | undefined;
  currentRoute: string | null;
  isScrolled: boolean;
}): React.JSX.Element | null => {
  const { data: locationData } = api.content.getShopLocation.useQuery();
  const [containerRef, { height }] = useMeasure();
  const menuOpen = useStore((state) => state.menuOpen);
  const setMenuOpen = useStore((state) => state.setMenuOpen);

  const instagramData = locationData?.socialPlatforms?.find(
    (platform) => platform.name === "instagram",
  );

  const sidebarVariants = {
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at calc(100% - 40px) 40px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    }),
    closed: {
      clipPath: `circle(30px at calc(100% - 58px) 40px)`,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
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
      className="flex items-center justify-center gap-4 lg:hidden"
    >
      <motion.div
        className="absolute left-0 top-0 h-20 w-screen bg-white"
        variants={sidebarVariants}
      />

      <motion.div
        variants={listVariants}
        className="absolute top-20 flex h-screen w-screen flex-col items-center justify-center bg-white"
      >
        <div className="relative -mt-[calc(var(--header-height)_*2)] flex h-full w-full flex-col items-center justify-center">
          <ul className="grid items-center justify-center gap-8">
            {routes?.map((route, index) => (
              <motion.li
                key={index}
                variants={listItemVariants}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={route.path}
                  className={cn("hover:text-primary", {
                    "text-primary": currentRoute === route.path,
                  })}
                >
                  <span className="font-300 text-2xl">{"0" + (index + 1)}</span>
                  <span className="font-400 text-5xl">{route.name}</span>
                </Link>
              </motion.li>
            ))}
          </ul>

          <motion.p
            className="absolute bottom-20 left-1/2 max-w-80 -translate-x-1/2 text-center"
            variants={{
              closed: { opacity: 0 },
              open: { opacity: 1 },
            }}
          >
            Contacteaza-ne la{" "}
            <Link href={`mailto:${locationData?.email}`} className="underline">
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
                { "text-dark": isScrolled },
              )}
            />
          </motion.span>
        </Link>
      )}

      <Button
        variant="ghost"
        onClick={() => setMenuOpen(!menuOpen)}
        className="relative z-20 hover:bg-transparent"
      >
        <svg width="23" height="23" viewBox="0 0 23 23">
          <motion.path
            fill="transparent"
            strokeWidth="3"
            stroke="hsl(0, 0%, 18%)"
            strokeLinecap="round"
            variants={{
              closed: { d: "M 2 2.5 L 20 2.5" },
              open: { d: "M 3 16.5 L 17 2.5" },
            }}
          />
          <motion.path
            fill="transparent"
            strokeWidth="3"
            stroke="hsl(0, 0%, 18%)"
            strokeLinecap="round"
            d="M 2 9.423 L 20 9.423"
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
            transition={{ duration: 0.1 }}
          />
          <motion.path
            fill="transparent"
            strokeWidth="3"
            stroke="hsl(0, 0%, 18%)"
            strokeLinecap="round"
            variants={{
              closed: { d: "M 2 16.346 L 20 16.346" },
              open: { d: "M 3 2.5 L 17 16.346" },
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
}: {
  routes: { path: string; name: string }[] | undefined;
  currentRoute: string | null;
  direction?: "row" | "col";
  itemClassName?: string;
}): React.JSX.Element | null => {
  if (!routes?.length) return null;

  return (
    <nav className="hidden items-center lg:flex">
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

const Column = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.JSX.Element => {
  return (
    <div className="flex h-full max-h-96 flex-col gap-4 text-white">
      <h3 className="mb-4 text-3xl font-[300] text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
};
