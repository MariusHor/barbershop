import whatsappLogo from "public/whatsapp_logo.png";
import Image from "next/image";
import { Button } from "../ui/button";
import { cn } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useScrollPosition } from "@/hooks/use-scroll-position";

type WhatsappBtnProps = {
  phoneNumber: string;
  message?: string;
  className?: string;
};

//TODO: add message as default message in Sanity
export const WhatsappBtn = ({
  phoneNumber,
  message = "Salut! Aș dori să fac o programare pentru...",
  className,
}: WhatsappBtnProps) => {
  const [hasMounted, setHasMounted] = useState(false);
  const { isAtBottom } = useScrollPosition();

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasMounted(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const isVisible = hasMounted && !isAtBottom;

  return (
    <Button
      variant="outline"
      onClick={handleWhatsAppClick}
      aria-label="Contacteaza-ne pe WhatsApp"
      className={cn(
        "fixed bottom-4 right-4 z-40 h-[48px] w-[48px] rounded-full border-none p-0 shadow-xl hover:scale-110 hover:opacity-90 md:h-[54px] md:w-[54px] lg:h-[64px] lg:w-[64px]",
        "transform transition-all duration-300 ease-out",
        !isVisible ? "translate-x-20 opacity-0" : "translate-x-0 opacity-100",
        className,
      )}
    >
      <Image src={whatsappLogo} alt="Logo WhatsApp" className="h-full w-full" />
    </Button>
  );
};
