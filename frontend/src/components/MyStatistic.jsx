import { Tooltip } from 'flowbite-react';
import { PropTypes } from 'prop-types';

const MyStatistic = ({ icon, tooltip, value }) => (
  <Tooltip content={tooltip}>
    <div className="flex cursor-help flex-row items-center gap-1">
      {icon}
      <p>{value}</p>
    </div>
  </Tooltip>
);

MyStatistic.propTypes = {
  icon: PropTypes.node.isRequired,
  tooltip: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

export default MyStatistic;
