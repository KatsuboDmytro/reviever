import "./learnMore.scss";

interface Props {
  text: string;
}

export const LearnMore: React.FC<Props> = ({ text }) => {
  return (
    <button className="learn-more">
      <span className="circle" aria-hidden="true">
        <span className="icon arrow"></span>
      </span>
      <span className="button-text">{text}</span>
    </button>
  );
};
