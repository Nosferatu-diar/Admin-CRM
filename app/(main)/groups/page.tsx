import GroupComp from "@/components/groupComp";
import { request } from "@/request";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const Groups = async () => {
  const quryClient = new QueryClient();
  await quryClient.prefetchQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const res = await request.get("/api/group/get-all-group");
      return res.data.data;
    },
  });
  const dehydratedState = dehydrate(quryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <GroupComp />
    </HydrationBoundary>
  );
};

export default Groups;
