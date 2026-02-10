import './Loader.css';

const Loader = ({ message = "Chargement..." }) => {
    return (
        <div className="loader-container">
            <div className="pokeball-loader">
                <div className="pokeball-top"></div>
                <div className="pokeball-middle">
                    <div className="pokeball-button"></div>
                </div>
                <div className="pokeball-bottom"></div>
            </div>
            <p className="loader-message">{message}</p>
        </div>
    );
};

export default Loader;
