import React from "react";
import { trpc } from "../utils/trpc";
import { useForm, useFieldArray } from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import { createQuestionValidator, CreateQuestionInputType } from "../shared/create-question-validator";
import { useRouter } from "next/router";

const CreateQuestionForm = () => {

    const router = useRouter();
    const { 
        register,
        handleSubmit,  
        control,
        formState: { errors },
    } = useForm<CreateQuestionInputType>({
        resolver: zodResolver(createQuestionValidator),
        defaultValues: {
            options: [{text: "Yes"},{text: "No"}]
        }
    });

    const {fields, append, prepend, remove, swap, move, insert} = useFieldArray({
        control,
        name: "options",
    });

 const {mutate, isLoading, data} = trpc.useMutation("questions.create",{
    onSuccess: (data) => {
        router.push(`/question/${data.id}`)
    },
})

  if (isLoading || data) return <div>Loading...</div>

  return (
    <div className="antialiased text-gray-100 px-6">
      <div className="max-w-xl mx-auto py-12 md:max-w-4xl"> 
        <h2 className="text-2xl font-bold">Create Question</h2>
        <p className="mt-2 text-lg text-gray-300">
          Add or delete options as you like!
        </p>
        <form onSubmit={handleSubmit((data) => {
            mutate(data);
            })}>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start my-4">
          <div className="grid grid-cols-1 gap-6">
            <label className="block">
              <span className="text-gray-200">Question</span>
              <input
              {...register("question")}
                type="text"
                className="form-input mt-1 block w-full text-gray-800"
                placeholder="What is your favorite food?"
              />
            </label>
            {errors.question && (<p className="text-red-400">{errors.question.message as any}</p>)}
        </div> 
        </div>
        {errors.options && <p className="text-red-400">{errors.options.message}</p>}
        {fields.map((field,index) => {
            return (
                <div key={field.id}>
                    <section className={"section"} key={field.id}>
                        <input
                            placeholder="name"
                            {...register(`options.${index}.text` as const, {
                                required: true,
                            })}
                            className={"form-input mt-1 block w-full text-gray-900"}
                            />
                            <button type="button" onClick={() => remove(index)} >
                            DELETE
                            </button>
                    </section>
                </div>
            )
        })}
        <div>
            <button 
            type="button" 
            value="Add option" 
            onClick={ () => append ({text: "Another option"})}
            >
            Add option
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <label className="block">
              <input
                type="submit"
                className="form-input text-gray-900"
                value="Create question"
              />
            </label> 
        </div>
        </form>  
      </div>
    </div>
)}

const CreateQuestion: React.FC = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const client = trpc.useContext();
    const {mutate, isLoading} = trpc.useMutation("questions.create", {
      onSuccess: (data) => {
        console.log("did we succeed?", data);
        client.invalidateQueries(["questions.get-all-my-questions"])
        if (!inputRef.current) return
        inputRef.current.value = "";
      }
    })

    return <CreateQuestionForm />
  }
 
export default CreateQuestion;