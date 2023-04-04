import Banner from '../Components/HomePage/Banner';
import Categories from '../Components/HomePage/Categories';
import Products from '../Components/HomePage/Products/Products';
import Service from 'Components/HomePage/Service/Service';
import Contact from '../Components/HomePage/Contact/Contact';

const HomePage = () => {
  return (
    <>
      <Banner />
      <Categories />
      <Products />
      <Service />
      <Contact />
    </>
  );
};

export default HomePage;
