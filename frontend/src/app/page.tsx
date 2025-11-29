import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to Cameleon Group by default
  redirect("/clients/cameleon-group");
}
