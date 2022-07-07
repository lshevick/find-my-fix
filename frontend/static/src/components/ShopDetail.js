import { useState } from 'react';
import { useEffect } from 'react';
import {useParams} from 'react-router-dom'

function handleError(err) {
    console.warn(err)
}

// need to style this a bit better, also get reviews to load and display. 
// will need to add a form here eventually

const ShopDetail = () => {
    const [detail, setDetail] = useState([]);
    const params = useParams();

    const getShopDetail = async () => {
        const response = await fetch(`/api/v1/shops/${params.shopId}/`).catch(handleError);
        if(!response.ok) {
        throw new Error('Network response not ok');
        }
        const json = await response.json(); 
        setDetail(json);
    }

    useEffect(() => {
        getShopDetail();
    }, [])

    const serviceList = detail.services && detail.services.map(i => (<li key={i}>{i}</li>))

    const shopInfo = (
        <div key={detail.id}>
    <div>
        <h1>{detail.name}</h1>
        <p>{detail.phone}</p>
        <p>{detail.address}</p>
    </div>
    <div>
        <h2>Services:</h2>
        <ul>
            {serviceList}
        </ul>
    </div>
    <div>
        <p>reviews here:</p>
        <ul>
            <li><span>*****</span><p>review</p></li>
        </ul>

    </div>
</div>
    )

return (
<>
{shopInfo}
</>
);
}

export default ShopDetail