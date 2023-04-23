import { createContext, useContext, useState } from "react";

const Context = createContext();

export function KeyProvider({children}) {
    const [keys,setKeys] = useState({publicKey: "", privateKey: "", patient:true});
    return (
        <Context.Provider value={[keys,setKeys]}>{children}</Context.Provider>
    );
}

export function useKeyContext() {
    return useContext(Context);
}