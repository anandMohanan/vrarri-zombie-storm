import { StaffClient } from "./StaffClient";

export default async function StaffHomePage({ params }: { params: { storeId?: string } }) {
    const { storeId } = await params;
    return (
        <StaffClient storeId={storeId || 'DEFAULT'} />
    );
}
