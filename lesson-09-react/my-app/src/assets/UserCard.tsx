type UserCardProps = {
  name: string;
  age: number;
  city?: string;
};

const UserCard = ({ name, age, city }: UserCardProps) => {
  return (
    <div className="user-card">
      <p>Name: {name}</p>
      <p>Age: {age}</p>
      {city && <p>City: {city}</p>}
    </div>
  );
}

export default UserCard;
