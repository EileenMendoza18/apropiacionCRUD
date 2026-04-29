import { get } from "../../index.js";

export const getTasks = async () => {
    const data = await get('tasks');
    return data;
}