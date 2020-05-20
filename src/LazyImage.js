import React,{useState} from 'react'
import { useInView } from 'react-intersection-observer'
import './LazyImage.css'


const LazyImage = ({ width, height, src, ...rest }) => {

  const handleClick = (e) => {
    console.log(src.replace('compressed','original-background'));
   let url = src.replace('compressed','original-background')
    // e.preventDefault();
    window.open(url,"_blank");
  }
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
    threshold : 1.0
  })
  
  return (
    <div ref={ref} >
      {/* {console.log('***'+src)} */}
      {inView ? (
        <div>
        <div className="container">
        <img className="Image"
          {...rest}
          src={src}
          width={width}
          height={height}
          loading="lazy"
        />
        </div>
        <button className="button" onClick={handleClick}>
        Original Image
        </button>
        </div>
      ) : null}
    </div>
  )
}

export default LazyImage
