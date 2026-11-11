import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/screens/screens";

export const Route = createFileRoute("/app/")({ component: Home });
