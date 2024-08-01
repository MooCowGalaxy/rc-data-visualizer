import { ReferenceLine, ReferenceLineProps } from 'recharts';

const CustomLine = ({stroke, ...props}: { stroke: string } & ReferenceLineProps) => {
    return (
        <ReferenceLine
            {...props}  // First auto-filled props
            stroke={stroke} // Then custom props
        />
    );
};

// Without the following, recharts will not render the component!
CustomLine.displayName = ReferenceLine.displayName;
CustomLine.defaultProps = ReferenceLine.defaultProps;

export default CustomLine;