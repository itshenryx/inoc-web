import s from './page.module.css'
import styles from "@/app/page.module.css";

export default function Signin() {
    return (
        <main className={s.main}>
            <div className={s["info-pane"]} >
                <div className={s["image-container"]}>
                    <img src="/images/logo-white-raster.png" draggable="false"/>
                    <img src="/images/qrcode.png" draggable="false"/>
                </div>
                <img src="/images/login-smaller.gif" draggable="false"/>
            </div>
            <div className={s["signin-pane"] }>
                <p draggable="false">
                    Don't have an account? <a>Contact us</a>
                </p>
                <div className={s.form}>
                    <h1>Sign-in to your account...</h1>
                    <div className={s["input-box"]}>
                        <input type="text" required/>
                        <label>
                            EMAIL ADDRESS
                        </label>
                    </div>
                    <div className={s["input-box"]}>
                        <input type="password" required/>
                        <label>
                            PASSWORD
                        </label>
                    </div>
                    <button>
                        SIGN IN
                    </button>
                    <p draggable="false">
                        Having trouble signing in? <a>→</a>
                    </p>
                </div>
            </div>
        </main>
    );
}