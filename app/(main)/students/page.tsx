import StudentComp from "@/components/StudentComp";
import { request } from "@/request";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const getTeacher = async () => {
  const res = await request.get("/api/student/get-all-students");
  return res.data.data;
};

const Student = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["student"],
    queryFn: getTeacher,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <div>
      <HydrationBoundary state={dehydratedState}>
        <StudentComp />
      </HydrationBoundary>
    </div>
  );
};

export default Student;
