import ManagerTable from "@/components/managerTable";
import { request } from "@/request";
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";
import React from "react";

const getManagers = async () => {
  const res = await request.get("/api/staff/all-managers");
  return res.data.data;
};

const Managers = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["Managers"],
    queryFn: getManagers,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div>
      <HydrationBoundary state={dehydratedState}>
        <ManagerTable />
      </HydrationBoundary>
    </div>
  );
};

export default Managers;
