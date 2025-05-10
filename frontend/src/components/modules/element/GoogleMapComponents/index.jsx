import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
    width: "100%",
    height: "400px",
};

const center = {
    lat: -6.4251570861590555, 
    lng: 107.03213737301809, 
};

const GoogleMapComponent = () => {
    return (
        <LoadScript googleMapsApiKey={import.meta.env.GOOGLE_MAP_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
};

export default GoogleMapComponent;
