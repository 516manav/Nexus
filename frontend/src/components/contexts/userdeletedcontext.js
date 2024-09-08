import { createContext, useState } from "react";

export const UserDeletedContext = createContext();

export function UserDeletedProvider({ children }) {
    const [userDeleted, setUserDeleted] = useState(0);

    return (
        <UserDeletedContext.Provider value={{ userDeleted, setUserDeleted }}>
            {children}
        </UserDeletedContext.Provider>
    );
}