import PropTypes from "prop-types";
import { Card, CardContent } from "@/components/ui/card";

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {text}
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {number}
            </p>
          </div>
          <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

SummaryCard.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string.isRequired,
};

export default SummaryCard;
