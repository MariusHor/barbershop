import React from "react";
import { usePathname } from "next/navigation";
import { useHover, useMeasure } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { capitalize, cn } from "@/utils/helpers";
import { api } from "@/utils/api";
import { useStore } from "@/store";
import { SiteLogo, SocialLinks } from "@/components";
import { ButtonLink } from "@/components/common/button-link";
import { Text } from "@/components/ui/text";
import { Container, Flex, Grid } from "@/components/ui/layout";
import { ArrowRightIcon } from "@radix-ui/react-icons";

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

  return (
    <header
      className={
        "fixed z-50 mx-auto flex h-header w-full items-center bg-white text-lg shadow-md transition md:h-header-md"
      }
    >
      <div className="container-lg relative flex h-full items-center justify-between">
        <SiteLogo />

        <div className="flex h-full w-full items-center justify-end">
          <HamburgerMenu routes={routes} currentRoute={currentRoute} />
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
}: {
  routes: { path: string; name: string }[] | undefined;
  currentRoute: string | null;
}): React.JSX.Element | null => {
  const { data: siteSettings } = api.content.getSiteSettings.useQuery();
  const { data: locationData } = api.content.getShopLocation.useQuery();
  const [containerRef, { height }] = useMeasure();
  const menuOpen = useStore((state) => state.menuOpen);
  const setMenuOpen = useStore((state) => state.setMenuOpen);
  const [ref, isBtnHovered] = useHover();

  const email = locationData?.email ?? siteSettings?.email;
  const instagramData =
    locationData?.socialPlatforms?.find(
      (platform) => platform.name === "instagram",
    ) ??
    siteSettings?.socialPlatforms?.find(
      (platform) => platform.name === "instagram",
    );

  const btnStroke = isBtnHovered ? "var(--primary)" : "var(--foreground)";

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

            <ButtonLink href={`mailto:${email}`}>{email}</ButtonLink>
          </motion.p>
        </div>
      </motion.div>

      {!!instagramData?.link && (
        <ButtonLink
          variant={"ghost"}
          href={instagramData?.link}
          className="z-20 flex justify-center"
        >
          <Icon
            icon={`mdi:${instagramData.name}`}
            className={cn("text-3xl text-foreground hover:text-primary")}
          />
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
            key={isBtnHovered.toString() + 1}
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
            key={isBtnHovered.toString() + 2}
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
            key={isBtnHovered.toString() + 3}
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
  className,
  shouldHideOnMobile = false,
}: {
  routes: { path: string; name: string }[] | undefined;
  currentRoute: string | null;
  direction?: "row" | "col";
  itemClassName?: string;
  className?: string;
  shouldHideOnMobile?: boolean;
}): React.JSX.Element | null => {
  if (!routes?.length) return null;

  return (
    <nav
      className={cn("items-center lg:flex", className, {
        hidden: shouldHideOnMobile,
      })}
    >
      <ul
        className={cn("flex", {
          "flex-col gap-2": direction === "col",
          "gap-4 xl:gap-8 2xl:gap-12": direction === "row",
        })}
      >
        {routes?.map((route, index) => (
          <li key={index}>
            <ButtonLink href={route.path} className={itemClassName}>
              <Text
                variant={"body"}
                className={cn("!text-xl", {
                  "text-primary": currentRoute === route.path,
                })}
              >
                {capitalize(route.name)}
              </Text>
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

  const phoneNumber = locationData?.phone ?? siteSettings?.phone;
  const email = locationData?.email ?? siteSettings?.email;

  return (
    <footer className="bg-secondary">
      <Container size="4">
        <Separator className="bg-border" />
        <SiteLogo size={"lg"} className="m-auto h-fit py-[96px]" />
        <Grid
          cols={{
            base: 1,
            lg: 3,
          }}
          className="gap-12 pb-[124px]"
        >
          <Flex
            direction="col"
            justify="start"
            items="center"
            className="h-fit text-center lg:items-start lg:text-start"
          >
            <Text variant={"h5"} className="mb-4 font-black lg:mb-6">
              Vino sa ne cunosti
            </Text>
            <Text variant={"caption"} className="!text-base">
              Am creat în Iași un loc special, unde serviciile de calitate te
              vor face să te simți ca acasă. Te așteptăm!
            </Text>
            <ButtonLink
              variant={"ghost"}
              className="flex gap-2"
              href={siteSettings?.locationUrl}
            >
              Vezi mapa
              <ArrowRightIcon style={{ width: "20px", height: "20px" }} />
            </ButtonLink>
          </Flex>
          <DesktopNavLinks
            routes={routes}
            currentRoute={currentRoute}
            direction="col"
            className="self-center justify-self-center text-center"
          />
          <Flex
            justify="start"
            direction="col"
            items="center"
            className="lg:items-end"
          >
            <Text variant={"h5"} className="mb-4 font-black lg:mb-6">
              Contacteaza-ne
            </Text>
            <ButtonLink href={`phone:${phoneNumber}`}>
              <Text variant={"caption"} className="!text-base">
                {phoneNumber}
              </Text>
            </ButtonLink>
            <ButtonLink href={`mail:${email}`}>
              <Text variant={"caption"} className="!text-base">
                {email}
              </Text>
            </ButtonLink>
            <SocialLinks />
          </Flex>
        </Grid>

        <Separator className="bg-border" />

        <Text
          variant={"caption"}
          align={"center"}
          className="p-4 text-secondary-foreground"
        >
          ©{new Date().getFullYear()} {siteSettings?.title}. All content is the
          property of {siteSettings?.title} unless otherwise noted.
        </Text>
      </Container>
    </footer>
  );
};
