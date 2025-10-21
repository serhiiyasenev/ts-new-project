const Greeting = (props: { name: string }) => {
    console.log('Greeting component rendered');
    return <h1>Hello, {props.name}!</h1>;
};

export default Greeting;
