import React, { useState, useEffect } from 'react';

// function getAlt(path) {
//   let altText = path
//     .replace(/.*\//, '')
//     .replace(/-/g, ' ');

//   altText = /^\d/.test(altText) ? replaceExtension(altText) : altText.replace(/\..*/, '');

//   return altText
// }

// function replaceExtension(alt) {
//   var expressions = {
//     svgz: '.svgz',
//     jpg: '.jpg',
//     png: '.png'
//   }

//   let formattedAltText = alt;

//   for (var key in expressions) {
//     if (expressions.hasOwnProperty(key)) {
//       formattedAltText = formattedAltText.replace(new RegExp(key, 'g'), '');
//     }
//   }

//   return formattedAltText;
// }

function usePositionDetection(ref, shouldQuit = null, yTop = 0, yBottom = 1) {
  const [isBetween, setIsBetween] = React.useState(false);

  const areaTop = window.innerHeight * yTop;
  const areaBottom = window.innerHeight * yBottom;

  function calcIsBetween() {
    if (ref.current === null) return;

    const elementTop = ref.current.getBoundingClientRect().top;
    const elementHeight = ref.current.scrollHeight;
    const elementBottom = elementTop + elementHeight;

    setIsBetween(areaTop < elementBottom && areaBottom > elementTop);
  }

  React.useEffect(() => {
    if (shouldQuit === true) return;

    calcIsBetween();

    const x = window.addEventListener('scroll', () => {
      calcIsBetween();
    });
    return () => window.removeEventListener('scroll', x);
  });

  return isBetween;
}

function useDeferredSource(ref, source, shouldDefer) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const isBetween = usePositionDetection(ref);

  useEffect(() => {
    setHasLoaded(isBetween || hasLoaded);
  }, [isBetween, hasLoaded]);

  if (!shouldDefer) {
    return source;
  }

  if (hasLoaded) return source;
  return '';
}

function Img(props) {
  const ref = React.createRef();
  const src = useDeferredSource(ref, props.src, props.defer);

  return <img style={props.style} ref={ref} src={src} alt={props.alt} title={props.alt} className={props.className} />;
}

export default Img;
