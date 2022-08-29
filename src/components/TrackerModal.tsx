import { useForm } from "react-hook-form"
import { inferMutationInput, trpc } from "../utils/trpc"

type ModalProps = {
    onClose: () => void
    date: Date
}


const MoodTrackerInput: React.FC<ModalProps> = (props) => {
    const trpcx = trpc.useContext()
    const entryQuery = trpc.useQuery(["mt.getMoodTrackerEntry", {date: props.date}], {
        refetchOnWindowFocus: false,
        onSuccess(d) {
            d?.date ? setValue("date", d.date) : setValue("date", props.date)
            d?.content ? setValue("content", d.content) : setValue("content", "")
            d?.feeling ? setValue("feeling", d.feeling) : setValue("feeling", "NEUTRAL")
        }
    })
    const createEntry = trpc.useMutation(["mt.createMoodTrackerEntry"], {
        onSettled() {
            trpcx.invalidateQueries(["mt.getMoodTrackerEntries"])
            trpcx.invalidateQueries(["mt.getMoodTrackerEntry"])
        }
    })
    const deleteEntry = trpc.useMutation(["mt.deleteMoodTrackerEntry"], {
        onSettled() {
            trpcx.invalidateQueries(["mt.getMoodTrackerEntries"])
            trpcx.invalidateQueries(["mt.getMoodTrackerEntry"])
        }
    })

    const {register, handleSubmit, reset, setValue} = useForm<inferMutationInput<"mt.createMoodTrackerEntry">>()

    const onSubmit = async (data: inferMutationInput<"mt.createMoodTrackerEntry">) => {
        console.log(data.date)
        try {
            await createEntry.mutateAsync(data)
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
                <select {...register("feeling")} className="select select-primary" defaultValue={""}>
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