'use server'
import { clerkClient } from "@clerk/nextjs/server"
import { parseStringify } from "../utils";

export const getClerkUsers = async ({userIds}: {userIds: string[]}) => {
    try {
        const users = await clerkClient.users.getUserList({
            userId: userIds
        });

        const usersData = users.map((user: any) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        }));

        const sortedUsers = userIds.map((id: string) => 
            usersData.find((user: any) => user.id === id)
        );

        return parseStringify(sortedUsers);
    } catch (error) {
        console.log("Error fetching users", error);
        return [];
    }
}