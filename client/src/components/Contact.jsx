import React from 'react'
import { Link } from 'react-router-dom';


const Contact = ({ listing }) => {
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const [agent, setAgent] = React.useState(null);
    const [message, setMessage] = React.useState("");
    const onChangeMessage = (e) => {
        setMessage(e.target.value);
    };
    React.useEffect(() => {
        const fetchAgent = async () => {
            try {
                const response = await fetch(`${VITE_API_URL}/user/getUser/${listing.userRef}`, {
                    credentials: "include", // ✅ add this
                });
                const data = await response.json();
                if (data.success && data.user) {
                    setAgent(data.user);
                }
            } catch (error) {
                console.error("Error fetching agent:", error);
            }
        };
        fetchAgent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <a
                        href={`mailto:${agent.email}?subject=Regarding ${listing.name}&body=${message}`}
                        className='bg-slate-700 text-white text-center p-2 rounded-lg hover:opacity-80 w-full max-w-lg'
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Send Message
                    </a>
                </div>
            )}
        </>
    );
}

export default Contact