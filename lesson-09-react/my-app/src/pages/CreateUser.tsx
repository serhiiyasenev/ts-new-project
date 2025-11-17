import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.email("Invalid email address"),
});

type CreateUserFormData = z.infer<typeof userSchema>;

const CreateUser = () => {
  const { register, handleSubmit, formState: { isValid, errors } } = useForm<CreateUserFormData>(
    { mode: "onChange", resolver: zodResolver(userSchema) }
  );

    const onSubmit = (data: CreateUserFormData) => {
      console.log(data);
    };

  return <div>
    <h1>Create User Page</h1>
    <form onSubmit={handleSubmit(onSubmit)} >  
        <input type="text" placeholder="Username" {...register("username")} /><br />
        {errors.username && <span>{errors.username.message}</span>}
        <input type="email" placeholder="Email" {...register("email")} /><br />
        {errors.email && <span>{errors.email.message}</span>}
        <button type="submit" disabled={!isValid}>Create User</button>
    </form>
  </div>;
};

export default CreateUser;