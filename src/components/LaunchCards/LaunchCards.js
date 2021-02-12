import React from 'react';
import LaunchCard from './LaunchCard/LaunchCard';
import './LaunchCards.css';

const launchCards = props => {
  console.log(props);
  console.log(props.launches);
  return (
  <section className="userCards">
    {props.launches.slice(props.limit, props.limit + 20).map(p => (
      <LaunchCard
        key={p._id}
        mission_name={p.mission_name}
        flight_number={p.flight_number}
        mission_id={p.mission_id}
        launch_year={p.launch_year}
        launch_success={p.launch_success}
        launch_landing={p.launch_landing}
        image={p.image}
        mission_patch={p.links.mission_patch}
        mission_patch_small={p.links.mission_patch_small}
        article_link={p.links.article_link}
      />
    )
    )}
  </section>
)};
export default launchCards;