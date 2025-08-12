import { useSelector } from 'react-redux';
import RenderPartFour from './RenderPartFour/RenderPartFour';
import RenderPartOne from './RenderPartOne/RenderPartOne';
import RenderPartThree from './RenderPartThree/RenderPartThree';
import RenderPartTwo from './RenderPartTwo/RenderPartTwo';

const ResultTestWriting = ({ numberLession }) => {
	const isShowResult = useSelector(
		(state) => state.generalStore.isShowResult
	);

	return (
		<div
		className="bg-[#f8f9fa] flex flex-col gap-10 md:w-[calc(100vw-var(--sidebar-width))]"
		style={{ "--sidebar-width": !isShowResult ? "270px" : "358px" }}
		>
			{numberLession === 1 && <RenderPartOne />}
			{numberLession === 2 && <RenderPartTwo />}
			{numberLession === 3 && <RenderPartThree />}
			{numberLession === 4 && <RenderPartFour />}
		</div>
	);
};

export default ResultTestWriting;
