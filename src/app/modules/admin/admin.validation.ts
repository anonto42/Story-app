import { z } from "zod";

const postUpload = z.object({
    body: z.object({
        type: z.enum(["MUSIC", "STORY"],{required_error: "You must give the type of your post"}),
        title: z.string({required_error: "You must give the title of the post"}),
        mentorName: z.string({required_error: "mentor name is required"}),
        category: z.string({required_error: "category name is required"}),
        targetedAge:  z.string({required_error: "mentor name is required"}),
        duration:  z.string({required_error: "duration is required"}),
        description:  z.string({required_error: "description is required"})
    })
})


const createSubZodModel = z.object({
    body: z.object({
        title: z.string({required_error: "You must give the title of the post"})
    })
})

const updateSchemaZod = z.object({
    body: z.object({
        title: z.string({required_error: "You must give the title of the post"})
    })
})

const policyZodSchema = z.object({
    body: z.object({
        data: z.string({required_error: "You must give the data of the update the policy"})
    })
})

const conditionsZodSchema = z.object({
    body: z.object({
        data: z.string({required_error: "You must give the data of the update the terms & conditions"})
    })
})

export const AdminValidaton = {
    postUpload,
    createSubZodModel,
    updateSchemaZod,
    policyZodSchema,
    conditionsZodSchema
}