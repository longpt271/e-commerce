import { Carousel } from 'react-bootstrap';

const DetailProductImages = props => {
  // hàm tạo subImg
  const subImgJsx = src => {
    if (src) {
      return (
        <div className="owl-thumb-item flex-fill mb-2 mr-2 mr-sm-0">
          <img
            src={src}
            alt={props.category}
            className="w-100 main-animation"
          />
        </div>
      );
    }
  };
  return (
    <div className="row m-sm-0">
      <div className="col-sm-2 p-sm-0 order-2 order-sm-1 mt-2 mt-sm-0">
        <div
          className="owl-thumbs d-flex flex-row flex-sm-column"
          data-slider-id="1"
        >
          {subImgJsx(props.img1)}
          {subImgJsx(props.img2)}
          {subImgJsx(props.img3)}
          {subImgJsx(props.img4)}
        </div>
      </div>

      <div className="carousel slide col-sm-10 order-1 order-sm-2">
        <Carousel controls="true">
          <Carousel.Item>
            <img src={props.img1} alt={props.category} className="w-100" />
          </Carousel.Item>
          <Carousel.Item>
            <img src={props.img2} alt={props.category} className="w-100" />
          </Carousel.Item>
          <Carousel.Item>
            <img src={props.img3} alt={props.category} className="w-100" />
          </Carousel.Item>
          <Carousel.Item>
            <img src={props.img4} alt={props.category} className="w-100" />
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
};

export default DetailProductImages;
