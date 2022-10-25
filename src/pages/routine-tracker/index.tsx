import { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import Style from '../../styles/routine-tracker/Index.module.css'
import { trpc } from '../../utils/trpc'
import { useAutoAnimate } from '@formkit/auto-animate/react'

const Index: NextPage = () => {
    const { data: myText } = trpc.tracker.getRoutines.useQuery()
    console.log('Log:', myText)
    const { data: user } = trpc.tracker.getUser.useQuery()
    console.log('Log:', user)
    return (
        <div className={Style.contentWrapper}>
            <div className={Style.mainContainer}>
                <div className={Style.header}>
                    <h1>Routine Tracker</h1>
                </div>
                <div className={Style.greetings}>
                    <p className={Style.hello}>Olá, fulano <Link href="/routine-tracker/edit/routine">Edit</Link></p>
                </div>
                <div className={Style.routineContainer}>
                    <RoutineCard exercises={user?.routineModel?.exercises}></RoutineCard>
                    <DailyRoutineCard></DailyRoutineCard>
                </div>
            </div>
        </div>
    )
}

export default Index

type Exercises = [{
    id: string,
    task: string,
    routineModelId: string,
    concluded: boolean
}]

export const RoutineCard: React.FC<{ exercises: Exercises }> = (props) => {
    return (
        <div className={Style.routineCard}>
            <div className={Style.routineHeader}>
                <h2 className={Style.routineDate}>Day 10/21/2022</h2>
            </div>
            <div className={Style.routineBody}>


                {
                    props.exercises?.map(exercise => {
                        return (
                            <div className={Style.routineItemContainer} key={exercise.id}>
                                <p className={Style.routineItem}>{exercise.task}</p>
                                <div className={Style.routineItemStatus + ' ' + `${exercise.concluded ? Style.routineSuccess : Style.routineFailed}`}>
                                </div>
                            </div>
                        )
                    })
                }
                {/* <div className={Style.routineItemContainer}>
                    <p className={Style.routineItem }>Have you done it?</p>
                    <div className={Style.routineItemStatus  + ' ' + Style.routineSuccess}></div>
                </div>

                <div className={Style.routineItemContainer}>
                    <p className={Style.routineItem}>Have you done it?</p>
                    <div className={Style.routineItemStatus  + ' ' + Style.routineFailed}></div>
                </div>

                <div className={Style.routineItemContainer}>
                    <p className={Style.routineItem}>Have you done it?</p>
                    <div className={Style.routineItemStatus  + ' ' + Style.routineFailed}></div>
                </div>

                <div className={Style.routineItemContainer}>
                    <p className={Style.routineItem}>Have you done it?</p>
                    <div className={Style.routineItemStatus  + ' ' + Style.routineSuccess}></div>
                </div> */}

            </div>
            <div className={Style.routineRate}>
                <p>89%</p>
            </div>
        </div>
    )
}

const DailyRoutineCard: React.FC = () => {





    async function toggleSuccess() {
        console.log('toggled')
    }



    return (
        <div className={Style.routineCard}>
            <div className={Style.routineHeader}>
                <h2 className={Style.routineDate}>Day 10/21/2022</h2>
            </div>
            <div className={Style.routineBody}>

                <div className={Style.routineItemContainer}>
                    <p className={Style.routineItem}>Have you done it?</p>
                    <div className={Style.routineItemStatus + ' ' + Style.routineSuccess} onClick={() => toggleSuccess()}></div>
                </div>

                <div className={Style.routineItemContainer}>
                    <p className={Style.routineItem}>Have you done it?</p>
                    <div className={Style.routineItemStatus + ' ' + Style.routineFailed} onClick={() => toggleSuccess()}></div>
                </div>

                <div className={Style.routineItemContainer}>
                    <p className={Style.routineItem}>Have you done it?</p>
                    <div className={Style.routineItemStatus + ' ' + Style.routineFailed} onClick={() => toggleSuccess()}></div>
                </div>

                <div className={Style.routineItemContainer}>
                    <p className={Style.routineItem}>Have you done it?</p>
                    <div className={Style.routineItemStatus + ' ' + Style.routineSuccess} onClick={() => toggleSuccess()}></div>
                </div>

            </div>
            <div className={Style.routineRate}>
                <p>89%</p>
            </div>
        </div>
    )
}

export const RoutineModelCard: React.FC<{ exercises: Exercises }> = (props) => {

    const [parent] = useAutoAnimate<HTMLDivElement>()

    const utils = trpc.useContext();

    const deleteTask = trpc.tracker.deleteModelTask.useMutation({
        onSuccess: () => {
            utils.tracker.getUser.invalidate();
        }
    });
    return (
        <div className={Style.routineCard}>
            <div className={Style.routineHeader}>
                <h2 className={Style.routineDate}>Dia {new Date().toLocaleDateString('pt-br')}</h2>
            </div>
            <div ref={parent} className={Style.routineBody}>


                {
                    props.exercises?.map(exercise => {
                        return (
                            <div className={Style.routineItemContainer} key={exercise.id}>
                                <p className={Style.routineItem}>{exercise.task}</p>
                                <div
                                    className={Style.routineItemStatus + ' ' + `${exercise.concluded ? Style.routineSuccess : Style.routineFailed}`}
                                    onClick={() => deleteTask.mutate({ id: exercise.id })}
                                >
                                    X
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        </div>
    )
}