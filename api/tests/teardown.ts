import { destroyTestDB } from "./test_common";

export default async () => {
    await destroyTestDB();
}
