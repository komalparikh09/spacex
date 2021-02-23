import React from 'react';
import './LaunchCard.css';

const launch = props => {
  let missionIds = null;
  if (props.mission_id.length > 0) {
    missionIds = props.mission_id.map((key, index) => {
      return (
        <li key={key}>
          {key}
        </li>
      );
    });
  }
  return (
    <a href={props.article_link} target="_blank">
      <article className="main-article">
        <label for={props.id}><img src={props.image} alt="SpaceX Launch Program Mission Patch" width="170px" height="190px"/></label>
        <br />
        <div className="name">
          {props.mission_name}&nbsp;#{props.flight_number}
        </div>
        <br />
        <br />
        <div className="content">
          <span className="key">Mission Ids:</span>
          <span className="value">
            <ul className="mission-list">
              {missionIds}
            </ul>
          </span>
        </div>
        <br />
        <div className="content">
          <span className="key">Launch Year:</span>&nbsp;<span className="value">{props.launch_year}</span>
        </div>
        <br />
        <div className="content">
          <span className="key">Successful Launch:</span>&nbsp;<span className="value">{props.launch_success}</span>
        </div>
        <br />
        <div className="content">
          <span className="key">Successful Landing:</span>&nbsp;<span className="value">{props.launch_landing}</span>
        </div>
        <br />
      </article>
    </a>
  );
};

export default launch;