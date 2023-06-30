import React from "react";

export default function ContactCard() {
  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Shoes!</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
      </div>
      <figure>
        <img
          src="https://img.freepik.com/free-vector/programmer-work-with-working-day-symbols-flat-illustration_1284-60322.jpg?w=2000&t=st=1687475655~exp=1687476255~hmac=542dffc069a740e80337b55d021a88676a6b8d3a67a66b4803fcc9c3d39639a8"
          alt="Shoes"
        />
      </figure>
      <button className="btn btn-primary">Contact now</button>
    </div>
  );
}
