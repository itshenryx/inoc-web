import * as AlertDialog from '@radix-ui/react-alert-dialog';
import s from '../page.module.css';

export default function AttachFile({files, setAttached, setOpen}) {
    return (
        <AlertDialog.Root open={true}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className={s.AlertDialogOverlay}/>
                <AlertDialog.Content className={s.AlertDialogContent}>
                    <AlertDialog.Title className={s.AlertDialogTitle}>
                        <p>
                            Select a file from inocLocker
                        </p>
                        <svg onClick={() => {
                            setAttached(undefined);
                            setOpen(false);
                        }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                            <path
                                d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
                        </svg>
                    </AlertDialog.Title>
                    <AlertDialog.Description className={s.SelectFileDescription}>
                        {
                            files.map((data) => {
                                if (!data.shared)
                                    return (
                                        <button onClick={() => {
                                            setAttached(data);
                                            setOpen(false)
                                        }} className={s["select-file"]}>
                                            <h1>
                                                <span>{data.name.split(".")[1]}</span>
                                                <p>
                                                    {data.name.split(".")[0]}
                                                </p>
                                            </h1>
                                            <span>
                                            {data.size}
                                        </span>
                                        </button>
                                    )
                            })
                        }

                    </AlertDialog.Description>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}