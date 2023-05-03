"use client";
import s from './page.module.css';
import {auth} from '@/app/firebase-config';
import {useKeyContext} from "@/context/keys";
import {signOut} from "firebase/auth";

export default function Nav({fileCount, content, setContent}) {
    const [keys, _] = useKeyContext();

    const logout = async () => {
        await signOut(auth);
    }

    return (
        <div className={s.nav}>
            <section className={s.profile}>
                <svg id="eLtG5EpaNv91" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink"
                     viewBox="0 0 300 300" shapeRendering="geometricPrecision" textRendering="geometricPrecision">
                    <ellipse rx="103.316954" ry="103.316954" transform="matrix(1.451843 0 0 1.451843 150.000004 150.000004)"
                             fill="#2b3954"/>
                    <g transform="matrix(.868831 0 0 0.868831 15.600084 10.338749)">
                        <rect width="68.058964" height="125.798526" rx="34.03" ry="34.03"
                              transform="matrix(.851156 0 0 0.851156 67.350096 96.462915)" fill="#fff" strokeWidth="0"/>
                        <rect width="68.058964" height="125.798526" rx="34.03" ry="34.03"
                              transform="matrix(.851156 0 0 0.851156 184.102137 96.462915)" fill="#fff" strokeWidth="0"/>
                    </g>
                </svg>
                <div className={s["profile-details"]}>
                    <p>
                        <h1>
                            {auth.currentUser.email}
                        </h1>
                        <span>
                            {keys.patient ? "PATIENT" : "DOCTOR"}
                        </span>
                    </p>
                    <button className={s["sign-out"]} onClick={logout}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </button>
                </div>
            </section>
            <section className={s.options}>
                <div className={s.choice} onClick={() => setContent(0)} data-selected={content === 0}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd"
                              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                              clipRule="evenodd"/>
                    </svg>
                    <p>Personal Info</p>
                </div>
                {
                    keys.patient ?
                        <div className={s.choice} onClick={() => setContent(1)} data-selected={content === 1}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd"
                                      d="M10.5 3.798v5.02a3 3 0 01-.879 2.121l-2.377 2.377a9.845 9.845 0 015.091 1.013 8.315 8.315 0 005.713.636l.285-.071-3.954-3.955a3 3 0 01-.879-2.121v-5.02a23.614 23.614 0 00-3 0zm4.5.138a.75.75 0 00.093-1.495A24.837 24.837 0 0012 2.25a25.048 25.048 0 00-3.093.191A.75.75 0 009 3.936v4.882a1.5 1.5 0 01-.44 1.06l-6.293 6.294c-1.62 1.621-.903 4.475 1.471 4.88 2.686.46 5.447.698 8.262.698 2.816 0 5.576-.239 8.262-.697 2.373-.406 3.092-3.26 1.47-4.881L15.44 9.879A1.5 1.5 0 0115 8.818V3.936z"
                                      clipRule="evenodd"/>
                            </svg>
                            <p>Prescription History</p>
                        </div> : <></>
                }
                <div className={s.choice} onClick={() => setContent(2)} data-selected={content === 2}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path
                            d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z"/>
                        <path fillRule="evenodd"
                              d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z"
                              clipRule="evenodd"/>
                    </svg>
                    <p>inocLocker</p>
                    <div>
                        <span>{fileCount} docs</span>
                    </div>
                </div>

                <div className={s.choice} onClick={() => setContent(3)} data-selected={content === 3}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd"
                              d="M12 3.75a6.715 6.715 0 00-3.722 1.118.75.75 0 11-.828-1.25 8.25 8.25 0 0112.8 6.883c0 3.014-.574 5.897-1.62 8.543a.75.75 0 01-1.395-.551A21.69 21.69 0 0018.75 10.5 6.75 6.75 0 0012 3.75zM6.157 5.739a.75.75 0 01.21 1.04A6.715 6.715 0 005.25 10.5c0 1.613-.463 3.12-1.265 4.393a.75.75 0 01-1.27-.8A6.715 6.715 0 003.75 10.5c0-1.68.503-3.246 1.367-4.55a.75.75 0 011.04-.211zM12 7.5a3 3 0 00-3 3c0 3.1-1.176 5.927-3.105 8.056a.75.75 0 11-1.112-1.008A10.459 10.459 0 007.5 10.5a4.5 4.5 0 119 0c0 .547-.022 1.09-.067 1.626a.75.75 0 01-1.495-.123c.041-.495.062-.996.062-1.503a3 3 0 00-3-3zm0 2.25a.75.75 0 01.75.75A15.69 15.69 0 018.97 20.738a.75.75 0 01-1.14-.975A14.19 14.19 0 0011.25 10.5a.75.75 0 01.75-.75zm3.239 5.183a.75.75 0 01.515.927 19.415 19.415 0 01-2.585 5.544.75.75 0 11-1.243-.84 17.912 17.912 0 002.386-5.116.75.75 0 01.927-.515z"
                              clipRule="evenodd"/>
                    </svg>
                    <p>Symptosis</p>
                </div>
            </section>
            <section className={s["nav-logo"]}>
                <img src="/images/logo.png" alt=""/>
            </section>
        </div>
    );
}