import React from "react";
import "./EventItem.css";
import owner from "../../../../assets/img/my.png";

const eventItem = (props) => (
  <li key={props.eventId} className="events__list-item">
    <div>
      <h1>{props.title}</h1>
      <h2>${props.price}</h2>
      <div className="data">{new Date(props.date).toLocaleDateString()}</div>
    </div>

    <div>
      {props.userId === props.creatorId ? (
        <img src={owner} />
      ) : (
        <button className="btn" onClick={props.onDetail.bind(this, props.eventId)}>View Details</button>
      )}
    </div>
  </li>
);

export default eventItem;
