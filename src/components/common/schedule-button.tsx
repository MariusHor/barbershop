import { type VariantProps } from "class-variance-authority";
import { type Url } from "next/dist/shared/lib/router/router";

import { type buttonVariants } from "../ui/button";
import { api } from "@/utils/api";
import { ButtonLink } from "./button-link";
import { type ReactNode } from "react";

export type ScheduleButtonProps = {
  children?: ReactNode;
  className?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  href?: Url;
};

export const ScheduleButton = ({
  className,
  href,
  variant,
  children = "Programeaza",
  size = "default",
}: ScheduleButtonProps): React.JSX.Element | null => {
  const { data } = api.content.getSiteSettings.useQuery(undefined, {
    enabled: !href,
  });

  const _href = href ?? data?.scheduleLink;
  if (!_href) return null;

  return (
    <ButtonLink
      size={size}
      variant={variant}
      href={_href}
      className={className}
    >
      {children}
    </ButtonLink>
  );
};
