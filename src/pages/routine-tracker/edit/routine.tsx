import Link from 'next/link';
import React, { useRef, useState } from 'react'
import { RoutineModelCard } from '..';
import Style from '../../../styles/routine-tracker/Routine.module.css'
import { trpc } from '../../../utils/trpc';





const Routine: React.FC = () => {

    const [routines, setRoutines] = useState({ task: 'placeholder' });

    // const { data: user } = trpc.tracker.getUser.useQuery();
    const utils = trpc.useContext();

    // function saveRoutineChanges() {
    //     console.log('saved?', routines)
    //     const request = trpc.tracker.newTask.useMutation(routines)
    //     console.log(request)
    // }
    const inputRef = useRef<HTMLInputElement>(null);
    const saveRoutineChanges = trpc.tracker.newTask.useMutation({
        onSuccess: () => {
            console.log('Sucesso!')
            utils.tracker.getUser.invalidate();
            updateLastRoutine.mutate();

            if (inputRef.current) {

                inputRef.current.value = '';
            }
        }
    })

    const updateLastRoutine = trpc.tracker.updateLastRoutine.useMutation();

    return (
        <div className={Style.contentWrapper}>
            <div className={Style.mainContainer}>
                <div className={Style.header}>
                    <h1 className={Style.title}>Routine Tracker</h1>
                </div>

                <div className={Style.routineForm}>
                    <div className={Style.routineFormHeader}>
                        <p className={Style.routineHeaderParagraph}>
                            Edite sua rotina atual ou crie uma nova através do formulário abaixo.
                        </p>
                    </div>
                    <form className={Style.form} onSubmit={(e) => { e.preventDefault() }}>
                        <div className={Style.labelContainer}>
                            <label className={Style.label} htmlFor="routineName">Nome da rotina:</label>
                            <input ref={inputRef} className={Style.input} type="text" onChange={(e) => { setRoutines({ task: e.currentTarget.value }) }} name="routineName" id="routineName" />
                        </div>
                        <button className={Style.formButton} onClick={(e) => { e.preventDefault(); saveRoutineChanges.mutate(routines, { onSuccess: () => console.log('success'), onError: (err) => console.log(err) }) }}>
                            Adicionar
                        </button>
                    </form>
                </div>
                <div className={Style.routineModelContainer}>
                    <p className={Style.routineModelInfo}>
                        Sua rotina atual:
                    </p>
                    <RoutineModelCard></RoutineModelCard>
                    <Link href="/routine-tracker" passHref>
                        <button className={Style.formButton}>
                            Voltar
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Routine


