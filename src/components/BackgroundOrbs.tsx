const BackgroundOrbs = () => {
  return (
    <>
      <div 
        className="fixed w-[400px] h-[400px] rounded-full blur-[100px] opacity-60 animate-float -z-10"
        style={{ 
          background: 'hsl(186 100% 50% / 0.15)',
          top: '-100px',
          left: '-100px',
        }}
      />
      <div 
        className="fixed w-[500px] h-[500px] rounded-full blur-[100px] opacity-60 animate-float -z-10"
        style={{ 
          background: 'hsl(285 100% 50% / 0.15)',
          bottom: '-150px',
          right: '-150px',
          animationDelay: '-5s',
        }}
      />
    </>
  );
};

export default BackgroundOrbs;
