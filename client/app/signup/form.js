'use client';

import s from "@/app/signup/page.module.css";
import {createUserWithEmailAndPassword, onAuthStateChanged} from "firebase/auth";
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
            const user = await createUserWithEmailAndPassword(
                auth, event.target.email.value, event.target.password.value);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={s.form}>
            <h1>Sign-up to innoCare...</h1>
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
                    SIGN UP
                </button>
            </form>
            <div className={s.warning}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
                </svg>
                <p>
                    This is an temporary feature and will be removed in the production build. Sign-up will be only done via a
                    registered hospital.
                </p>
            </div>
        </div>
    )
}