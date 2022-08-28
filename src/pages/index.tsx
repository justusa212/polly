import type { NextPage } from 'next'
import { trpc } from '../utils/trpc'
import React from "react"
import Link from 'next/link'
 
const Home: NextPage = (props: any) => {
  const {data, isLoading} = trpc.useQuery(["questions.get-all"]);

  if(isLoading || !data) return <div>Loading...</div>;
  
  return (
    <div className="p-6 flex flex-col w-screen items-stretch">
      <div className="header flex w-full justify-between">
      <Link href={`/`}>
      <a>
      <div className="text-2xl font-bold">All Questions</div>
      </a>
      </Link>
      <Link href={`/managequestions/`}>
      <a>
      <div className="text-2xl font-bold">Your Questions</div>
      </a>
      </Link>
      <Link href="/create"><a className='bg-gray-300 rounded text-gray-800 p-4'>Create New Question</a></Link>
      </div>
      <div className="flex flex-col">
        {data.map((question) => {
          return (
            <Link href={`/question/${question.id}`} key={question.id}>
              <a>
              <div className="flex flex-col my-2">
                <div key={question.id} className=""> 
                  {question.question}
                </div>
                <span>Created on {question.createdAt.toDateString()}</span>
              </div>
              </a>
            </Link>
          )
        })}
      </div> 
    </div>
    )
}

export default Home