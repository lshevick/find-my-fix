import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function handleError(err) {
  console.warn(err);
}

// need to style this a bit better, also get reviews to load and display.
// will need to add a form here eventually

const ShopDetail = () => {
  const [detail, setDetail] = useState([]);
  const [reviews, setReviews] = useState([]);
  const params = useParams();

  const getShopDetail = async () => {
    const response = await fetch(`/api/v1/shops/${params.shopId}/`).catch(
      handleError
    );
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    setDetail(json);
  };

  const getReviews = async () => {
    const response = await fetch(
      `/api/v1/shops/${params.shopId}/reviews/`
    ).catch(handleError);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    const json = await response.json();
    console.log(json);
    setReviews(json);
  };

  useEffect(() => {
    getShopDetail();
    getReviews();
  }, []);

  const serviceList =
    detail.services && detail.services.map((i) => <li key={i}>{i}</li>);

  const reviewList = reviews.map((r) => (
    <li key={r.id} className='bg-stone-300 p-2 my-1 flex flex-col items-start w-full'>
      <div>
        <span className="mr-2 font-bold">{r.username}</span>
        <span>{r.rating} stars</span>
      </div>
      <div>
        <ul>{r.service && r.service.map(s => <li key={s} className='font-light text-md p-1 bg-stone-100 rounded'>{s}</li>)}</ul>
      </div>
        <p>{r.body}</p>
    </li>
  ));

  const shopInfo = (
    <div key={detail.id} className='grid grid-cols-1 bg-stone-100 h-full'>
      <div className="col-start-1">
        <h1 className="font-semibold text-red-900">{detail.name}</h1>
        <div className="flex flex-col items-center justify-center">
        <p>{detail.phone}</p>
        <p>{detail.address}</p>
        </div>
      </div>
      <div className="flex flex-col items-start mx-auto">
        <h2 className="underline font-medium">Services</h2>
        <ul className="flex flex-col items-start list-disc">{serviceList}</ul>
      </div>
      <div className="flex flex-col bg-neutral-50 my-2 p-2">
        <p className="underline font-medium">Reviews</p>
        <ul className="flex flex-col items-center">{reviewList}</ul>
        
      </div>
      <div>
        <form >
            
        </form>
      </div>
    </div>
  );

  return <>{shopInfo}</>;
};

export default ShopDetail;
