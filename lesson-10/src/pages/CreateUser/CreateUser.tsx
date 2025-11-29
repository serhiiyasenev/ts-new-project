import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import './CreateUser.css';
import { createUser } from "../../api";
import { userSchema, type UserFormFields } from "../../schema/userSchema";

const CreateUser = () => {
    const { register, handleSubmit, formState: { isValid, errors } } = useForm<UserFormFields>({
      mode: "onTouched", 
      resolver: zodResolver(userSchema)
    });

    const navigate = useNavigate();
    
    const onSubmit = async (data: UserFormFields) => {
      try {
        await createUser(data);
        navigate("/users");
      } catch (error) {
        alert(error instanceof Error ? error.message : "Error creating user");
      }
    }

  return (
    <div className="create-user">
      <h1>Create New User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="user-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" {...register("name")} />
          <div className="error">{errors.name?.message}</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" {...register("email")} />
          <div className="error">{errors.email?.message}</div>
        </div>
        
        <div className="form-group">
          <label htmlFor="isActive">
            <input id="isActive" type="checkbox" {...register("isActive")} defaultChecked />
            Active
          </label>
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