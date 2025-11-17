import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "../api/usersApi";

const userSchema = z.object({
    firstName: z.string().nonempty("First name is required").regex(/^[A-Za-z]+$/i, "First name must contain only letters"),
    lastName: z.string().nonempty("Last name is required").regex(/^[A-Za-z]+$/i, "Last name must contain only letters"),
    email: z.email("Invalid email address").min(1, "Email is required"),
    dateOfBirth: z.string().nonempty("Date of birth is required").refine((date) => {
        const dob = new Date(date);
        const today = new Date();
        return dob < today;
    }, { message: "Date of birth must be in the past" }),
});

export type CreateUserData = z.infer<typeof userSchema>;

const CreateUser = () => {
    const { register, handleSubmit, formState: { isValid, errors } } = useForm<CreateUserData>({
      mode: "onTouched", 
      resolver: zodResolver(userSchema)
    });
      const onSubmit = (data: CreateUserData) => {
      const payload = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString().split('T')[0]
      };
      console.log(payload);

      createUser(payload);
    }

  return <div>
    <h1>Create User Page</h1>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
      <label htmlFor="firstName">First Name:</label><br />
      <input type="text" {...register("firstName", {required: "First name is required"})} />
      <div className="error"> {errors.firstName?.message} </div>
       </div>
      <div> 
      <label htmlFor="lastName">Last Name:</label><br />
      <input type="text" {...register("lastName", {required: "Last name is required"})} />
      <div className="error"> {errors.lastName?.message} </div>
      </div>
      <div> 
      <label htmlFor="email">Email:</label><br />
      <input type="email" {...register("email", {required: "Email is required"})} />
      <div className="error"> {errors.email?.message} </div>
      </div>
      <div> 
      <label htmlFor="dateOfBirth">Date of Birth:</label><br />
      <input type="date" {...register("dateOfBirth", {required: "Date of birth is required"})} />
      <div className="error"> {errors.dateOfBirth?.message} </div>
      </div>
      <button type="submit" disabled={!isValid}>Create</button>
    </form>
  </div>;
}

export default CreateUser;