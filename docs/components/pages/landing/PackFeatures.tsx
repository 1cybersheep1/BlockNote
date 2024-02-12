import { FadeIn } from "@/components/pages/home-shared/FadeIn";
import { FeatureBox } from "@/components/pages/home-shared/FeatureBox";
import {
  SectionHeader,
  SectionSubtext,
} from "@/components/pages/home-shared/Headings";
import type Image from "next/image";
import { IconType } from "react-icons";
import {
  RiInputCursorMove,
  RiJavascriptFill,
  RiLayout4Fill,
  RiMarkdownFill,
  RiMenuAddFill,
  RiMoonFill,
  RiPaintBrushFill,
  RiSpeedUpFill,
  RiTeamFill,
} from "react-icons/ri";
import slashMenuImage from "../../../public/img/screenshots/slash_menu.png";

export interface FeaturesCardData {
  title: string;
  description: string;
  icon: IconType;
  thumbnail?: Parameters<typeof Image>[0]["src"];
}

export const featuresCardData: FeaturesCardData[] = [
  {
    title: "Extensibility",
    description:
      "Want something more fancy? An easy to use API lets you add additional block types.",
    icon: RiMenuAddFill,
    thumbnail: slashMenuImage,
  },
  {
    title: "Theming",
    description: "Add a splash of colour to the editor with your own themes.",
    icon: RiPaintBrushFill,
    thumbnail: slashMenuImage,
  },
  {
    title: "UI Components",
    description:
      "Replace any menus & toolbars with your own React components, or remove them entirely.",
    icon: RiLayout4Fill,
    thumbnail: slashMenuImage,
  },
  {
    title: "Quick & Easy Setup",
    description:
      "Works and looks great out-of-the-box, while setup takes only a few lines of code.",
    icon: RiSpeedUpFill,
  },
  {
    title: "Polished UX",
    description:
      "Editing documents is a breeze thanks to block indentation, animations, and more.",
    icon: RiInputCursorMove,
  },
  {
    title: "Light & Dark Modes",
    description:
      "Automatically switches between light & dark modes based on system preference.",
    icon: RiMoonFill,
  },

  {
    title: "Collaboration",
    description:
      "Work on the same document with your team, in real-time, for maximum productivity.",
    icon: RiTeamFill,
  },
  {
    title: "Markdown & HTML",
    description:
      "Switching to other formats is no problem with built-in Markdown & HTML conversion.",
    icon: RiMarkdownFill,
  },
  {
    title: "Vanilla JS",
    description:
      "Not using React? BlockNote also works with vanilla JS for use with other frameworks.",
    icon: RiJavascriptFill,
  },
];

export function PackFeatures() {
  return (
    <section className="relative flex flex-col items-center gap-9 overflow-hidden py-16 pb-16 font-sans md:pb-24 lg:gap-14 lg:pb-32">
      <FadeIn noVertical className={"absolute top-0 z-10 h-full w-full"}>
        <div className={"section-features h-full w-full"} />
      </FadeIn>
      <div
        className={
          "z-20 flex max-w-full flex-col items-center gap-12 px-4 md:max-w-screen-md xl:max-w-none"
        }>
        <FadeIn className="flex max-w-full flex-col items-center gap-2 text-center md:max-w-screen-md md:gap-4">
          <SectionHeader>{"Why BlockNote?"}</SectionHeader>
          <SectionSubtext>
            {
              "Whether you want deep customization or a great out-of-the-box experience, BlockNote has you covered with features for any use case."
            }
          </SectionSubtext>
        </FadeIn>
        <FadeIn className="grid max-w-full grid-cols-1 gap-4 md:max-w-screen-md md:grid-cols-2 xl:max-w-none xl:grid-cols-3 xl:gap-6 xl:p-0">
          {featuresCardData.map((feature) => (
            <FeatureBox key={feature.title} {...feature} />
          ))}
        </FadeIn>
      </div>
    </section>
  );
}
