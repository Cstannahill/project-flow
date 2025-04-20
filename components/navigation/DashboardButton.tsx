import { SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "../ui/button";
import { LayoutDashboard } from "lucide-react";
import { H4 } from "../ui/Typography";

export const DashboardButton = () => {
  return (
    <SidebarMenuButton tooltip="Dashboard" className="w-full">
      <div className="mx-auto flex w-full items-center">
        {" "}
        <Link
          href="/dashboard"
          className="mx-auto flex w-full cursor-pointer items-center px-4 py-2 text-sm"
        >
          <Button
            variant="default"
            size="fill"
            ripple={true}
            aria-label="Dashboard"
            title="Dashboard"
            role="button"
          >
            <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
            <H4 className="ml-2">Dashboard</H4>
          </Button>
        </Link>
      </div>
    </SidebarMenuButton>
  );
};
