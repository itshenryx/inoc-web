import s from './page.module.css'
import Link from "next/link";
import Form from "@/app/signin/form";

export default function Signin() {
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
                    Don't have an account? <Link href="/signup">Contact us</Link>
                </p>
                <Form/>
            </div>
        </main>
    );
}