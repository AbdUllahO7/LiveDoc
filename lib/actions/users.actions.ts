'use server'
import { clerkClient } from "@clerk/nextjs/server"
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

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


export const getMentionSuggestions = async ({text , roomId , currentUser} : {text : string , roomId : string , currentUser : string}) => {
    try {
        const room = await liveblocks.getRoom(roomId);

        if(!room) return [];

        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        if(text.length){
            const lowerCaseText = text.toLowerCase();

            const filteredUser = users.filter((email : string ) => email.toLowerCase().includes(lowerCaseText));

            return parseStringify(filteredUser);
        }
        return parseStringify(users);

    } catch (error) {
        console.log(`Error fetching mention suggestions: ${error}`);
        return null;
    }
}
