import React, { useState } from 'react'
import Style from '../../../styles/routine-tracker/Routine.module.css'
import { trpc } from '../../../utils/trpc';





const Routine: React.FC = () => {

    const [routines, setRoutines] = useState({task: 'placeholder'});

    const [inputValue, setInputValue] = useState('');

    function addRoutine() {
        console.log('saved?', inputValue)
        setRoutines({task: inputValue})
    }

    // function saveRoutineChanges() {
    //     console.log('saved?', routines)
    //     const request = trpc.tracker.newTask.useMutation(routines)
    //     console.log(request)
    // }

    const saveRoutineChanges =  trpc.tracker.newTask.useMutation()

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
                    <form className={Style.form} onSubmit={(e) => { e.preventDefault(); addRoutine() }}>
                        <div className={Style.labelContainer}>
                            <label className={Style.label} htmlFor="routineName">Nome da rotina</label>
                            <input className={Style.input} type="text" onChange={(e) => {setInputValue(e.currentTarget.value)}} name="routineName" id="routineName" />
                        </div>
                    </form>
                    <button onClick={(e) => { e.preventDefault(); saveRoutineChanges.mutate(routines, { onSuccess: () => console.log('success'), onError: (err) => console.log(err)}) }}>Salvar</button>
                </div>
            </div>
        </div>
    )
}

export default Routine
