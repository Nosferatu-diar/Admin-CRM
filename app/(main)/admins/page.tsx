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
      <div className="p-4 md:p-8 space-y-6">
        <div className="overflow-hidden">
          <h2 className="mb-3 font-bold text-xl">Adminlar</h2>
          <AdminTable />
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Admins;
