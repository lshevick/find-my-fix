import { useEffect, useState } from 'react';

function handleError(err) {
    console.warn(err)
}

const Dashboard = () => {
    const [garage, setGarage] = useState([])

    const getCars = async () => {
        const response = await fetch(`/api/v1/cars/`).catch(handleError);
        if(!response.ok) {
        throw new Error('Network response not ok');
        }
        const json = await response.json(); 
        console.log(json)
        setGarage(json)
    }

    useEffect(() => {
        getCars()
    }, [])

    const garageDisplay = garage.map(c => (
        <li key={c.id}>
            <div>
                <button type='button'>{c.model}</button>
            </div>
        </li>
    ))

return (
<>
<div className='flex flex-col bg-stone-300 w-full min-h-screen'>
    <div>
        <h2>My Garage</h2>
        <ul>
            {garageDisplay}
        </ul>
    </div>
    <div>
        <h2>Find My Fix!</h2>
        
    </div>
</div>
</>
);
}

export default Dashboard