
export default function Dice(props) {
  const styles = {
    backgroundColor: props.die.isHeld ? "#59E391" : "",
    pointerEvents: props.pointerEvent ? "auto" : "none"

  }
  return (
    <div>
      <div
        style={styles}
        onClick={props.holdDice}
        className="face w-14 h-14 items-center justify-items-center cursor-pointer bg-white m-2 rounded-xl"
      >
        {Array.from({ length: props.die.value }, (item, i) => {
          return <div key={i} className="pip"></div>;
        })}
      </div>
    </div>
  );
}