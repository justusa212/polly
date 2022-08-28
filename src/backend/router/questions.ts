import { z } from 'zod';
import {prisma} from '../../db/client'
import { createRouter } from './context';
import { createQuestionValidator } from '../../shared/create-question-validator';

export const questionRouter = createRouter() 
  .query("get-all",{ 
    async resolve(){
      return prisma.pollQuestion.findMany();
    }
  })
  .query("get-all-my-questions",{ 
    async resolve({ctx}){
      if(!ctx.token) return [];
      return await prisma.pollQuestion.findMany({
        where: {
          ownerToken: {
            equals: ctx.token,
          }
        }
      }); 
    }
  })
  .query("get-by-id",{ 
    input: z.object({
      id: z.string()
    }),
    async resolve({input, ctx}){
      const pollQuestion = await prisma.pollQuestion.findFirst({
        where: {
          id: input.id,
        },
      }); 

      const myVote = await prisma.vote.findFirst({
        where: {
          questionId: input.id,
          voterToken: ctx.token,
        },
      }); 

      const rest = {
        vote: myVote,
        isOwner: pollQuestion?.ownerToken === ctx.token,
        pollQuestion
      }

      if(rest.isOwner || rest.vote){
        const votes = await prisma.vote.groupBy({
          where: {questionId: input.id},
          by: ["choice"],
          _count: true,
        })
      
      return {
        ...rest, 
        votes,
      }
    }
      return {...rest, votes: undefined};
    }
  })
  .mutation("vote-on-question", {
    input: z.object({questionId: z.string(), option: z.number().min(0).max(10)}),
    async resolve({input, ctx}) {
      if(!ctx.token) throw new Error("Unauthorized")
        return await prisma.vote.create({
            data: {
            questionId: input.questionId,
            choice: input.option,
            voterToken: ctx.token,
            }
        })
    }
  })
  .mutation("create", {
    input: createQuestionValidator,
    async resolve({input, ctx}) {
      if(!ctx.token) throw new Error("Unauthorized")
        return await prisma.pollQuestion.create({
            data: {
            question: input.question,
            options: input.options,
            ownerToken: ctx.token,
            }
        })
    }
  })
  .mutation('delete', {
    input: z.object({
      id: z.string()
    }),
    async resolve(req) {
        cats = cats.filter(cat => cat.id !== req.input.id);
        return "success"
    }
  });