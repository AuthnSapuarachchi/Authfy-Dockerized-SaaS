import Menubar from "../components/Menubar.jsx";
import Header from "../components/Header.jsx";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-vh-100 px-3">
            <Menubar />
            <Header />
        </div>
    );
}

export default Home;