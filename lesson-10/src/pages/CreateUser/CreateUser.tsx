import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api";
import type { CreateUserData } from "../../types";
import './CreateUser.css';

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

const CreateUser = () => {
    const { register, handleSubmit, formState: { isValid, errors } } = useForm<CreateUserData>({
      mode: "onTouched", 
      resolver: zodResolver(userSchema)
    });
    const navigate = useNavigate();
    
    const onSubmit = async (data: CreateUserData) => {
      const payload = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).toISOString().split('T')[0]
      };
      try {
        const newUser = await createUser(payload);
        console.log("User created successfully:", newUser);
        navigate("/users");
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }

  return (
    <div className="create-user">
      <h1>Create New User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="user-form">
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input id="firstName" type="text" {...register("firstName")} />
          <div className="error">{errors.firstName?.message}</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input id="lastName" type="text" {...register("lastName")} />
          <div className="error">{errors.lastName?.message}</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" {...register("email")} />
          <div className="error">{errors.email?.message}</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth:</label>
          <input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
          <div className="error">{errors.dateOfBirth?.message}</div>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/users')} className="button-secondary">
            Cancel
          </button>
          <button type="submit" disabled={!isValid} className="button-primary">
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateUser;