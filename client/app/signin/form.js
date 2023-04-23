'use client';

import s from "@/app/signin/page.module.css";
import {signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import {auth} from '@/app/firebase-config';
import {useRouter} from "next/navigation";
import {useState} from "react";
import * as Toast from '@radix-ui/react-toast';
import transpile from "@/app/transpileError";
// import cryptico from "cryptico";
//
// const generateKey = () => {
//     let privateKey = cryptico.generateRSAKey("415551", 1024);
//     let publicKey = cryptico.publicKeyString(privateKey);
//     console.log(publicKey);
// }

export default function Form() {
    const [disable, setDisable] = useState(false);
    const [error, setError] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const router = useRouter();

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser != null)
            router.push("/dash");
    });

    const handleSubmit = async (event) => {
        setDisable(true);
        event.preventDefault();
        try {
            const user = await signInWithEmailAndPassword(
                auth, event.target.email.value, event.target.password.value
            );
        } catch (err) {
            setErrMsg(transpile(err.code));
            setError(true);
            setDisable(false);
        }
    }

    return (
        <div className={s.form}>
            <Toast.Provider duration={3000} swipeDirection="down">
                <h1>Sign-in to your account...</h1>
                <form method="POST" onSubmit={handleSubmit}>
                    <div className={s["input-box"]}>
                        <input type="text" id="email" name="email" required/>
                        <label>
                            EMAIL ADDRESS
                        </label>
                    </div>
                    <div className={s["input-box"]}>
                        <input type="password" id="password" name="password" required/>
                        <label>
                            PASSWORD
                        </label>
                    </div>
                    <button type="submit" disabled={disable}>
                        SIGN IN
                    </button>
                </form>
                <p draggable="false">
                    Having trouble signing in? <a>→</a>
                </p>
                <Toast.Root className={s.ToastRoot} open={error} onOpenChange={setError}>
                    <Toast.Title className={s.ToastTitle}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                        </svg>
                    </Toast.Title>
                    <Toast.Description className={s.ToastDesc}>{errMsg}</Toast.Description>
                </Toast.Root>
                <Toast.Viewport className={s.ToastViewport}/>
            </Toast.Provider>
        </div>
    );
}