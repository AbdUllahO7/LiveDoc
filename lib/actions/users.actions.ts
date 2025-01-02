'use server'
import { clerkClient } from "@clerk/nextjs/server"
import { parseStringify } from "../utils";

export const getClerkUsers = async ({ userIds }: { userIds: string[]}) => {
    try {
        // Use getUserList instead of getList
        const { data } = await (await clerkClient()).users.getUserList({
            emailAddress: userIds,
        });

        if (!Array.isArray(data)) {
            throw new Error('Expected data to be an array');
        }

        const users = data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`, 
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        }));

        const sortedUsers = userIds.map((email) => users.find((user) => user.email === email));

        return parseStringify(sortedUsers);
    } catch (error) {
        console.log(`Error fetching users: ${error}`);
        return null;
    }
}