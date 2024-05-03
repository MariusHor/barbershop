import { type VariantProps } from "class-variance-authority";
import { type Url } from "next/dist/shared/lib/router/router";
import Link from "next/link";

import { Button, type buttonVariants } from "../ui/button";
import { cn } from "@/utils/helpers";
import { api } from "@/utils/api";

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
  size = "lg",
  href = "",
}: ScheduleButtonProps): React.JSX.Element => {
  const { data } = api.content.getSiteSettings.useQuery(undefined, {
    enabled: !href,
  });

  return (
    <Button
      size={size}
      className={cn("w-fit text-lg", className)}
      variant={variant}
      asChild
    >
      <Link href={data?.scheduleLink ?? href} target="_blank">
        {text ?? "Programeaza"}
      </Link>
    </Button>
  );
};
