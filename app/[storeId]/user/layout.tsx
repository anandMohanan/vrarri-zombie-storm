import { storeIdToName } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Nakano Broadway | XR Game Space',
    description: 'Nakano Broadway Game Space - Player registration ',
};
export default async function Layout({ children, params }: { children: React.ReactNode, params: { storeId: string } }) {
    const { storeId } = await params;
    const storeName = storeIdToName(storeId);
    return (
        <main className="min-h-screen  flex items-center justify-center">
            <div className="w-full ">
                {children}
            </div>
            <footer className="absolute bottom-0 left-0 right-0 p-4 ">
                <p className="text-center text-sm text-gray-800 font-light">
                    {storeName}
                </p>
            </footer>
        </main>
    )
}
