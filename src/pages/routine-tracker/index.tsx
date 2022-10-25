import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import Style from '../../styles/routine-tracker/Index.module.css'
import { trpc } from '../../utils/trpc'

const Index: NextPage = () => {
    const {data: myText} = trpc.tracker.getRoutines.useQuery()
    console.log('Log:', myText)
    const {data: user} = trpc.tracker.getUser.useQuery()
    console.log('Log:', user, Date.now())
    const {data: session} = useSession();
    console.log('Session:', session, Date.now())
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
                    <RoutineCard></RoutineCard>
                    <DailyRoutineCard></DailyRoutineCard>
                </div>
            </div>
        </div>
    )
}

export default Index

const RoutineCard: React.FC = () => {
    return (
        <div className={Style.routineCard}>
            <div className={Style.routineHeader}>
                <h2 className={Style.routineDate}>Day 10/21/2022</h2>
            </div>
            <div className={Style.routineBody}>

                <div className={Style.routineItemContainer}>
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
                </div>

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
                    <p className={Style.routineItem }>Have you done it?</p>
                    <div className={Style.routineItemStatus  + ' ' + Style.routineSuccess} onClick={() => toggleSuccess()}></div>
                </div>

                <div className={Style.routineItemContainer}>
                    <p className={Style.routineItem}>Have you done it?</p>
                    <div className={Style.routineItemStatus  + ' ' + Style.routineFailed} onClick={() => toggleSuccess()}></div>
                </div>

                <div className={Style.routineItemContainer}>
                    <p className={Style.routineItem}>Have you done it?</p>
                    <div className={Style.routineItemStatus  + ' ' + Style.routineFailed} onClick={() => toggleSuccess()}></div>
                </div>

                <div className={Style.routineItemContainer}>
                    <p className={Style.routineItem}>Have you done it?</p>
                    <div className={Style.routineItemStatus  + ' ' + Style.routineSuccess} onClick={() => toggleSuccess()}></div>
                </div>

            </div>
            <div className={Style.routineRate}>
                <p>89%</p>
            </div>
        </div>
    )
}