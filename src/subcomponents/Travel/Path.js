import React from 'react';
import './Path.scss'

export const Startpath = props => (
  <div className="Path">
    <div className="Path__segment">
      <div className="Path__segment-indicator">
        {props.start_loc}
      </div>
      <div className="Path__segment-details">
        {props.start_time}
      </div>
    </div>
    <div className="Path__segment">
      <div className="Path__segment-indicator">
        ...
      </div>
      <div className="Path__segment-details">
        {props.walk_distance_km ? `${props.walk_distance_km}km` : <span>&nbsp;</span>}
      </div>
    </div>
  </div>
);

export const Modepath = props => (
  <div className="Path">
    <div className="Path__segment">
      <div className="Path__segment-indicator">
        {props.path_mode}
      </div>
      <div className="Path__segment-details">
        &nbsp;
      </div>
    </div>
    <div className="Path__segment">
      <div className="Path__segment-indicator">
        ...
      </div>
      <div className="Path__segment-details">
        &nbsp;
      </div>
    </div>
  </div>
);

export const Walkpath = props => (
  <div className="Path">
    <div className="Path__segment">
      <div className="Path__segment-indicator">
        WALK
      </div>
      <div className="Path__segment-details">
        {`${props.walk_distance_km}km`}
      </div>
    </div>
    <div className="Path__segment">
      <div className="Path__segment-indicator">
        ...
      </div>
      <div className="Path__segment-details">
        &nbsp;
      </div>
    </div>
  </div>
);

export const Endpath = props => (
  <div className="Path">
    <div className="Path__segment">
      <div className="Path__segment-indicator">
        ...
      </div>
      <div className="Path__segment-details">
        {props.walk_distance_km ? `${props.walk_distance_km}km` : <span>&nbsp;</span>}
      </div>
    </div>
    <div className="Path__segment">
      <div className="Path__segment-indicator">
        {props.end_loc}
      </div>
      <div className="Path__segment-details">
        {props.end_time}
      </div>
    </div>
  </div>
);