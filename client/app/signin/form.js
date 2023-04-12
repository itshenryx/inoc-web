'use client';

import s from "@/app/signin/page.module.css";
import {signInWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
import {auth} from '@/app/firebase-config';
import {useRouter} from "next/navigation";


export default function Form() {
    const router = useRouter();

    onAuthStateChanged(auth, (currentUser) => {
        if (currentUser != null)
            router.push("/dash");
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const user = await signInWithEmailAndPassword(
                auth,event.target.email.value,event.target.password.value
            );
        } catch (err) {
            event.target.email.value = "";
            event.target.password.value = "";
            console.log(err);
        }
    }

    return (
        <div className={s.form}>
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
                <button type="submit">
                    SIGN IN
                </button>
            </form>
            <p draggable="false">
                Having trouble signing in? <a>→</a>
            </p>
        </div>
    );
}