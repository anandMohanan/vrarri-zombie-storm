import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-6xl rounded-lg ">
                <div className="text-center space-y-8">
                    {/* Logo - Large version for welcome screen */}
                    <div className="mb-12">
                        <div className="text-6xl font-bold text-black mb-2">
                            XR
                            <span className="text-2xl font-normal ml-2">CENTER</span>
                        </div>
                        <div className="flex items-center justify-center space-x-4 mt-4">
                            <div className="h-1 w-16 bg-gray-300"></div>
                            <div className="text-3xl font-bold text-black">GAME SPACE</div>
                            <div className="h-1 w-16 bg-gray-300"></div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Button asChild variant={"link"}>
                            <Link href="/nk1/user">
                                NK1 - Nakano  Broadway Store
                            </Link>
                        </Button>

                    </div>
                </div>
            </div>
        </main>
    );
}
