import { UserClient } from "./UserClient";

export default async function HomePage({ params }: { params: { storeId: string } }) {
    const { storeId } = await params;

    return (
        <UserClient storeId={storeId} />
    );
}
