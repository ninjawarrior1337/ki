import { useForm } from "react-hook-form"
import { RouterInput, trpc } from "../utils/trpc"

type ModalProps = {
    onClose: () => void
    date: Date
}

type FormRepr = Omit<RouterInput["mt"]["createMoodTrackerEntry"], "date">

const MoodTrackerInput: React.FC<ModalProps> = (props) => {
    const trpcx = trpc.useUtils()
    const entryQuery = trpc.mt.getMoodTrackerEntry.useQuery({date: props.date}, {
        refetchOnWindowFocus: false
    })

    const createEntry = trpc.mt.createMoodTrackerEntry.useMutation({
        onSuccess() {
            trpcx.mt.getMoodTrackerEntries.invalidate()
            trpcx.mt.getMoodTrackerEntry.invalidate()
        }
    })
    const deleteEntry = trpc.mt.deleteMoodTrackerEntry.useMutation({
        onSuccess() {
            trpcx.mt.getMoodTrackerEntries.invalidate()
            trpcx.mt.getMoodTrackerEntry.invalidate()
        }
    })

    const {register, handleSubmit, reset} = useForm<FormRepr>({
        values: {
            feeling: entryQuery.data?.feeling || 'NEUTRAL',
            content: entryQuery.data?.content || ''
        }
    })

    const onSubmit = async (data: FormRepr) => {
        try {
            await createEntry.mutateAsync({
                ...data,
                date: props.date
            })
            reset()
        } catch(e) {
            console.log(e)
        }
    }

    if(entryQuery.isLoading) {
        return <img className="w-32" src="puff.svg"/>
    }

    if(entryQuery.isError) {
        return <span>Error while Loading: {entryQuery.error.message}</span>
    }

    return (
        <>
            <form className="flex flex-col space-y-2" onSubmit={handleSubmit(onSubmit)}>
                <span className="font-bold text-4xl p-2">{props.date.toLocaleDateString("default", {timeZone: "UTC"})}</span>
                <label className="self-start">General sentiment</label>
                <select {...register("feeling")} className="select select-primary">
                    <option disabled value="">Select general sentiment of today</option>
                    <option value={"NEGATIVE"}>Negative</option>
                    <option value={"NEUTRAL"}>Neutral</option>
                    <option value={"POSITIVE"}>Positive</option>
                </select>
                <label className="self-start">Optional comments</label>
                <textarea placeholder="Comments about your day" rows={4} className="textarea textarea-primary" {...register("content")}></textarea>
                <div className="flex flex-row items-center justify-evenly space-y-2">
                    <button type="submit" className={`btn btn-primary ${createEntry.isLoading ? "loading": null}`}>Save</button>
                    <button className={`btn btn-error ${entryQuery.data?.id ? null : "btn-disabled"}`} 
                        onClick={(e) => {e.preventDefault(); deleteEntry.mutate({id: entryQuery.data?.id || 0})}}>Delete</button> 

                </div>
            </form>
        </>
    )
}

type ModalPropsParent = {
    isOpen: boolean
} & ModalProps

export const MoodTrackerModal: React.FC<ModalPropsParent> = ({isOpen, onClose, date}) => {
    return (
        <div className={`modal ${isOpen ? "modal-open" : null}`}>
            <div className="modal-box relative flex flex-col items-center">
                <button onClick={onClose} className="absolute btn btn-circle btn-sm top-2 right-2 btn-error">x</button>
                <MoodTrackerInput date={date} onClose={onClose}/>
            </div>
        </div>
    )
}