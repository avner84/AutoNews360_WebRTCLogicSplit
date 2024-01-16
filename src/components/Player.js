const Player = ({ videoSrc }) => {
  return (
    <video controls>
      <source src={videoSrc} />
      Your browser does not support the video tag.
    </video>
  );
};

export default Player;
