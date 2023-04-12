import s from './page.module.css'
import Form from "@/app/signup/form";
import Link from "next/link";

export default function Signup() {
    return (
        <main className={s.main}>
            <div className={s["info-pane"]}>
                <div className={s["image-container"]}>
                    <img src="/images/logo-white-raster.png" draggable="false"/>
                    <img src="/images/qrcode.png" draggable="false"/>
                </div>
                <img src="/images/login-smaller.gif" draggable="false"/>
            </div>
            <div className={s["signin-pane"]}>
                <p draggable="false">
                    Already have an account? <Link href="/signin">Sign in</Link>
                </p>
                <Form/>
            </div>
        </main>
    );
}