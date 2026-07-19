import type { Metadata } from "next";
import { shine } from "@/components/resume/data/shine";
import Resume from "@/components/resume/Resume";

export const metadata: Metadata = {
  title: "Shine - Creative Developer",
  description:
    "Creative developer crafting delightful, accessible web experiences with a focus on design systems and polished interfaces.",
};

export default function ShinePage() {
  return <Resume data={shine} />;
}
