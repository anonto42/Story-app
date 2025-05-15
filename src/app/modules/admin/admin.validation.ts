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

export const AdminValidaton = {
    postUpload
}