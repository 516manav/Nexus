import { createContext, useState } from "react";

export const TransitionContext = createContext();

export function TransitionProvider({ children }) {
    const [transition, setTransition] = useState(true);

    return (
        <TransitionContext.Provider value={{ transition, setTransition }}>
            {children}
        </TransitionContext.Provider>
    );
}