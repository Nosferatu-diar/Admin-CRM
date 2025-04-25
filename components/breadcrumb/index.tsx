"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { breadcrmb_menu } from "@/utils";
import { usePathname } from "next/navigation";

const BrandCrumpComponent = () => {
  const pathname = usePathname();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/Asosiy">Asosiy</BreadcrumbLink>
        </BreadcrumbItem>
        {pathname !== "/" && <BreadcrumbSeparator />}
        {breadcrmb_menu.map(
          (value) =>
            value.path === pathname &&
            value.path !== "/" && (
              <BreadcrumbItem key={value.id}>
                <BreadcrumbPage className="font-medium">
                  {value.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BrandCrumpComponent;
