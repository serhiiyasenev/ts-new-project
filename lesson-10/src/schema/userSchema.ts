import { z } from 'zod';

export const userSchema = z.object({
    firstName: z.string().nonempty("First name is required").regex(/^[A-Za-z]+$/i, "First name must contain only letters"),
    lastName: z.string().nonempty("Last name is required").regex(/^[A-Za-z]+$/i, "Last name must contain only letters"),
    email: z.email("Invalid email address").min(1, "Email is required"),
    dateOfBirth: z.string().nonempty("Date of birth is required").refine((date) => {
        const dob = new Date(date);
        const today = new Date();
        return dob < today;
    }, { message: "Date of birth must be in the past" }),
});

export type UserFormFields = z.infer<typeof userSchema>;