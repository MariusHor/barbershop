import Link from "next/link";
import { Button } from "../ui/button";
import { InstagramLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";

export const SocialLinks = (): React.JSX.Element => {
  return (
    <div className="flex w-fit gap-2">
      <Button asChild variant={"outline"}>
        <Link href={""}>
          <InstagramLogoIcon />
        </Link>
      </Button>
      <Button asChild variant={"outline"}>
        <Link href={""}>
          <TwitterLogoIcon />
        </Link>
      </Button>
    </div>
  );
};
