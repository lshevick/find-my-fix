import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"

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
        <Link to='/add-car'>Add a Car</Link>
    </div>
    <div>
        <h2>Find My Fix!</h2>
        <ul>
            {garage.map(c => (<li key={c.id}><button>{c.model}</button></li>))}
        </ul>

    </div>
</div>
</>
);
}

export default Dashboard