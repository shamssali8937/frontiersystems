import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreateCustomerModal } from "./CreateCustomerModal";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { projects: true },
      },
    },
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292D30] pb-6">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#63C7D9] uppercase">
            CLIENT RELATIONSHIP MANAGEMENT
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F3] pt-1">
            Customer Directory
          </h1>
        </div>

        <CreateCustomerModal />
      </div>

      {/* Customers Table */}
      <div className="rounded-sm border border-[#292D30] bg-[#111416] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#171A1C] border-b border-[#292D30] text-[#A6AAAC] uppercase">
            <tr>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Company</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4 text-center">Projects</th>
              <th className="py-3 px-4">Registered</th>
              <th className="py-3 px-4">Last Login</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#292D30] text-[#F5F5F3]">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#6E7376]">
                  No customer records found.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-[#171A1C]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#F5F5F3]">{c.name}</td>
                  <td className="py-3.5 px-4 text-[#A6AAAC]">{c.companyName || "—"}</td>
                  <td className="py-3.5 px-4 text-[#63C7D9]">{c.email}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-xs bg-[#171A1C] border border-[#292D30] text-[10px]">
                      {c._count.projects}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#6E7376]">
                    {new Date(c.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3.5 px-4 text-[#6E7376]">
                    {c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleDateString("en-GB") : "Never"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="text-[#63C7D9] hover:underline"
                    >
                      View &rarr;
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
