import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    contact: z.string({ required_error: 'Contact is required' }),
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: 'Password is required' }),
    location: z.string({ required_error: 'Location is required' }),
    requestedAccountType: z.enum(["REGULAR","STUDENT"],{required_error:"You must give the account type"})
  }),
});

const updateUserZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    contact: z.string().optional(),
    email: z.string().optional(),
    location: z.string().optional(),
    profile: z.string().optional(),
  })
});

const subscription = z.object({
  body: z.object({
    planID: z.string({required_error: "You must give the id of your subscription plan"})
  })
})

const dataForTheValidate = z.object({
  body: z.object({
    storyType: z.enum(["children","featured","popular"]),
    limit: z.number({required_error: "must give the limit of your returned length"})
  })
})

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
  subscription,
  dataForTheValidate
};
