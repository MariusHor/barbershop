import { type VariantProps } from "class-variance-authority";
import { type Url } from "next/dist/shared/lib/router/router";

import { type buttonVariants } from "../ui/button";
import { cn } from "@/utils/helpers";
import { api } from "@/utils/api";
import { ButtonLink } from "./button-link";

export type ScheduleButtonProps = {
  text?: string;
  className?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  href?: Url;
};

export const ScheduleButton = ({
  text,
  className,
  variant,
  href,
  size = "lg",
}: ScheduleButtonProps): React.JSX.Element | null => {
  const { data } = api.content.getSiteSettings.useQuery(undefined, {
    enabled: !href,
  });

  const linkHref = href ?? data?.scheduleLink;
  if (!linkHref) return null;

  return (
    <ButtonLink
      size={size}
      variant={variant}
      href={linkHref}
      className={cn(
        "h-14 w-fit rounded-none text-lg font-[400] text-muted hover:bg-primary-foreground",
        className,
      )}
    >
      {text ?? "Programeaza"}
    </ButtonLink>
  );
};
