import CourseComp from "@/components/courseComp";
import { request } from "@/request";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const Cours = async () => {
  const quryClient = new QueryClient();
  await quryClient.prefetchQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await request.get("/api/course/get-courses");
      return res.data.data;
    },
  });
  const dehydratedState = dehydrate(quryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <CourseComp />
    </HydrationBoundary>
  );
};

export default Cours;
