import { createContext, useCallback, useContext } from "react";
import { UserClickedContext } from "./userclickedcontext.js";
import { TransitionContext } from "./transitioncontext.js";

export const ListClickContext = createContext();

export function ListClickProvider({ children }) {
    const { userClicked, setUserClicked } = useContext(UserClickedContext); 
    const { setTransition } = useContext(TransitionContext);
    const handleListClick = useCallback(element => {
        if(element !== userClicked){
          setTransition(false);
          setTimeout(() => {
            setTransition(true);
            setUserClicked(element);
          }, 100);
        }
      }, [userClicked, setUserClicked, setTransition]);

    return (
        <ListClickContext.Provider value={{ handleListClick }}>
            {children}
        </ListClickContext.Provider>
    );
}