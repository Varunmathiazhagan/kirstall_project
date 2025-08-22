import React from 'react';
import Lottie from 'lottie-react';

const LottieAnimation = ({ 
  animationData,
  width = 100,
  height = 100,
  loop = true,
  autoplay = true,
  className = '',
  ...props
}) => {
  if (!animationData) {
    return (
      <div 
        className={`flex items-center justify-center bg-white/10 rounded-lg ${className}`}
        style={{ width, height }}
      >
        <span className="text-white/60 text-sm">No animation</span>
      </div>
    );
  }

  return (
    <div className={className} style={{ width, height }}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: '100%', height: '100%' }}
        {...props}
      />
    </div>
  );
};

export default LottieAnimation;
