
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
        className="md:w-14 md:h-14 face w-12 h-12 items-center justify-items-center cursor-pointer bg-white m-2 rounded-xl"
      >
        {Array.from({ length: props.die.value }, (item, i) => {
          return <div key={i} className="pip w-1.5 h-1.5 md:w-2 md:h-2"></div>;
        })}
      </div>
    </div>
  );
}