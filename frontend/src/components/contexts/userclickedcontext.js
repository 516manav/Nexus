import { createContext, useState } from "react";

export const UserClickedContext = createContext();

export function UserClickedProvider({ children }) {
    const [userClicked, setUserClicked] = useState(null);

    return (
        <UserClickedContext.Provider value={{ userClicked, setUserClicked }}>
            {children}
        </UserClickedContext.Provider>
    );
}