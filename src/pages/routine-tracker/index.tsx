import { NextPage } from 'next'
import Link from 'next/link'
import React, { useEffect } from 'react'
import Style from '../../styles/routine-tracker/Index.module.css'
import { trpc } from '../../utils/trpc'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { signIn, useSession } from 'next-auth/react'

const Index: NextPage = () => {

    const { data: user } = trpc.tracker.getUser.useQuery()
    console.log('Log:', user)

    const { data: session } = useSession();


    return (
        <div className={Style.contentWrapper}>
            <div className={Style.mainContainer}>
                <div className={Style.header}>
                    <h1>Routine Trackerr</h1>
                </div>
                <div className={Style.greetings}>
                    <p className={Style.hello}>Olá, {session?.user?.name}</p>
                    <Link href="/routine-tracker/edit/routine" passHref>
                        <p className={Style.editButton}>
                            Editar Rotina
                        </p>
                    </Link>
                </div>
                {
                    session ?
                        (<div className={Style.routineContainer}>
                            {user && user.routineModel ? <DailyRoutineCard></DailyRoutineCard> : null}
                            <p className={Style.before}>Dias anteriores:</p>
                            {user && user.routineModel?.exercises ? <RoutineCard></RoutineCard> : null}
                        </div>)
                        :
                        <div className={Style.loginContainer}>
                            <p className={Style.loginParagraph}>
                                Parece que você não está logado. Faça o login ou registre-se através do botão abaixo:
                            </p>
                            <button
                                className={Style.loginButton}
                                onClick={() => signIn()}
                            >
                                Login
                            </button>
                        </div>
                }
            </div>
        </div>
    )
}

export default Index

// type Exercises = [{
//     id: string,
//     task: string,
//     routineModelId: string,
//     concluded: boolean
// }]

export const RoutineCard: React.FC = () => {


    const { data: userRoutine } = trpc.tracker.getUser.useQuery()

    function getPercentageRoutine(index: number) {
        const totalExercises = userRoutine?.routines[index]?.exercises.length
        const totalExercisesConcluded = userRoutine?.routines[index]?.exercises.filter(exercise => exercise.concluded === true).length
        if (totalExercisesConcluded && totalExercises) {
            const percentage = Math.floor((totalExercisesConcluded / totalExercises) * 100)

            return percentage
        }
        return 0
    }

    return (
        <>
            {
                userRoutine?.routines?.slice(1).map((routine, index) => {

                    return (
                        <div className={Style.routineCard} key={routine.id}>
                            <div className={Style.routineHeader}>
                                <h2 className={Style.routineDate}>Day {routine.createdAt.toLocaleDateString('pt-br')}</h2>
                            </div>
                            <div className={Style.routineBody}>


                                {
                                    routine.exercises.map(exercise => {
                                        return (
                                            <div className={Style.routineItemContainer} key={exercise.id}>
                                                <p className={Style.routineItem}>{exercise.task}</p>
                                                <div className={Style.routineItemStatus + ' ' + `${exercise.concluded ? Style.routineSuccess : Style.routineFailed}`}>
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                            </div>
                            <div className={Style.routineRate}>
                                <p>{getPercentageRoutine(index + 1) + '%'}</p>
                            </div>
                        </div>

                    )
                })


            }

        </>
    )
}

// type Routine = [{
//     createdAt: Date,
//     exercises: Exercises,
//     id: string
// }]

const DailyRoutineCard: React.FC = () => {


    const utils = trpc.useContext();
    const toggleTask = trpc.tracker.toggleTask.useMutation({
        onSuccess: () => {
            utils.tracker.getUser.invalidate();
        }
    });

    const createRoutine = trpc.tracker.createRoutine.useMutation({
        onSuccess: () => {
            utils.tracker.getUser.invalidate();
        }
    });

    const { data: userRoutines } = trpc.tracker.getUser.useQuery();


    useEffect(() => {
        if (userRoutines) {
            if (userRoutines.routines.length === 0) {
                createRoutine.mutate();
            } else {
                const lastRoutine = userRoutines.routines[0];
                const today = new Date();
                if (lastRoutine) {
                    const lastRoutineDate = new Date(lastRoutine.createdAt);
                    if (lastRoutineDate.getDate() !== today.getDate()) {
                        console.log('createRoutine: ', lastRoutineDate.getDate() !== today.getDate())
                        createRoutine.mutate();
                    }
                }
            }

        }

    }, [userRoutines])



    function getPercentageRoutine() {
        const totalExercises = userRoutines?.routines[0]?.exercises.length
        const totalExercisesConcluded = userRoutines?.routines[0]?.exercises.filter(exercise => exercise.concluded === true).length
        if (totalExercisesConcluded && totalExercises) {
            const percentage = Math.floor((totalExercisesConcluded / totalExercises) * 100)

            return percentage
        }
        return 0
    }


    return (<>
        {
            userRoutines?.routines[0] && <div className={Style.routineCard} key={userRoutines?.routines[0].id}>
                <div className={Style.routineHeader}>
                    <h2 className={Style.routineDate}>Day {userRoutines?.routines[0].createdAt.toLocaleDateString('pt-br')}</h2>
                </div>
                <div className={Style.routineBody}>
                    {
                        userRoutines?.routines[0].exercises.map(exercise => {
                            return (
                                <div className={Style.routineItemContainer} key={exercise.id}>
                                    <p className={Style.routineItem}>{exercise.task}</p>
                                    <div className={Style.routineItemStatus + ' ' + `${exercise.concluded ? Style.routineSuccess : Style.routineFailed}`} onClick={() => toggleTask.mutate({ id: exercise.id, concluded: !exercise.concluded })}></div>
                                </div>
                            )
                        })
                    }

                </div>
                <div className={Style.routineRate}>
                    <p>{getPercentageRoutine() + '%'}</p>
                </div>
            </div>

        }
    </>
    )
}

export const RoutineModelCard: React.FC = () => {

    const [parent] = useAutoAnimate<HTMLDivElement>()

    const utils = trpc.useContext();

    const deleteTask = trpc.tracker.deleteModelTask.useMutation({
        onSuccess: () => {
            utils.tracker.getUser.invalidate();
        }
    });

    const { data: userRoutine } = trpc.tracker.getUser.useQuery();
    return (
        <div className={Style.routineCard}>
            <div className={Style.routineHeader}>
                <h2 className={Style.routineDate}>Dia {new Date().toLocaleDateString('pt-br')}</h2>
            </div>
            <div ref={parent} className={Style.routineBody}>


                {
                    userRoutine?.routineModel?.exercises.map(exercise => {
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