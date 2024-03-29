import { Studio } from "./Studio";

// Ensures the Studio route is statically generated
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <Studio />;
}
