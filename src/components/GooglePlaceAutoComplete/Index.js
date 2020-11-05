import React, { useState, useEffect, useRef } from 'react';
import './css/style.css';

let autoComplete;
const componentForm = {
  sublocality_level_1: 'short_name',
  country: 'short_name',
};

const loadScript = (url, callback) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';

  if (script.readyState) {
    // eslint-disable-next-line func-names
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
};
function formatAddress(addressObject) {
  const address = {};
  for (let i = 0; i < addressObject.address_components.length; i += 1) {
    const addressType = addressObject.address_components[i].types[0];
    if (componentForm[addressType]) {
      const val = addressObject.address_components[i][componentForm[addressType]];
      address[addressType] = val;
    }
  }

  return address;
}
async function handlePlaceSelect(updateQuery, onPlaceSelect) {
  const addressObject = autoComplete.getPlace();

  const formatedAddress = formatAddress(addressObject);
  const place = {
    lat: addressObject.geometry.location.lat(),
    lon: addressObject.geometry.location.lng(),
    ...formatedAddress,
  };

  const query = addressObject.formatted_address;
  updateQuery(query);
  onPlaceSelect(place);
}

function handleScriptLoad(updateQuery, autoCompleteRef, onPlaceSelect) {
  autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current);
  autoComplete.setFields(['address_components', 'formatted_address', 'geometry', 'name']);
  autoComplete.addListener('place_changed', () => handlePlaceSelect(updateQuery, onPlaceSelect));
}

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line react/prop-types
function GooglePlaceAutoComplete({ onPlaceSelect }) {
  const [query, setQuery] = useState('');
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef, onPlaceSelect)
    );
  }, []);

  return (
    <div className="search-location-input">
      <input
        ref={autoCompleteRef}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Enter a City"
        value={query}
      />
    </div>
  );
}

export default GooglePlaceAutoComplete;
