import AdminTable from "@/components/adminTable";
import { request } from "@/request";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const Admins = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const res = await request.get("/api/staff/all-admins");
      return res.data.data;
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Adminlar</h1>
        <div className="overflow-hidden ">
          <AdminTable />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Admins;
