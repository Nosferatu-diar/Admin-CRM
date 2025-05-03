import TeacherComp from "@/components/TeacherComp";
import { request } from "@/request";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const getTeacher = async () => {
  const res = await request.get("/api/staff/get-all-teachers");
  return res.data.data;
};

const Teachers = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["Managers"],
    queryFn: getTeacher,
  });
  const dehydratedState = dehydrate(queryClient);
  return (
    <div>
      <HydrationBoundary state={dehydratedState}>
        <TeacherComp />
      </HydrationBoundary>
    </div>
  );
};

export default Teachers;
