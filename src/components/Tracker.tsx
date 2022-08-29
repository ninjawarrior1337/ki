import { PropsWithChildren, useCallback, useMemo, useState, memo } from "react"
import { inferQueryOutput, trpc } from "../utils/trpc"
import { MoodTrackerModal } from "./TrackerModal"

const dayStrings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const MoodTracker: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [year, setYear] = useState(2022)
    const [modalOpen, setModalOpen] = useState(false)

    const getAllDaysThisYear = useMemo(() => {
        const date = new Date(Date.UTC(year, 0, 1))
        const dates = []

        while(date.getUTCFullYear() === year) {
            dates.push(new Date(date))
            date.setUTCDate(date.getUTCDate()+1)
        }

        return dates
    }, [year])

    const {data: entryData, isLoading: entryDataLoading} = trpc.useQuery(["mt.getMoodTrackerEntries", {year}])

    const openDayEntry = (d: Date) => {
        setSelectedDate(d)
        setModalOpen(true)
    }

    return (
        <>
            <div className="flex text-2xl space-x-2 font-bold">
                <button onClick={() => setYear(y => y-1)}>-</button>
                {
                    entryDataLoading ?
                    <img src="puff.svg"/> :
                    <h2>{year}</h2>
                }
                <button onClick={() => setYear(y => y+1)}>+</button>
            </div>
            <div className={"grid grid-rows-7 grid-flow-col gap-2"}>
                {
                    getAllDaysThisYear.slice(0, 7).map((d) => <span className="text-xs my-0" key={d.getUTCDay()}>{dayStrings[d.getUTCDay()]}</span>)
                }
                {
                    getAllDaysThisYear.map((d, idx) => (
                        <DayEntry entryData={entryData} onClick={() => openDayEntry(d)} date={d} key={idx}></DayEntry>
                    ))
                }
            </div>
            <MoodTrackerModal date={selectedDate} onClose={() => setModalOpen(false)} isOpen={modalOpen}/>
        </>
    )
}



type DayEntryProps = {
    children?: React.ReactNode
    date: Date,
    entryData?: inferQueryOutput<"mt.getMoodTrackerEntries">
    onClick?: () => void
}

const DayEntry: React.FC<PropsWithChildren<DayEntryProps>> = ({children, date, onClick, entryData}) => {
    const isToday = date.toLocaleDateString("default", {timeZone: "UTC"}) == new Date(Date.now()).toLocaleDateString()

    const computeColor = useMemo(() => {
        for(const e of entryData || []) {
            if(e.date.getTime() == date.getTime()) {
                switch(e.feeling){
                    case "NEGATIVE":
                        return "bg-blue-800"
                    case "NEUTRAL":
                        return "bg-blue-600"
                    case "POSITIVE":
                        return "bg-blue-400"
                }
            }
        }
        return null
    }, [entryData, date])

    return (
        <div onClick={onClick} 
            className={`dropdown dropdown-hover dropdown-top cursor-pointer border ${isToday ? 'border-info' : "border-gray-500"} w-4 h-4 rounded ${computeColor}`}>
            {children}
            <div tabIndex={0} className="dropdown-content menu p-2 bg-base-100 rounded-box">
                {date.toLocaleDateString("default", {timeZone: "UTC"})}
            </div>
        </div>
    )
}

export default MoodTracker