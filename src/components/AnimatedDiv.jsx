function AnimatedDiv({ children, config }) {
  let { animation, duration, easing, className } = config;
  return (
    <div
      data-aos={animation ? animation : "zoom-in"}
      data-aos-duration={duration ? duration : "400"}
      data-aos-easing={easing ? easing : "ease-in-out"}
      className={className ? className : ""}
      data-aos-anchor-placement="top-bottom"
    >
      {children}
    </div>
  );
}

export default AnimatedDiv;
