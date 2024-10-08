import React from 'react'


const Loader = () => {
  return (
    <div className='loader'>
        <div className='loader_image'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100" height="100">
        <path fill="none" d="M0 0h200v200H0z" />
        <path fill="none" strokeLinecap="round" stroke="#0c0c22" strokeWidth={15} transform-origin="center" d="M70 95.5V112m0-84v16.5m0 0a25.5 25.5 0 1 0 0 51 25.5 25.5 0 0 0 0-51Zm36.4 4.5L92 57.3M33.6 91 48 82.7m0-25.5L33.6 49m58.5 33.8 14.3 8.2"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur={2} values="0;-120" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite" /></path>
        <path fill="none" strokeLinecap="round" stroke="#0c0c22" strokeWidth={15} transform-origin="center" d="M130 155.5V172m0-84v16.5m0 0a25.5 25.5 0 1 0 0 51 25.5 25.5 0 0 0 0-51Zm36.4 4.5-14.3 8.3M93.6 151l14.3-8.3m0-25.4L93.6 109m58.5 33.8 14.3 8.2"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur={2} values="0;120" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite" /></path></svg>
        </div>
    </div>
  )
}

export default Loader

