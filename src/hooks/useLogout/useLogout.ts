import { ACCESS_TOKEN_PATH, ACCOUNT_ID_PATH, REFRESH_TOKEN_PATH } from "@/constants/auth";
import { IDeskproClient } from "@deskpro/app-sdk";

export default function useLogout() {

    const clearUserAuthState = async (client: IDeskproClient) => {
        await Promise.all([
            client.deleteUserState(ACCESS_TOKEN_PATH),
            client.deleteUserState(REFRESH_TOKEN_PATH),
            client.deleteUserState(ACCOUNT_ID_PATH),
        ])
    }

    return { clearUserAuthState }
}