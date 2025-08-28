import React from 'react'
import { Link } from 'react-router-dom';


const Contact = ({ listing }) => {
    const [agent, setAgent] = React.useState(null);
    const [message, setMessage] = React.useState("");
    const onChangeMessage = (e) => {
        setMessage(e.target.value);
    };
    React.useEffect(() => {
        const fetchAgent = async () => {
            try {
                const response = await fetch(`/api/user/getUser/${listing.userRef}`);
                const data = await response.json();
                if (data.success && data.user) {
                    setAgent(data.user);
                }
            } catch (error) {
                console.error("Error fetching agent:", error);
            }
        };
        fetchAgent();
    }, [listing.userRef]);

    return (
        <>
            {agent && (
                <div className='flex flex-col gap-3 items-center  justify-center mt-6'>
                    <p className='text-center'>
                        Contact <span className='font-bold text-blue-700'>{agent.username}</span> for listing: <span className='font-semibold'>{listing.name}</span>
                    </p>
                    <textarea
                        className='w-full max-w-lg border border-gray-300 p-3 rounded'
                        name="message"
                        id="message"
                        placeholder="Type your message here..."
                        rows='2'
                        value={message}
                        onChange={onChangeMessage}
                    ></textarea>
                    <Link
                        to={`mailto:${agent.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className='bg-slate-700 text-white text-center p-2 rounded-lg hover:opacity-80 w-full max-w-lg'
                    >
                        Send Message
                    </Link>
                </div>
            )}
        </>
    );
}

export default Contact