import { storeIdToName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Nakano Broadway | XR Game Space',
    description: 'Nakano Broadway Game Space - Reception staff app ',
};
export default async function Layout({ children, params }: { children: React.ReactNode, params: { storeId: string } }) {
    const { storeId } = await params;
    const storeName = storeIdToName(storeId);
    return (
        <main className="min-h-screen  flex flex-col items-center justify-center">
            <div className="w-full  ">
                {children}
            </div>
            <footer className="sticky bottom-0 bg-white w-full py-4 text-center text-sm text-gray-800">
                {storeName}
            </footer>
        </main>
    )
}

